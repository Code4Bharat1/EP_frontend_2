"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { FaFlask, FaAtom, FaDna, FaEye } from "react-icons/fa";

// Icon and background color mappings for subjects
const subjectMapping = {
  Physics: {
    icon: <FaAtom className="text-red-500 text-lg" />,
    bgColor: "bg-red-100",
  },
  Chemistry: {
    icon: <FaFlask className="text-yellow-500 text-lg" />,
    bgColor: "bg-yellow-100",
  },
  Biology: {
    icon: <FaDna className="text-green-500 text-lg" />,
    bgColor: "bg-green-100",
  },
  Botany: {
    icon: <FaEye className="text-purple-500 text-lg" />,
    bgColor: "bg-purple-100",
  },
};

const ResultPageMobile = () => {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    // Load stored exam data
    const storedExamplan = JSON.parse(localStorage.getItem("examplan")) || [];
    const selectedSubjects = JSON.parse(localStorage.getItem("selectedSubjects")) || [];

    // Calculate overall score
    let total = 0;
    storedExamplan.forEach(ans => {
      total += ans.isCorrect ? 4 : -1;
    });
    const maxOverall = storedExamplan.length * 4;
    setScore(total);
    setMaxScore(maxOverall || 0);

    // Calculate subject-wise
    const subjAgg = {};
    storedExamplan.forEach(ans => {
      if (!subjAgg[ans.subject]) subjAgg[ans.subject] = { score: 0, count: 0 };
      subjAgg[ans.subject].score += ans.isCorrect ? 4 : -1;
      subjAgg[ans.subject].count += 1;
    });

    const comp = selectedSubjects.map(name => {
      const data = subjectMapping[name] || {};
      const s = subjAgg[name]?.score || 0;
      const c = subjAgg[name]?.count || 0;
      return {
        name,
        score: s,
        max: c * 4,
        icon: data.icon || <FaAtom className="text-gray-500 text-lg" />,
        bgColor: data.bgColor || "bg-gray-100",
      };
    });
    setSubjects(comp);

    // Trigger confetti on >=70%
    if (maxOverall > 0 && (total / maxOverall) * 100 >= 70) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRetake = () => {
    localStorage.removeItem("examplan");
    router.push("/testinterface");
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 relative">
      {showConfetti && (
        <Confetti width={500} height={500} numberOfPieces={500} recycle={false} />
      )}

      {/* Score Section (40% Height) */}
      <motion.div
        className="h-[40%] bg-gradient-to-b from-[#0077B6] to-[#ADE8F4] flex flex-col items-center justify-center text-white p-6 rounded-b-3xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 className="text-lg font-semibold">Your Result</motion.h2>
        <motion.div
          className="w-24 h-24 bg-gradient-to-b from-[#ADE8F4] to-[#0077B6] rounded-full flex flex-col items-center justify-center mt-4 shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-sm">of {maxScore}</span>
        </motion.div>
        <motion.h3 className="text-lg font-semibold mt-2">
          {(maxScore > 0 && (score / maxScore) * 100 >= 70) ? "Great 🎉" : "Keep Improving 💪"}
        </motion.h3>
        <motion.p className="text-sm text-center px-4 mt-1">
          Your percentage: {maxScore > 0 ? Math.round((score / maxScore) * 100) : 0}%
        </motion.p>
      </motion.div>

      {/* Summary Section (60% Height) */}
      <motion.div
        className="h-[60%] p-6 flex flex-col justify-start"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h2 className="text-2xl font-bold text-gray-700 mb-2">Summary</motion.h2>
        {subjects.map((subj, idx) => (
          <motion.div
            key={idx}
            className={`w-full p-4 mb-2 rounded-lg ${subj.bgColor} shadow-sm flex justify-between items-center`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              {subj.icon}
              <span className="font-semibold text-gray-700">{subj.name}</span>
            </div>
            <span className="font-bold">{subj.score} / {subj.max}</span>
          </motion.div>
        ))}

        {/* Action Buttons */}
        <motion.div className="flex flex-col gap-3 mt-4 items-center">
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
            onClick={handleRetake}
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
