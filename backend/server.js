require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();

// ✅ Allow CORS for frontend (Netlify & Localhost)
app.use(cors({ origin: ["http://localhost:3000", "https://notecorrector-1.netlify.app"] }));
app.use(express.json());

// ✅ Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load API Key from .env
});

// ✅ API Route to Correct Text
app.post("/api/correct-text", async (req, res) => {
  try {
    const userText = req.body.text;
    if (!userText) {
      return res.status(400).json({ error: "No text provided" });
    }

    // ✅ Send text to OpenAI for rewording
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Use GPT-4o for better rewording
      messages: [
        { role: "system", content: "You are a professional editor. Reword the given text while keeping its meaning the same." },
        { role: "user", content: `Reword this: "${userText}"` },
      ],
    });

    // ✅ Extract the reworded text from OpenAI response
    const correctedText = completion.choices[0].message.content;

    res.status(200).json({ correctedText }); // ✅ Send reworded text to frontend
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to process text with AI." });
  }
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
