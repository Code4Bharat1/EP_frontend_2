"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { 
  FaFlask, FaAtom, FaDna, FaEye, FaTrophy, 
  FaCheckCircle, FaTimesCircle, FaBook
} from "react-icons/fa";

// Simple subject configuration
const subjectConfig = {
  Physics: { icon: <FaAtom />, color: "text-blue-600", bgColor: "bg-blue-100" },
  Chemistry: { icon: <FaFlask />, color: "text-green-600", bgColor: "bg-green-100" },
  Biology: { icon: <FaDna />, color: "text-red-600", bgColor: "bg-red-100" },
  Botany: { icon: <FaEye />, color: "text-purple-600", bgColor: "bg-purple-100" },
};

const ResultPage = () => {
  const router = useRouter();
  const { width, height } = useWindowSize();

  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [totalPossibleMarks, setTotalPossibleMarks] = useState(0);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0, unattempted: 0 });

  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem("testAnswers")) || [];
    
    // Get the selected chapters data
    const selectedChapters = JSON.parse(localStorage.getItem("selectedChapters")) || {};
    
    // Calculate total marks
    let totalMarks = 0;
    let totalQuestions = 0;
    Object.values(selectedChapters).forEach(subjectChapters => {
      subjectChapters.forEach(chapter => {
        const questions = Number(chapter.numQuestions) || 0;
        totalMarks += questions * 4;
        totalQuestions += questions;
      });
    });
    setTotalPossibleMarks(totalMarks);

    // Calculate score and stats
    let totalScore = 0;
    let correct = 0;
    let incorrect = 0;
    
    storedAnswers.forEach((answer) => {
      if (answer.isCorrect) {
        totalScore += 4;
        correct++;
      } else {
        totalScore -= 1;
        incorrect++;
      }
    });
    
    setScore(totalScore);
    setStats({
      correct,
      incorrect,
      unattempted: totalQuestions - storedAnswers.length
    });

    // Calculate subject-wise scores
    const subjectsObj = {};
    storedAnswers.forEach((answer) => {
      if (!subjectsObj[answer.subject]) {
        subjectsObj[answer.subject] = { score: 0, total: 0 };
      }
      subjectsObj[answer.subject].score += answer.isCorrect ? 4 : -1;
    });

    // Get subject max marks
    const subjectMaxMarks = {};
    Object.entries(selectedChapters).forEach(([subject, chapters]) => {
      subjectMaxMarks[subject] = chapters.reduce((total, chapter) => {
        return total + (Number(chapter.numQuestions) || 0) * 4;
      }, 0);
    });

    // Build subjects array
    const selectedSubjects = JSON.parse(localStorage.getItem("selectedSubjects")) || [];
    const computedSubjects = selectedSubjects.map((subj) => {
      const config = subjectConfig[subj] || subjectConfig.Physics;
      const subjectScore = subjectsObj[subj]?.score || 0;
      const subjectMax = subjectMaxMarks[subj] || 0;
      
      return {
        name: subj,
        score: subjectScore,
        max: subjectMax,
        ...config
      };
    });
    setSubjects(computedSubjects);

    // Show confetti if good performance
    if (totalMarks > 0 && (totalScore / totalMarks) * 100 >= 70) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, []);

  const percentage = totalPossibleMarks > 0 ? Math.round((score / totalPossibleMarks) * 100) : 0;
  const isGoodPerformance = percentage >= 70;

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gray-100 relative">
      {/* Confetti */}
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}

      {/* Main Content */}
      <div className="w-full h-full max-w-6xl mx-auto p-6 grid grid-cols-2 gap-6">
        {/* Left Side - Score Display */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 opacity-10 text-9xl">
            {isGoodPerformance ? <FaTrophy /> : <FaBook />}
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6">Your Result</h2>
            
            {/* Score Circle */}
            <div className="w-56 h-56 mx-auto bg-white/20 rounded-full flex flex-col items-center justify-center mb-6">
              <span className="text-5xl font-bold">{percentage}%</span>
              <span className="text-lg opacity-80">{score} / {totalPossibleMarks}</span>
            </div>
            
            <h3 className="text-xl font-semibold text-center">
              {isGoodPerformance ? "Excellent Job! 🎉" : "Keep Practicing! 💪"}
            </h3>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <FaCheckCircle className="text-green-400 text-2xl mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.correct}</div>
                <div className="text-sm opacity-80">Correct</div>
              </div>
              <div className="text-center">
                <FaTimesCircle className="text-red-400 text-2xl mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.incorrect}</div>
                <div className="text-sm opacity-80">Incorrect</div>
              </div>
              <div className="text-center">
                <FaBook className="text-yellow-400 text-2xl mx-auto mb-1" />
                <div className="text-2xl font-bold">{stats.unattempted}</div>
                <div className="text-sm opacity-80">Unattempted</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Details & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          {/* Subject Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 flex-1">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Subject Performance</h2>
            
            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${subject.bgColor}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xl ${subject.color}`}>{subject.icon}</span>
                    <span className="font-medium text-gray-800">{subject.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">
                      {subject.score}/{subject.max}
                    </div>
                    <div className="text-sm text-gray-600">
                      {subject.max > 0 ? Math.round((subject.score / subject.max) * 100) : 0}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-bold mb-4 text-gray-800">What's Next?</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/review-mistakeCT")}
                className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Review Mistakes
              </button>
              <button
                onClick={() => router.push("/viewanalyticsCT")}
                className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                View Analytics
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("testAnswers");
                  router.push("/testinterface");
                }}
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Retake Test
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Dashboard
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;