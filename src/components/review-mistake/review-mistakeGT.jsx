"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaLightbulb, 
  FaAtom, 
  FaFlask, 
  FaDna, 
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaFilter
} from "react-icons/fa";

// Subject configuration with icons and colors
const subjectConfig = {
  Physics: { 
    icon: <FaAtom />, 
    color: "text-blue-600", 
    bgColor: "bg-blue-50", 
    borderColor: "border-blue-200",
    hoverBg: "hover:bg-blue-100"
  },
  Chemistry: { 
    icon: <FaFlask />, 
    color: "text-green-600", 
    bgColor: "bg-green-50", 
    borderColor: "border-green-200",
    hoverBg: "hover:bg-green-100"
  },
  Biology: { 
    icon: <FaDna />, 
    color: "text-red-600", 
    bgColor: "bg-red-50", 
    borderColor: "border-red-200",
    hoverBg: "hover:bg-red-100"
  },
  Botany: { 
    icon: <FaEye />, 
    color: "text-purple-600", 
    bgColor: "bg-purple-50", 
    borderColor: "border-purple-200",
    hoverBg: "hover:bg-purple-100"
  },
};

const ReviewMistake = () => {
  const [mistakes, setMistakes] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [solutions, setSolutions] = useState({});
  const [activeSubject, setActiveSubject] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [filterType, setFilterType] = useState('all'); // all, correct, incorrect

  useEffect(() => {
    const storedMistakes = JSON.parse(localStorage.getItem("testAnswers")) || [];
    setMistakes(storedMistakes);

    const storedSubjects = JSON.parse(localStorage.getItem("selectedSubjects") || "[]");
    setSelectedSubjects(storedSubjects);

    // Set first subject as active by default
    if (storedSubjects.length > 0) {
      setActiveSubject(storedSubjects[0]);
    }

    // Fetch solutions
    const questions = storedMistakes.map((item) => ({
      question: item.question,
    }));

    const fetchSolutions = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/createtest/getsolutions`,
          { questions }
        );
        setSolutions(response.data.solutions);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    };

    fetchSolutions();
  }, []);

  // Handle card expansion
  const toggleCard = (index) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  // Filter questions based on the active subject and filter type
  const filteredMistakes = mistakes.filter((item) => {
    const subjectMatch = activeSubject ? item.subject === activeSubject : true;
    const filterMatch = 
      filterType === 'all' ? true :
      filterType === 'correct' ? item.isCorrect :
      filterType === 'incorrect' ? !item.isCorrect :
      true;
    return subjectMatch && filterMatch;
  });

  // Calculate statistics
  const getSubjectStats = (subject) => {
    const subjectMistakes = mistakes.filter(item => item.subject === subject);
    const correct = subjectMistakes.filter(item => item.isCorrect).length;
    const incorrect = subjectMistakes.filter(item => !item.isCorrect).length;
    return { correct, incorrect, total: subjectMistakes.length };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Review Your Answers</h1>
              <p className="text-sm text-gray-600 mt-1">
                Analyze your performance and learn from mistakes
              </p>
            </div>
            
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Answers</option>
                <option value="correct">Correct Only</option>
                <option value="incorrect">Incorrect Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Subject Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedSubjects.map((subject, index) => {
            const config = subjectConfig[subject] || subjectConfig.Physics;
            const stats = getSubjectStats(subject);
            const isActive = activeSubject === subject;
            
            return (
              <motion.button
                key={index}
                onClick={() => setActiveSubject(subject)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  isActive 
                    ? `${config.bgColor} ${config.borderColor} ${config.color}` 
                    : `bg-white border-gray-200 text-gray-600 ${config.hoverBg}`
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={isActive ? config.color : "text-gray-400"}>
                  {config.icon}
                </span>
                <span className="font-medium">{subject}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/50' : 'bg-gray-100'
                }`}>
                  {stats.correct}/{stats.total}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Summary Stats */}
        {activeSubject && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {(() => {
              const stats = getSubjectStats(activeSubject);
              const config = subjectConfig[activeSubject] || subjectConfig.Physics;
              return (
                <>
                  <div className={`p-4 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheckCircle className="text-green-600" />
                      <span className="text-sm text-gray-600">Correct Answers</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">{stats.correct}</div>
                  </div>
                  <div className={`p-4 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <FaTimesCircle className="text-red-600" />
                      <span className="text-sm text-gray-600">Incorrect Answers</span>
                    </div>
                    <div className="text-2xl font-bold text-red-700">{stats.incorrect}</div>
                  </div>
                  <div className={`p-4 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <FaLightbulb className={config.color} />
                      <span className="text-sm text-gray-600">Accuracy</span>
                    </div>
                    <div className={`text-2xl font-bold ${config.color}`}>
                      {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {filteredMistakes.map((item, index) => {
            const isCorrect = item.isCorrect;
            const selectedAnswer = item.selectedAnswer;
            const correctAnswer = item.correctAnswer;
            const questionText = item.question;
            const solutionText = solutions[item.question_id];
            const isExpanded = expandedCards.has(index);
            const config = subjectConfig[item.subject] || subjectConfig.Physics;

            return (
              <motion.div
                key={index}
                className={`bg-white rounded-lg shadow-md border-l-4 overflow-hidden ${
                  isCorrect ? 'border-green-500' : 'border-red-500'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Question Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCard(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`${config.color}`}>{config.icon}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                      <span className="text-sm text-gray-500">{item.subject}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                      {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                  <p className="mt-2 font-medium text-gray-800 line-clamp-2">
                    {questionText}
                  </p>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="border-t bg-gray-50"
                  >
                    <div className="p-4 space-y-4">
                      {/* Answers Comparison */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Your Answer</p>
                          <div className={`p-3 rounded border ${
                            isCorrect 
                              ? 'bg-green-50 border-green-200 text-green-800' 
                              : 'bg-red-50 border-red-200 text-red-800'
                          }`}>
                            {selectedAnswer}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Correct Answer</p>
                          <div className="p-3 rounded border bg-blue-50 border-blue-200 text-blue-800">
                            {correctAnswer}
                          </div>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FaLightbulb className="text-yellow-500" />
                          <p className="text-sm font-medium text-gray-600">Explanation</p>
                        </div>
                        <div className="p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm text-gray-700">
                            {solutionText || "Explanation not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {filteredMistakes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-2">🔍</div>
              <p className="text-gray-500">No questions found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewMistake;