require("dotenv").config(); // ✅ Load environment variables first

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ OpenAI Rewording API Route
app.post("/api/correct-text", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    console.log("🔄 Sending request to OpenAI...");

    // ✅ OpenAI API Request for Rewording
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o", // Use "gpt-4" or "gpt-3.5-turbo" if needed
        messages: [
          {
            role: "system",
            content:
              "You are a professional writer and editor. Rewrite the given text to improve grammar, clarity, and professionalism. Keep the meaning but enhance readability."
          },
          { role: "user", content: `Please reword this text:\n\n"${text}"` }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ OpenAI Response:", response.data);

    const correctedText = response.data.choices[0].message.content.trim();
    res.json({ correctedText });

  } catch (error) {
    console.error("❌ OpenAI API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to reword the text" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
