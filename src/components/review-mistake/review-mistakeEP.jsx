"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ReviewMistake = () => {
  const [mistakes, setMistakes] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [solutions, setSolutions] = useState({});
  const [activeSubject, setActiveSubject] = useState(null); // Track active subject

  useEffect(() => {
    // Fetch the examplan from localStorage
    const storedMistakes =
      JSON.parse(localStorage.getItem("examplan")) || [];
    setMistakes(storedMistakes);

    // Extract unique subjects from examplan
    const uniqueSubjects = [
      ...new Set(storedMistakes.map((item) => item.subject)),
    ];
    setSelectedSubjects(uniqueSubjects); // Set the subjects from examplan

    // Prepare the questions array from the localStorage data
    const questions = storedMistakes.map((item) => ({
      question: item.question, // Use the question text to fetch question_id
    }));

    // Fetch solutions based on question text
    const fetchSolutions = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/createtest/getsolutions`,
          { questions }
        );
        setSolutions(response.data.solutions); // Store the solutions with their corresponding question_id
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    };

    fetchSolutions();
  }, []);

  // Handle subject click and set active subject
  const handleSubjectClick = (subject) => {
    setActiveSubject(subject);
  };

  // Filter questions based on the active subject
  const filteredMistakes = activeSubject
    ? mistakes.filter((item) => item.subject === activeSubject)
    : mistakes;

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 flex flex-col items-center overflow-x-hidden"
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

      {/* Subject Tabs */}
      <motion.div
        className="flex justify-center gap-6 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {selectedSubjects.length > 0 ? (
          selectedSubjects.map((subject, index) => (
            <button
              key={index}
              onClick={() => handleSubjectClick(subject)} // Set active subject on click
              className={`px-6 py-2 flex items-center gap-2 rounded-md border ${
                activeSubject === subject
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-600"
              } font-bold`}
            >
              {subject} Section
            </button>
          ))
        ) : (
          <p className="text-gray-500">No subjects selected</p>
        )}
      </motion.div>

      {/* Mistake Cards - Filtered by Active Subject */}
      <motion.div
        className="mt-6 w-full max-w-3xl space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredMistakes.map((item, index) => {
          const isCorrect = item.isCorrect;
          const selectedAnswer = item.selectedAnswer;
          const correctAnswer = item.correctAnswer;
          const questionText = item.question;

          // Get the solution text using the question_id (stored in solutions map)
          const solutionText = solutions[item.question_id]; // Use the question_id to access solution

          return (
            <motion.div
              key={index}
              className={`p-6 border-l-8 rounded-xl shadow-lg bg-white ${
                isCorrect ? "shadow-green-400" : "shadow-red-600"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-white text-sm font-bold rounded-lg ${
                    isCorrect ? "bg-green-400" : "bg-red-400"
                  }`}
                >
                  {isCorrect ? "Correct Answer" : "Wrong Answer"}
                </span>
              </div>

              {/* Question */}
              <p className="mt-4 font-semibold">Q. {questionText}</p>

              {/* Your Answer & Correct Answer */}
              <div className="mt-2">
                <p className="text-sm font-semibold text-gray-600">
                  Your Answer
                </p>
                <div
                  className={`border p-2 rounded-md ${
                    isCorrect
                      ? "bg-green-100 border-green-400"
                      : "bg-red-100 border-red-400"
                  }`}
                >
                  {selectedAnswer}
                </div>
                <p className="text-sm font-semibold text-gray-600 mt-2">
                  Correct Answer
                </p>
                <div className="border p-2 rounded-md border-blue-400">
                  {correctAnswer}
                </div>
              </div>

              {/* Explanation */}
              <div className="mt-4 border border-gray-300 p-3 rounded-md">
                <p className="font-semibold">Explanation</p>
                <p className="text-sm text-gray-600 mt-1">
                  {solutionText || "Explanation not available"}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default ReviewMistake;
