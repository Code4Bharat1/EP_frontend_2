"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import axios from "axios"; // Import Axios for API calls

const PredictAIR = () => {
  const [targetScore, setTargetScore] = useState("");
  const [predictedAir, setPredictedAir] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize router for navigation

  // Function to fetch prediction from backend
  const predictAIR = async () => {
    if (!targetScore || targetScore < 0 || targetScore > 720) {
      alert("Please enter a valid score between 0 and 720.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:3306/api/air-predictor/predict", {
        marks: parseInt(targetScore),
      });

      if (response.data && response.data.predicted_air !== undefined) {
        setPredictedAir(response.data.predicted_air); // Store API response correctly
      } else {
        setPredictedAir("N/A"); // Handle unexpected API responses
      }
    } catch (err) {
      console.error("API error:", err);
      setError("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to College Prediction Page
  const handleFindColleges = () => {
    router.push(`/collegepredictor?airRank=${predictedAir}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-5">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl gap-8 items-center">
        
        {/* Left Side - Smaller Image */}
        <div className="flex justify-center">
          <img
            src="/rafiki.png"
            alt="Air prediction"
            width={300}
            height={300}
            className="object-contain w-full max-w-md"
          />
        </div>

        {/* Right Side - Larger Form Container */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-center text-2xl font-bold mb-6">Predict AIR</h2>

          <label className="block text-gray-600 text-sm mb-2">Target Score</label>
          <input
            type="number"
            placeholder="Out of 720"
            value={targetScore}
            onChange={(e) => setTargetScore(e.target.value)}
            className="w-full border rounded-lg px-5 py-3 mb-5 focus:outline-none focus:ring-4 focus:ring-blue-500"
          />

          <div className="text-center">
            <h3 className="text-gray-600 text-sm">Predicted AIR</h3>
            <div className="w-32 h-32 mx-auto bg-[#70C0DE] text-white rounded-full flex items-center justify-center text-2xl font-bold mt-3">
              {loading ? "⏳" : predictedAir !== null ? predictedAir : "?"}
            </div>
          </div>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}

          {/* Predict AIR Button */}
          <button
            onClick={predictAIR}
            className="w-full bg-[#286D96] text-white py-3 rounded-lg font-bold mt-5 hover:bg-[#70C0DE] transition"
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>

          {/* "Find Colleges" Button (Appears After Prediction) */}
          {predictedAir !== null && (
            <button
              onClick={handleFindColleges}
              
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mt-3 hover:bg-green-700 transition"
            >
              Find Colleges
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictAIR;
