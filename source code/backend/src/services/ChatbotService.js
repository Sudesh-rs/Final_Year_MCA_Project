require("dotenv").config();
const fs = require("fs");
const path = require("path");
const ProductService = require("./ProductService");

class ChatboatService {
  // The client gets the API key from the environment variable `GEMINI_API_KEY`.

  getProjectContext() {
    try {
      const contextPath = path.resolve(__dirname, "../project-context.txt");
      if (fs.existsSync(contextPath)) {
        const content = fs.readFileSync(contextPath, "utf-8").trim();
        if (content) {
          return `Project Context:\n${content}`;
        }
      }
    } catch (error) {
      console.error("Failed to load project context:", error);
    }
    return "";
  }

  createSystemPrompt() {
    const projectContext = this.getProjectContext();

    return `You are the IntelliMart AI assistant for an eCommerce platform called IntelliMart.
You help customers and sellers with the website, product features, cart and order management, payment, wishlist, coupons, and seller tools.
Answer in a friendly, concise way and take questions as being about this IntelliMart app.
If the user asks about \"this platform\", describe IntelliMart's features, user flows, and how customers interact with products, cart, orders, and seller dashboards.
${projectContext ? `\n${projectContext}` : ""}`;
  }

  async chatService(contents) {
    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

    const allContents = [
      {
        role: "MODEL",
        parts: [{ text: this.createSystemPrompt() }],
      },
      ...contents,
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: allContents,
    });

    console.log(response.text);
    return response.text;
  }

  async askProductQuestion(productId, userQuestion) {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

      // ✅ CASE 1: GLOBAL CHAT (no productId)
      if (!productId) {
        const contents = [
          {
            role: "MODEL",
            parts: [{ text: this.createSystemPrompt() }],
          },
          {
            role: "USER",
            parts: [{ text: userQuestion }],
          },
        ];

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents,
        });

        return response.text;
      }

      // ✅ CASE 2: PRODUCT CHAT
      const product = await ProductService.findProductById(productId);

      console.log("product ", product);

      if (!product) {
        return "Sorry, the product you're asking about does not exist.";
      }

      const productDetails = JSON.stringify(product);

      const prompt = `
You are an eCommerce assistant.
Answer ONLY based on the product details below.

--- PRODUCT DETAILS ---
${productDetails}
-----------------------

Question: ${userQuestion}
Answer:
`;

      const contents = [
        {
          role: "MODEL",
          parts: [{ text: this.createSystemPrompt() }],
        },
        {
          role: "USER",
          parts: [{ text: prompt }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      return response.text;

    } catch (error) {
      console.error("AI Error:", error);
      throw new Error(error.message);
    }
  }
}

module.exports = new ChatboatService();
