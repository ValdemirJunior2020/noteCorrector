const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Allow frontend on Netlify + local development
const allowedOrigins = [
  "https://scintillating-horse-0a87dd.netlify.app", // Netlify frontend URL
  "http://localhost:3000" // Local frontend URL
];

// ✅ Configure CORS Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  })
);

app.use(express.json());

app.post("/api/correct-text", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  // Fake response for testing (Replace with OpenAI API Call)
  const correctedText = text.replace("wrld", "world");
  res.json({ correctedText });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
