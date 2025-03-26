"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import "chart.js/auto";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";

Chart.register(ArcElement);

const testData = Array(15).fill({
  testName: "Biology",
  time: "30 Min",
  difficulty: "Hard",
  subject: "Biology",
  scores: { physics: 20, chemistry: 30, biology: 50 },
  totalScore: 100,
  chapters: [
    { name: "Diversity in Living World", questions: 1, marks: 4 },
    { name: "Structural Organization", questions: 1, marks: 4 },
    { name: "Cell Structure", questions: 1, marks: 4 },
  ],
  totalQuestions: 23,
  totalMarks: 92,
});

const AlreadyCreatedTest = () => {
  const [selectedTest, setSelectedTest] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center relative">
      {/* Header Button */}
      <motion.button 
        className="bg-[#49A6CF] text-white px-6 py-2 rounded-lg text-lg hover-[#49A6CF]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Already Created Test
      </motion.button>

      <motion.hr 
        className="mt-4 border-gray-300 w-full" 
        initial={{ scaleX: 0 }} 
        animate={{ scaleX: 1 }} 
        transition={{ duration: 0.5 }} 
      />

      {/* Test Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6 w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {testData.map((test, index) => (
          <motion.div
            key={index}
            className="p-6 border-2 border-blue-300 rounded-xl shadow-md bg-white flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => setSelectedTest(test)}
          >
            {/* Top Row: Test Name & Difficulty (Left), Time & Subject (Center), Chart (Right) */}
            <div className="flex items-start justify-between w-full">
              {/* Left Column: Test Name & Difficulty */}
              <div className="flex flex-col gap-2">
                {/* Test Name */}
                <div>
                  <p className="text-sm text-gray-600">Test Name</p>
                  <p className="text-lg font-bold">{test.testName}</p>
                </div>
                {/* Difficulty Level */}
                <div>
                  <p className="text-sm text-gray-600">Difficulty Level</p>
                  <p className="text-lg font-bold">{test.difficulty}</p>
                </div>
              </div>

              {/* Middle Column: Time & Subject */}
              <div className="flex flex-col items-end gap-2">
                {/* Time */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="text-lg font-bold flex items-center gap-1">
                    {test.time} <FaMoon className="text-black" />
                  </p>
                </div>
                {/* Subject */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">Subject</p>
                  <p className="text-lg font-bold">{test.subject}</p>
                </div>
              </div>

              {/* Right Column: Chart */}
              <div className="relative w-20 h-20 flex-shrink-0 ml-4">
                <Doughnut
                  data={{
                    labels: ["Physics", "Chemistry", "Biology"],
                    datasets: [
                      {
                        data: [
                          test.scores.physics,
                          test.scores.chemistry,
                          test.scores.biology
                        ],
                        backgroundColor: ["#FF4D4D", "#FFCC00", "#007BFF"],
                        borderWidth: 2,
                        cutout: "70%",
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: false },
                    },
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                  {test.scores.physics + test.scores.chemistry + test.scores.biology} / {test.totalScore}
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-400" />

            {/* Bottom Row: View Test Description & Arrow */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">View Test Description</p>
              <FaArrowRight className="text-blue-500" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Popup Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedTest(null)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Overview</h2>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full border p-2 rounded-md"
                value={selectedTest.testName}
                readOnly
              />
              <input
                type="text"
                className="w-full border p-2 rounded-md"
                value={selectedTest.subject}
                readOnly
              />
              {selectedTest.chapters && (
                <div className="flex flex-wrap gap-4">
                  {selectedTest.chapters.map((chapter, i) => (
                    <div
                      key={i}
                      className="border p-2 rounded-md flex items-center space-x-2"
                    >
                      <p>{chapter.name}</p>
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded-md">
                        {chapter.questions} Questions
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded-md">
                        {chapter.marks} Marks
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AlreadyCreatedTest;
