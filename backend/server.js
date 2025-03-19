const cors = require("cors");
const express = require("express");
const app = express();

// ✅ Allow Netlify frontend
const corsOptions = {
  origin: ["https://notecorrector-1.netlify.app"], // Replace with your Netlify domain
  methods: "GET,POST",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/api/correct-text", async (req, res) => {
  try {
    const userText = req.body.text;
    const correctedText = `Reworded: ${userText}`; // Simulating API response
    res.json({ correctedText });
  } catch (error) {
    res.status(500).json({ error: "Failed to process text." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
