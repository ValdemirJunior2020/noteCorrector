import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [note, setNote] = useState("");
  const [correctedNote, setCorrectedNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Function to correct text
  const handleCorrection = async () => {
    if (!note.trim()) {
      alert("Please enter text to correct.");
      return;
    }

    setLoading(true);

    try {
      console.log("🔄 Sending request to backend...");

      const response = await axios.post("http://localhost:5000/api/correct-text", { text: note });

      if (response.data && response.data.correctedText) {
        setCorrectedNote(response.data.correctedText);
        setShowPopup(true);
      } else {
        console.error("Unexpected API response:", response.data);
        alert("Unexpected response from backend. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error correcting text:", error);
      alert(`Failed to correct the text: ${error.response?.data?.error || error.message}`);
    }

    setLoading(false);
  };

  // ✅ Function to copy text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(correctedNote).then(() => {
      alert("✅ Corrected text copied to clipboard!");
    });
  };

  return (
    <div className="app-container">
      <h1>Call Center Note Corrector</h1>
      
      <textarea
        className="note-input"
        placeholder="Type your note here..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      ></textarea>

      <div className="button-container">
        <button className="btn correct-btn" onClick={handleCorrection} disabled={loading}>
          {loading ? "Correcting..." : "Correct My Notes"}
        </button>
        
        <button className="btn copy-btn" onClick={copyToClipboard} disabled={!correctedNote}>
          Copy to Clipboard
        </button>
      </div>

      {showPopup && (
        <div className="popup">
          <h3>Corrected Note:</h3>
          <textarea className="corrected-text" value={correctedNote} readOnly></textarea>
          <button className="btn close-btn" onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;
