const cors = require("cors");
const express = require("express");
const app = express();

// ✅ Correct CORS configuration
const corsOptions = {
  origin: ["https://notecorrector-1.netlify.app"], // Replace with your actual Netlify domain
  methods: "GET,POST",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Ensure your endpoint returns status 200 (not 204)
app.options("*", cors(corsOptions));

app.post("/api/correct-text", async (req, res) => {
  try {
    const userText = req.body.text;
    const correctedText = `Reworded: ${userText}`; // Simulating API response
    res.status(200).json({ correctedText }); // ✅ Make sure response has status 200
  } catch (error) {
    res.status(500).json({ error: "Failed to process text." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
