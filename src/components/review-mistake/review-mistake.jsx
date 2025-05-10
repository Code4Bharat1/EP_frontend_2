"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FaArrowLeft,
  FaSpinner,
  FaExclamationCircle,
  FaSearch,
  FaClipboardList,
  FaClock,
  FaTrophy,
  FaBrain
} from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const testId = searchParams.get("test-id");
  
  const [mistakes, setMistakes] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMistakes = async () => {
      try {
        const authToken = typeof window !== "undefined" && localStorage.getItem("authToken");
        if (!authToken) throw new Error("User not authenticated");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/fulltest/review`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
            params: { testId },
          }
        );

        const { correctAnswers = [], wrongAnswers = [], unanswered = [] } = response.data.reviewData || {};
        
        const formattedMistakes = [
          ...correctAnswers.map((item) => ({ 
            ...item, 
            isCorrect: true,
            question: item.questionText,
            correctAnswer: item.correctAnswer,
            selectedAnswer: item.yourAnswer,
            subject: item.subject || 'General',
            question_id: item.questionId
          })),
          ...wrongAnswers.map((item) => ({ 
            ...item, 
            isCorrect: false,
            question: item.questionText,
            correctAnswer: item.correctAnswer,
            selectedAnswer: item.yourAnswer,
            subject: item.subject || 'General',
            question_id: item.questionId
          })),
          ...unanswered.map((item) => ({ 
            ...item, 
            isCorrect: false,
            question: item.questionText,
            correctAnswer: item.correctAnswer,
            selectedAnswer: "Not Answered",
            subject: item.subject || 'General',
            question_id: item.questionId
          })),
        ];
        
        setMistakes(formattedMistakes);
        
        // Extract unique subjects
        const subjects = [...new Set(formattedMistakes.map(item => item.subject))];
        setSelectedSubjects(subjects);
        
        // Set first subject as active by default
        if (subjects.length > 0) {
          setActiveSubject(subjects[0]);
        }
        
      } catch (err) {
        console.error("❌ Error fetching review mistakes:", err);
        setError("Failed to load review mistakes. Please check the test ID or try again.");
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

  // Filter and search logic
  const filteredMistakes = mistakes.filter((item) => {
    const subjectMatch = activeSubject ? item.subject === activeSubject : true;
    const filterMatch = 
      filterType === 'all' ? true :
      filterType === 'correct' ? item.isCorrect :
      filterType === 'incorrect' ? !item.isCorrect :
      true;
    const searchMatch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.selectedAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return subjectMatch && filterMatch && searchMatch;
  });

  // Calculate statistics
  const getStats = () => {
    const totalAll = mistakes.length;
    const correctAll = mistakes.filter(item => item.isCorrect).length;
    const incorrectAll = totalAll - correctAll;
    
    const totalFiltered = filteredMistakes.length;
    const correctFiltered = filteredMistakes.filter(item => item.isCorrect).length;
    const incorrectFiltered = totalFiltered - correctFiltered;
    
    const scorePercentage = totalAll > 0 ? Math.round((correctAll / totalAll) * 100) : 0;
    
    return { 
      totalAll, 
      correctAll, 
      incorrectAll, 
      totalFiltered, 
      correctFiltered, 
      incorrectFiltered, 
      scorePercentage 
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
        <p className="text-lg text-gray-600">Loading test review...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex flex-col items-center justify-center">
        <FaExclamationCircle className="text-4xl text-red-600 mb-4" />
        <p className="text-lg text-red-700 font-medium">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-white text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaClipboardList className="text-blue-600" />
                  Review Your Test
                </h1>
                <p className="text-sm text-gray-600">Test ID: {testId} • Analyze your performance and learn from mistakes</p>
              </div>
            </div>
            
            {/* Score Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-6 py-3 shadow-lg">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.scorePercentage}%</div>
                  <div className="text-xs opacity-80">Overall Score</div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-300" />
                    <span>{stats.correctAll}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaTimesCircle className="text-red-300" />
                    <span>{stats.incorrectAll}</span>
                  </div>
                  <div className="opacity-60">|</div>
                  <div>{stats.totalAll} Questions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
        <div className="mt-12 mx-4 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{stats.totalAll}</div>
                <div className="text-sm text-gray-500">Total Questions</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.correctAll}</div>
                <div className="text-sm text-gray-500">Correct</div>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.incorrectAll}</div>
                <div className="text-sm text-gray-500">Incorrect</div>
              </div>
            </div>
            
            <div className="flex gap-3">
              
              <button 
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Tests
              </button>
            </div>
          </div>
        </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions or answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-auto"
            >
              <option value="all">All Answers ({stats.totalFiltered})</option>
              <option value="correct">Correct Only ({stats.correctFiltered})</option>
              <option value="incorrect">Incorrect Only ({stats.incorrectFiltered})</option>
            </select>
          </div>
        </div>

        

        {/* Questions List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredMistakes.map((item, index) => {
              const isCorrect = item.isCorrect;
              const isExpanded = expandedCards.has(index);
              const subjectConf = subjectConfig[item.subject] || subjectConfig.Physics;

              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    layout: { duration: 0.2 },
                    duration: 0.3,
                    delay: index * 0.02
                  }}
                  className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow ${
                    isCorrect ? 'border-green-200 hover:border-green-300' : 'border-red-200 hover:border-red-300'
                  }`}
                >
                  {/* Question Header */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleCard(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg ${subjectConf.bgColor} ${subjectConf.borderColor} border flex items-center justify-center flex-shrink-0`}>
                          <span className={subjectConf.color}>{subjectConf.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-gray-600">{item.subject}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {isCorrect ? 'Correct' : item.selectedAnswer === "Not Answered" ? 'Unanswered' : 'Incorrect'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 mt-1 line-clamp-2">
                            {item.question}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isCorrect ? (
                          <FaCheckCircle className="text-green-500 text-lg" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-lg" />
                        )}
                        {isExpanded ? 
                          <FaChevronUp className="text-gray-400" /> : 
                          <FaChevronDown className="text-gray-400" />
                        }
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t bg-gradient-to-b from-gray-50 to-white">
                          <div className="p-6 space-y-6">
                            {/* Full Question */}
                            <div>
                              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                <FaBook className="text-gray-400" />
                                Question
                              </h3>
                              <div className="bg-gray-100 rounded-lg p-4">
                                <p className="text-gray-800 leading-relaxed">{item.question}</p>
                              </div>
                            </div>

                            {/* Answers Comparison */}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                                  Your Answer
                                  {item.selectedAnswer === "Not Answered" && <span className="text-xs text-orange-600">(Skipped)</span>}
                                </h4>
                                <div className={`p-4 rounded-lg border ${
                                  isCorrect 
                                    ? 'bg-green-50 border-green-300 text-green-900' 
                                    : 'bg-red-50 border-red-300 text-red-900'
                                }`}>
                                  {item.selectedAnswer}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-2">Correct Answer</h4>
                                <div className="p-4 rounded-lg border bg-blue-50 border-blue-300 text-blue-900">
                                  {item.correctAnswer}
                                </div>
                              </div>
                            </div>

                            {/* Explanation */}
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <FaLightbulb className="text-yellow-500" />
                                <h4 className="font-medium text-gray-700">Explanation</h4>
                              </div>
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-gray-700 leading-relaxed">
                                  {item.explanation || (
                                    <span className="italic text-gray-500">
                                      Explanation not available for this question. Review the correct answer above to understand the solution.
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-4 border-t">
                              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center gap-2">
                                <FaBrain />
                                Mark for Review
                              </button>
                              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm flex items-center gap-2">
                                <FaBook />
                                Learn More
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredMistakes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FaBook className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery 
                  ? "No questions found matching your search." 
                  : filterType !== 'all' 
                    ? `No ${filterType} answers in this subject.`
                    : "No questions found for the selected filter."
                }
              </p>
            </motion.div>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default ReviewMistake;