const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Chatbot logic
const chatbotController = async (req, res) => {
  const { message } = req.body;
  console.log("Chatbot endpoint hit, message:", message);

  try {
    const response = await openai.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `
You are a helpful assistant for ClassSync. Only answer questions related to dashboards, schedules, teachers, substitutions, and user roles.
          `.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content;
    res.json({ reply });
  } catch (error) {
    console.error("Groq chatbot error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from chatbot" });
  }
};

module.exports = { chatbotController };