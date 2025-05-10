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
  FaBook,
  FaFilter,
  FaArrowLeft
} from "react-icons/fa";
import { useRouter } from "next/navigation";

// Subject configuration with icons and colors
const subjectConfig = {
  Physics: { 
    icon: <FaAtom />, 
    color: "text-blue-600", 
    bgColor: "bg-blue-50", 
    borderColor: "border-blue-300",
    hoverBg: "hover:bg-blue-100",
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-600"
  },
  Chemistry: { 
    icon: <FaFlask />, 
    color: "text-green-600", 
    bgColor: "bg-green-50", 
    borderColor: "border-green-300",
    hoverBg: "hover:bg-green-100",
    gradientFrom: "from-green-400",
    gradientTo: "to-green-600"
  },
  Biology: { 
    icon: <FaDna />, 
    color: "text-red-600", 
    bgColor: "bg-red-50", 
    borderColor: "border-red-300",
    hoverBg: "hover:bg-red-100",
    gradientFrom: "from-red-400",
    gradientTo: "to-red-600"
  },
  Botany: { 
    icon: <FaEye />, 
    color: "text-purple-600", 
    bgColor: "bg-purple-50", 
    borderColor: "border-purple-300",
    hoverBg: "hover:bg-purple-100",
    gradientFrom: "from-purple-400",
    gradientTo: "to-purple-600"
  },
};

const ReviewMistake = () => {
  const router = useRouter();
  const [mistakes, setMistakes] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [solutions, setSolutions] = useState({});
  const [activeSubject, setActiveSubject] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [filterType, setFilterType] = useState('all'); // all, correct, incorrect
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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
  const getStats = () => {
    const total = filteredMistakes.length;
    const correct = filteredMistakes.filter(item => item.isCorrect).length;
    const incorrect = total - correct;
    return { total, correct, incorrect };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Review Your Test</h1>
                <p className="text-sm text-gray-600">Analyze your performance and learn from mistakes</p>
              </div>
            </div>
            
            {/* Filter and Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-gray-600">{stats.correct}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaTimesCircle className="text-red-500" />
                  <span className="text-gray-600">{stats.incorrect}</span>
                </div>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Answers</option>
                <option value="correct">Correct Only</option>
                <option value="incorrect">Incorrect Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Subject Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {selectedSubjects.map((subject, index) => {
            const config = subjectConfig[subject] || subjectConfig.Physics;
            const isActive = activeSubject === subject;
            const subjectMistakes = mistakes.filter(item => item.subject === subject);
            const subjectCorrect = subjectMistakes.filter(item => item.isCorrect).length;
            
            return (
              <motion.button
                key={index}
                onClick={() => setActiveSubject(subject)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  isActive 
                    ? `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white border-transparent shadow-lg` 
                    : `bg-white border-gray-200 text-gray-700 hover:bg-gray-50`
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={isActive ? "text-white" : config.color}>
                  {config.icon}
                </span>
                <span className="font-medium">{subject}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {subjectCorrect}/{subjectMistakes.length}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredMistakes.map((item, index) => {
            const isCorrect = item.isCorrect;
            const selectedAnswer = item.selectedAnswer;
            const correctAnswer = item.correctAnswer;
            const questionText = item.question;
            const solutionText = solutions[item.question_id];
            const isExpanded = expandedCards.has(index);
            const subjectConf = subjectConfig[item.subject] || subjectConfig.Physics;

            return (
              <motion.div
                key={index}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                  isCorrect ? 'border-green-200' : 'border-red-200'
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
                      <div className={`w-10 h-10 rounded-lg ${subjectConf.bgColor} ${subjectConf.borderColor} border flex items-center justify-center`}>
                        <span className={subjectConf.color}>{subjectConf.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">{item.subject}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 mt-1 line-clamp-2">
                          {questionText}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimesCircle className="text-red-500" />
                      )}
                      {isExpanded ? 
                        <FaChevronUp className="text-gray-400" /> : 
                        <FaChevronDown className="text-gray-400" />
                      }
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="border-t bg-gray-50"
                  >
                    <div className="p-6 space-y-6">
                      {/* Full Question */}
                      <div>
                        <h3 className="font-medium text-gray-700 mb-2">Question</h3>
                        <p className="text-gray-800 leading-relaxed">{questionText}</p>
                      </div>

                      {/* Answers Comparison */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Your Answer</h4>
                          <div className={`p-4 rounded-lg border ${
                            isCorrect 
                              ? 'bg-green-50 border-green-300 text-green-900' 
                              : 'bg-red-50 border-red-300 text-red-900'
                          }`}>
                            {selectedAnswer}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Correct Answer</h4>
                          <div className="p-4 rounded-lg border bg-blue-50 border-blue-300 text-blue-900">
                            {correctAnswer}
                          </div>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FaLightbulb className="text-yellow-500" />
                          <h4 className="font-medium text-gray-700">Explanation</h4>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-gray-700 leading-relaxed">
                            {solutionText || (
                              <span className="italic text-gray-500">
                                Explanation not available for this question.
                              </span>
                            )}
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
              <FaBook className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No questions found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewMistake;