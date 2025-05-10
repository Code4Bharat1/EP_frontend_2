"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const ReviewMistake = () => {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const testId = searchParams.get("test-id");
  console.log("Fetched Test ID in Review Mistake Page:", testId);
  
  useEffect(() => {
    const fetchMistakes = async () => {
      try {
        const authToken =
          typeof window !== "undefined" && localStorage.getItem("authToken");
        if (!authToken) throw new Error("User not authenticated");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/fulltest/review`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
            params: { testId },
          }
        );

        const { correctAnswers, wrongAnswers, unanswered } =
          response.data.reviewData;
        const formattedMistakes = [
          ...correctAnswers.map((item) => ({ ...item, isCorrect: true })),
          ...wrongAnswers.map((item) => ({ ...item, isCorrect: false })),
          ...unanswered.map((item) => ({ ...item, isCorrect: false })),
        ];
        setMistakes(formattedMistakes);
      } catch (err) {
        console.error("❌ Error fetching review mistakes:", err);
        setError(
          "Failed to load review mistakes. Please check the test ID or try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchMistakes();
    } else {
      setError("Test ID not provided.");
      setLoading(false);
    }
  }, [testId]);

  if (loading)
    return <p className="text-center text-xl">Loading mistakes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className="bg-blue-400 text-white px-6 py-2 rounded-lg text-lg hover:bg-blue-500"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Review Mistake
      </motion.button>

      <motion.hr
        className="mt-4 border-gray-300 w-screen"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />

      <motion.h1
        className="text-2xl font-bold mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Review Your Test
      </motion.h1>

      <motion.div
        className="mt-6 w-full max-w-3xl space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {mistakes.length === 0 && (
          <p className="text-center text-lg text-gray-500">
            No mistakes found!
          </p>
        )}
        {mistakes.map((item) => (
          <motion.div
            key={item.questionId}
            className={`p-6 border-l-8 rounded-xl shadow-lg bg-white ${
              item.isCorrect ? "shadow-green-400" : "shadow-red-600"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 text-white text-sm font-bold rounded-lg ${
                  item.isCorrect ? "bg-green-400" : "bg-red-400"
                }`}
              >
                {item.isCorrect ? "Correct Answer" : "Wrong Answer"}
              </span>
              <span className="text-gray-600 font-bold">
                (QID: {item.questionId})
              </span>
            </div>

            <p className="mt-4 font-semibold">Q. {item.questionText}</p>

            <div className="mt-2">
              <p className="text-sm font-semibold text-gray-600">Your Answer</p>
              <div
                className={`border p-2 rounded-md ${
                  item.yourAnswer === item.correctAnswer
                    ? "border-green-400"
                    : "border-red-400"
                }`}
              >
                {item.yourAnswer || "Not Answered"}
              </div>

              <p className="text-sm font-semibold text-gray-600 mt-2">
                Correct Answer
              </p>
              <div className="border p-2 rounded-md border-blue-400">
                {item.correctAnswer || "Not Available"}
              </div>
            </div>

            <div className="mt-4 border border-gray-300 p-3 rounded-md">
              <p className="font-semibold">Explanation</p>
              <p className="text-sm text-gray-600 mt-1">
                {item.explanation || "Explanation not available"}
              </p>
            </div>

            {/* <div className="mt-4">
              <p className="text-sm font-semibold text-gray-600">Time Taken</p>
              <div className="border p-2 rounded-md border-yellow-400 inline-block">
                {item.timeSpent || "Time not recorded"}
              </div>
            </div> */}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ReviewMistake;
