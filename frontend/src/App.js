import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Sentiment from "./components/Sentiment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sentiment" element={<Sentiment />} />
      </Routes>
    </Router>
  );
}

export default App;
