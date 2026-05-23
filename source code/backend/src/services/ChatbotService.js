require("dotenv").config();
const fs = require("fs");
const path = require("path");
const ProductService = require("./ProductService");
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

class ChatboatService {
  // Path to project data file
  getProjectDataPath() {
    return path.join(__dirname, "../../PROJECT_DATA.txt");
  }

  // Read project data from file
  readProjectData() {
    try {
      const filePath = this.getProjectDataPath();
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, "utf-8");
      }
      return "Project data file not found. Please add content to PROJECT_DATA.txt";
    } catch (error) {
      console.error("Error reading project data:", error);
      return "Unable to read project data.";
    }
  }

  // Global chat - reads from PROJECT_DATA.txt file
  async chatService(message, context = "") {
    try {
      // Try to read from project data file first
      const projectData = this.readProjectData();
      
      // If custom context is provided, use that. Otherwise use project data.
      const effectiveContext = context || projectData;
      
      const prompt = `You are a helpful project assistant. Use the following project information to answer questions accurately and professionally.

--- PROJECT INFORMATION ---
${effectiveContext}
-----------------------

Question: ${message}

Answer: (Be concise, helpful, and relevant to the project)`;

      console.log("Global Chat - Using context from:", context ? "User input" : "PROJECT_DATA.txt");

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

      const contents = [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ];

      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,
        contents,
      });

      console.log("Global Chat Response:", response.text);
      return response.text;
    } catch (error) {
      console.error("Chat Service Error:", error);
      throw new Error("Failed to process your question: " + error.message);
    }
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
          model: DEFAULT_MODEL,
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
