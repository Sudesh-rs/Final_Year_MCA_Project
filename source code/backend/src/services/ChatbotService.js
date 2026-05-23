require("dotenv").config();
const fs = require("fs");
const ProductService = require("./ProductService");

class ChatboatService {
  // The client gets the API key from the environment variable `GEMINI_API_KEY`.

  async chatService(contents) {
    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
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
            role: "user",
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
          role: "user",
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
