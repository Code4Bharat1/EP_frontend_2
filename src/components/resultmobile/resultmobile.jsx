"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { FaFlask, FaAtom, FaDna, FaEye } from "react-icons/fa";

const subjects = [
  { name: "Physics", score: 80, icon: <FaAtom className="text-red-500 text-lg" />, bgColor: "bg-red-100" },
  { name: "Chemistry", score: 92, icon: <FaFlask className="text-yellow-500 text-lg" />, bgColor: "bg-yellow-100" },
  { name: "Biology", score: 61, icon: <FaDna className="text-green-500 text-lg" />, bgColor: "bg-green-100" },
  { name: "Botany", score: 72, icon: <FaEye className="text-purple-500 text-lg" />, bgColor: "bg-purple-100" },
];

const ResultPageMobile = () => {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  const [score] = useState(76);

  useEffect(() => {
      const timer = setTimeout(() => setShowConfetti(false), 8000); // Stop confetti after 5 sec
      return () => clearTimeout(timer);
    }, []);
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 relative">
            {showConfetti && <Confetti width={500} height={500} numberOfPieces={500} recycle={false} />}

      
      {/* Score Section (40% Height) */}
      <motion.div
        className="h-[40%] bg-gradient-to-b from-[#0077B6] to-[#ADE8F4] flex flex-col items-center justify-center text-white p-6 rounded-b-3xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 className="text-lg font-semibold" animate={{ opacity: 1 }}>
          Your Result
        </motion.h2>  
        <motion.div
          className="w-24 h-24 bg-gradient-to-b from-[#ADE8F4] to-[#0077B6] rounded-full flex flex-col items-center justify-center mt-4 shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-sm">of 100</span>
        </motion.div>
        <motion.h3 className="text-lg font-semibold mt-2">Great</motion.h3>
        <motion.p className="text-sm text-center px-4 mt-1">
          You scored higher than 65% of the people who have taken these tests.
        </motion.p>
      </motion.div>
      
      {/* Summary Section (60% Height) */}
      <motion.div className="h-[60%] p-6 flex flex-col justify-start" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
        <motion.h2 className="text-2xl font-bold text-gray-700 mb-2">Summary</motion.h2>
        {subjects.map((subject, index) => (
          <motion.div
            key={index}
            className={`w-full p-4 mb-2 rounded-lg ${subject.bgColor} shadow-sm flex justify-between items-center`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-2">{subject.icon}<span className="font-semibold text-gray-700">{subject.name}</span></div>
            <span className="font-bold">{subject.score} / 100</span>
          </motion.div>
        ))}
        
        {/* Action Buttons */}
        <motion.div className="flex flex-col gap-3 mt-4 items-center ">
          <motion.button
            className="bg-[#303B59] text-white py-2 px-6 rounded-md w-full text-center hover:bg-gray-800"
            onClick={() => router.push("/review-mistake")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Review Mistake
          </motion.button>
          <motion.button
            className="bg-[#303B59] text-white py-2 px-6 rounded-md w-full text-center hover:bg-gray-800"
            onClick={() => router.push("/testinterface")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retake Test
          </motion.button>
          <motion.button
            className="bg-[#303B59] text-white py-2 px-6 rounded-md w-full text-center hover:bg-gray-800"
            onClick={() => router.push("/viewanalytics")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Analytics
          </motion.button>
          <motion.button
            className="bg-[#303B59] text-white py-2 px-6 rounded-md w-full text-center hover:bg-gray-800"
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResultPageMobile;
