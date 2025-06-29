const express = require("express");
const router = express.Router();
const { chatbotController } = require("../controllers/chatbotController");

router.post("/ask", chatbotController);

module.exports = router;