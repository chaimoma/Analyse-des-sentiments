import React, { useState } from "react";

export default function Sentiment() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://backend:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("JWT token missing. Please login first.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Prediction failed");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Error predicting sentiment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h2>Sentiment Analysis</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          rows={5}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Analyze
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f0f4f8", borderRadius: "5px" }}>
          <p><strong>Sentiment:</strong> {result.sentiment}</p>
          <p><strong>Original Score:</strong> {result.original_label}</p>
        </div>
      )}
    </div>
  );
}
