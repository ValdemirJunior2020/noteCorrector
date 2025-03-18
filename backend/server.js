require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


app.post("/api/correct-text", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    console.log("🔄 Sending request to OpenAI API...");

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4", // ✅ Use "gpt-4" or "gpt-3.5-turbo" for faster, cheaper response
        messages: [
          { role: "system", content: "You are an AI assistant that rewrites call center agent notes to be more professional, clear, and structured. Retain all critical details while improving grammar, readability, and conciseness." },
          { role: "user", content: `Please reword and improve the clarity of this note: "${text}"` }
        ],
        max_tokens: 150
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ OpenAI Response:", response.data);

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return res.json({ correctedText: response.data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: "Unexpected response from OpenAI API" });
    }
  } catch (error) {
    console.error("❌ Error calling OpenAI API:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data?.error?.message || "Error processing request" });
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
