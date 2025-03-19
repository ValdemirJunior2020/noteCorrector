import React, { useState } from "react";
import axios from "axios";

const NoteCorrector = () => {
  // ✅ Define state variables
  const [note, setNote] = useState("");
  const [correctedNote, setCorrectedNote] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Backend URL (use env variable or fallback to Render URL)
  const API_URL = process.env.REACT_APP_BACKEND_URL || "https://notecorrector-1.onrender.com";

  const handleCorrection = async () => {
    if (!note.trim()) {
      alert("⚠️ Please enter text to correct.");
      return;
    }

    setLoading(true);

    try {
      console.log("🚀 Sending request to backend...");

      const response = await axios.post(
        `${API_URL}/api/correct-text`,
        { text: note },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ API Response:", response.data);

      if (response.data && response.data.correctedText) {
        setCorrectedNote(response.data.correctedText);
        setShowPopup(true);
      } else {
        console.error("⚠️ Unexpected API response format:", response.data);
        alert("Unexpected response from the backend. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error correcting text:", error);

      if (error.response) {
        console.error("Response Data:", error.response.data);
        alert(`API Error: ${JSON.stringify(error.response.data, null, 2)}`);
      } else if (error.request) {
        console.error("No Response Received:", error.request);
        alert("No response from the backend. Check your API URL and network connection.");
      } else {
        console.error("Request Setup Error:", error.message);
        alert(`Request Error: ${error.message}`);
      }
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Call Center Note Corrector</h2>

      <textarea
        rows="6"
        cols="50"
        placeholder="Type your note here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      ></textarea>

      <br />

      <button onClick={handleCorrection} style={{ marginTop: "10px" }} disabled={loading}>
        {loading ? "Correcting..." : "Correct My Notes"}
      </button>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            backgroundColor: "white",
            border: "1px solid black",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
          }}
        >
          <h3>Corrected Note:</h3>
          <textarea rows="4" cols="50" value={correctedNote} readOnly></textarea>
          <br />
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default NoteCorrector;
