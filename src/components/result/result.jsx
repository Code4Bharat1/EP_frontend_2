"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import axios from "axios";
import { FaFlask, FaAtom, FaDna, FaEye } from "react-icons/fa";

const ResultPage = () => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [testId, setTestId] = useState(null);
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) throw new Error("User not authenticated");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/fulltest/results`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const data = response.data.testResult;
        const parsedSubjectPerformance = JSON.parse(
          data.subjectWisePerformance || "[]"
        );
        setResultData({
          ...data,
          subjectWisePerformance: parsedSubjectPerformance,
        });
        setTestId(data.testResult?.id || data.id);
        if (data.marksObtained >= 70) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 6000);
        }
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching test result:", err);
        setError("Failed to load test result.");
        setLoading(false);
      }
    };
    fetchResult();
  }, []);
  console.log("Test ID:", testId);
  const handleReviewMistakes = () => {
    if (!testId) {
      console.error("❌ Test ID is missing. Cannot proceed.");
      return;
    }
    router.push(`/review-mistake?test-id=${testId}`);
  };
  const handleRetakeTest = () => router.push("/testinterface");
  const handleViewAnalytics = () => router.push("/viewanalytics");
  const handleDashboard = () => router.push("/dashboard");

  if (loading) return <p className="text-center text-xl">Loading results...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  const { marksObtained, totalMarks, subjectScores } = resultData;

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gray-100 relative">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={500}
          recycle={false}
        />
      )}
      <div className="w-full h-full flex flex-col md:flex-row bg-white shadow-lg">
        <motion.div
          className="w-full md:w-[40%] h-full bg-gradient-to-b from-[#0077B6] to-[#ADE8F4] flex flex-col items-center justify-center text-white p-6 rounded-r-3xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 className="text-lg font-semibold">Your Result</motion.h2>
          <motion.div
            className="w-40 h-40 bg-gradient-to-b from-[#ADE8F4] to-[#0077B6] rounded-full flex flex-col items-center justify-center mt-4 shadow-md"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <motion.span className="text-4xl font-bold">
              {marksObtained}
            </motion.span>
            <motion.span className="text-lg">of {totalMarks}</motion.span>
          </motion.div>
          <motion.h3 className="text-xl font-semibold mt-4">
            {marksObtained >= 70 ? "Excellent 🎉" : "Keep Improving 💪"}
          </motion.h3>
        </motion.div>

        {/* Right Section - Summary and Actions */}
        <motion.div
          className="w-full md:w-[60%] h-full p-6 flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2 className="text-4xl font-bold text-gray-700 mb-4">
            Summary
          </motion.h2>
          {/* Subject Scores */}
          {resultData?.subjectWisePerformance.map((subject, index) => (
            <motion.div
              key={index}
              className="w-20 md:w-3/4 p-4 mb-2 rounded-3xl bg-gray-100 shadow-sm mx-auto"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {subject[0] === "Physics" && (
                    <FaAtom className="text-red-500 text-xl" />
                  )}
                  {subject[0] === "Chemistry" && (
                    <FaFlask className="text-yellow-500 text-xl" />
                  )}
                  {subject[0] === "Biology" && (
                    <FaDna className="text-green-500 text-xl" />
                  )}
                  <span className="font-semibold text-gray-700">
                    {subject[0]}
                  </span>
                </div>
                <span className="font-bold">{subject[4]} / 100</span>
              </div>
            </motion.div>
          ))}
          {/* Action Buttons */}
          <motion.div className="flex flex-col gap-3 mt-6 items-center">
            <motion.button
              className="bg-[#303B59] text-white py-2 px-8 rounded-md w-64 hover:bg-gray-800"
              onClick={handleReviewMistakes}
            >
              Review Mistakes
            </motion.button>
            <motion.button
              className="bg-[#303B59] text-white py-2 px-8 rounded-md w-64 hover:bg-gray-800"
              onClick={handleRetakeTest}
            >
              Retake Test
            </motion.button>
            <motion.button
              className="bg-[#303B59] text-white py-2 px-8 rounded-md w-64 hover:bg-gray-800"
              onClick={handleViewAnalytics}
            >
              View Analytics
            </motion.button>
            <motion.button
              className="bg-[#303B59] text-white py-2 px-8 rounded-md w-64 hover:bg-gray-800"
              onClick={handleDashboard}
            >
              Continue
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;
