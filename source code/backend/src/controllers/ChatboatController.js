const ChatbotService = require("../services/ChatbotService.js");

class ChatboatController {

  // ✅ Global simple chat (no product)
  async simpleChat(req, res) {
    try {
      const message = req.body.message;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const answer = await ChatbotService.askProductQuestion(null, message);
      return res.status(200).json({ answer });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async askProductQuestionController(req, res) {
    try {
      const productId = req.params.productId || null;
      const question = req.body.question || req.body.message;

      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }

      const answer = await ChatbotService.askProductQuestion(
        productId,
        question
      );

      res.status(200).json({ answer });

    } catch (error) {
      console.error("Controller Error:", error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ChatboatController();