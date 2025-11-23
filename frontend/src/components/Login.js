import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://backend:8000";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      navigate("/sentiment");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check username/password.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f4f8", fontFamily: "Arial, sans-serif" }}>
      <form onSubmit={handleLogin} style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)", width: "320px", textAlign: "center" }}>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Login</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
        <button
          type="submit"
          style={{ width: "100%", padding: "10px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
