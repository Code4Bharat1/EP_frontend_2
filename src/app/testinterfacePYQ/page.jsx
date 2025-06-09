"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaAtom, FaFlask, FaDna, FaClock, FaChevronLeft, FaChevronRight, FaEraser, FaBolt } from "react-icons/fa";
import { MdFlag, MdDone, MdVisibility } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoMdCheckmark } from "react-icons/io";
import axios from "axios";

const subjectIcons = {
  Physics: { icon: FaAtom, color: "text-blue-600", gradientFrom: "from-blue-400", gradientTo: "to-blue-600" },
  Chemistry: { icon: FaFlask, color: "text-green-600", gradientFrom: "from-green-400", gradientTo: "to-green-600" },
  Biology: { icon: FaDna, color: "text-red-600", gradientFrom: "from-red-400", gradientTo: "to-red-600" },
};

const formatTime = (seconds) => {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return { hours: hrs, minutes: mins, seconds: secs };
};

const TestInterface = () => {
  const router = useRouter();

  const [questionsData, setQuestionsData] = useState({});
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const selectedYear = localStorage.getItem("selectedYear");
        if (!selectedYear) {
          setError("No year selected. Please go back and choose a year.");
          setLoading(false);
          return;
        }
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/pyq-questions`,
          { year: selectedYear }
        );
        setQuestionsData(response.data);
        setSelectedSubjects(Object.keys(response.data));
        setCurrentSubject(Object.keys(response.data)[0]);
      } catch (err) {
        setError("Failed to fetch questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Clear marks at start
    localStorage.removeItem("marks");
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [submitted]);

  // Helper to store marks live (prevents double counting)
  const updateMarks = (subject, qIdx, selectedKey, correctKey) => {
  let marks = JSON.parse(localStorage.getItem("marks") || "{}");
  let answerIndexKey = `${subject}-${qIdx}`;
  let prevSelected = answers[answerIndexKey];

  // Make sure marks[subject] is always a number
  if (!(subject in marks)) marks[subject] = 0;

  // Undo the effect of the previous answer if it existed
  if (prevSelected !== undefined) {
    if (prevSelected === correctKey) {
      // Previously correct, so remove +4
      marks[subject] -= 4;
    } else {
      // Previously wrong, so remove -1 (i.e., add +1)
      marks[subject] += 1;
    }
  }

  // Apply new answer's effect
  if (selectedKey === correctKey) {
    marks[subject] += 4;
  } else {
    marks[subject] -= 1;
  }

  localStorage.setItem("marks", JSON.stringify(marks));
};


  const handleOptionClick = (subject, qIdx, selectedKey) => {
    if (submitted) return;
    const currentQ = questionsData[subject][qIdx];
    const correctKey = currentQ.correctAnswer;
    setAnswers((prev) => ({
      ...prev,
      [`${subject}-${qIdx}`]: selectedKey,
    }));
    setVisitedQuestions((prev) => ({
      ...prev,
      [`${subject}-${qIdx}`]: true,
    }));
    updateMarks(subject, qIdx, selectedKey, correctKey);
  };

  const handleNavigation = (direction) => {
    const numQuestions = questionsData[currentSubject]?.length || 0;
    if (direction === "next" && currentQuestion < numQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === "next" && currentQuestion === numQuestions - 1) {
      // next subject
      const currIdx = selectedSubjects.indexOf(currentSubject);
      if (currIdx < selectedSubjects.length - 1) {
        setCurrentSubject(selectedSubjects[currIdx + 1]);
        setCurrentQuestion(0);
      }
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReviewLater = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [`${currentSubject}-${currentQuestion}`]: !prev[`${currentSubject}-${currentQuestion}`],
    }));
  };

  const handleClearResponse = () => {
    const key = `${currentSubject}-${currentQuestion}`;
    const subject = currentSubject;
    const qIdx = currentQuestion;
    // Remove answer and update marks
    if (answers[key] !== undefined) {
      const currentQ = questionsData[subject][qIdx];
      let marks = JSON.parse(localStorage.getItem("marks") || "{}");
      if (answers[key] === currentQ.correctAnswer) marks[subject] -= 4;
      else marks[subject] += 1;
      localStorage.setItem("marks", JSON.stringify(marks));
    }
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    router.push("/resultPYQ");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-red-600">!</span>
          </div>
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const numQuestions = questionsData[currentSubject]?.length || 0;
  const currentQuestionData = questionsData[currentSubject]?.[currentQuestion];
  const subjectConfig = subjectIcons[currentSubject] || subjectIcons.Physics;
  const isLowTime = timeLeft < 300; // Less than 5 min
  const formattedTime = formatTime(timeLeft);

  // Stats
  const getQuestionStats = () => {
    const total = numQuestions;
    const answered = Object.keys(answers)
      .filter(key => key.startsWith(`${currentSubject}-`)).length;
    const marked = Object.keys(markedForReview)
      .filter(key => key.startsWith(`${currentSubject}-`) && markedForReview[key]).length;
    const visited = Object.keys(visitedQuestions)
      .filter(key => key.startsWith(`${currentSubject}-`)).length;
    const notVisited = total - visited;
    return { total, answered, marked, visited, notVisited };
  };
  const stats = getQuestionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/90 shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Timer */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isLowTime ? 'bg-red-100 animate-pulse' : 'bg-blue-100'}`}>
                  <FaClock className={`text-xl ${isLowTime ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div className="flex gap-1">
                  <div className={`${isLowTime ? 'bg-red-600 animate-pulse' : 'bg-gray-900'} text-white px-3 py-1 rounded-lg font-mono text-base min-w-[3rem] text-center`}>
                    {formattedTime.hours}
                  </div>
                  <span className="text-gray-600 self-center font-bold">:</span>
                  <div className={`${isLowTime ? 'bg-red-600 animate-pulse' : 'bg-gray-900'} text-white px-3 py-1 rounded-lg font-mono text-base min-w-[3rem] text-center`}>
                    {formattedTime.minutes}
                  </div>
                  <span className="text-gray-600 self-center font-bold">:</span>
                  <div className={`${isLowTime ? 'bg-red-600 animate-pulse' : 'bg-gray-900'} text-white px-3 py-1 rounded-lg font-mono text-base min-w-[3rem] text-center`}>
                    {formattedTime.seconds}
                  </div>
                </div>
              </div>
            </div>
            {/* Subject Tabs */}
            <div className="flex gap-3">
              {selectedSubjects.map((subject) => {
                const SubjectIcon = subjectIcons[subject]?.icon || FaAtom;
                const isActive = currentSubject === subject;
                const config = subjectIcons[subject] || subjectIcons.Physics;
                return (
                  <button
                    key={subject}
                    onClick={() => {
                      setCurrentSubject(subject);
                      setCurrentQuestion(0);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all transform hover:scale-105 ${
                      isActive 
                        ? `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white shadow-lg` 
                        : 'bg-white/80 text-gray-700 hover:bg-white/90 shadow border border-gray-200'
                    }`}
                  >
                    <SubjectIcon className={`text-lg ${isActive ? 'text-white' : config.color}`} />
                    <span className="font-medium">{subject}</span>
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : config.color}`} />
                  </button>
                );
              })}
            </div>
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className="relative overflow-hidden px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              <FaBolt className="text-sm" />
              Submit Test
            </button>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question section */}
        <div className="lg:col-span-2 select-none">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subjectConfig.gradientFrom} ${subjectConfig.gradientTo} flex items-center justify-center text-white shadow-lg`}>
                      <span className="text-xl">?</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`font-semibold ${subjectConfig.color}`}>{currentSubject}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="text-gray-500">Question {currentQuestion + 1} of {numQuestions}</span>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-medium text-gray-900 leading-relaxed">
                    {currentQuestionData?.question}
                  </h2>
                  {currentQuestionData?.diagramUrl && (
                    <img src={currentQuestionData.diagramUrl} alt="Diagram" className="my-2 max-w-xs" />
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReviewLater}
                    className={`p-3 rounded-xl transition-all transform hover:scale-110 ${
                      markedForReview[`${currentSubject}-${currentQuestion}`]
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Mark for review"
                  >
                    <MdFlag />
                  </button>
                </div>
              </div>
              {/* Options */}
              <div className="space-y-4 mb-8">
                {currentQuestionData && currentQuestionData.options && typeof currentQuestionData.options === "object" ? (
                  Object.entries(currentQuestionData.options).map(([key, value]) => {
                    const isSelected = answers[`${currentSubject}-${currentQuestion}`] === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleOptionClick(currentSubject, currentQuestion, key)}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all transform hover:scale-[1.01] relative overflow-hidden ${
                          isSelected 
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900' 
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <IoMdCheckmark className="text-white text-sm" />}
                          </div>
                          <span className="text-base leading-relaxed">
                            <span className="font-medium text-gray-600 mr-2">{key}.</span>
                            {value}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-red-500 text-sm">Invalid options</p>
                )}
              </div>
            </div>
            {/* Action buttons */}
            {!submitted && (
              <div className="relative z-10 flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  onClick={handleClearResponse}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all transform hover:scale-105"
                >
                  <FaEraser className="text-sm" />
                  Clear Response
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleNavigation("prev")}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
                  >
                    <FaChevronLeft className="text-sm" />
                    Previous
                  </button>
                  <button
                    onClick={() => handleNavigation("next")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Next
                    <FaChevronRight className="text-sm" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineSparkles className="text-xl" />
                <h3 className="font-bold text-lg">Test Progress</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MdDone className="text-green-300" />
                    <span className="text-sm">Answered</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.answered}/{stats.total}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MdFlag className="text-red-300" />
                    <span className="text-sm">Marked</span>
                  </div>
                  <div className="text-2xl font-bold">{stats.marked}</div>
                </div>
              </div>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div 
                  className="h-full bg-yellow-300 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.answered / stats.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-center mt-2">
                {Math.round((stats.answered / stats.total) * 100)}% complete
              </p>
            </div>
          </div>
          {/* Question Map */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                <MdVisibility />
              </div>
              <h3 className="font-bold text-gray-900">Question Map</h3>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {questionsData[currentSubject]?.map((_, index) => {
                const isCurrentQuestion = currentQuestion === index;
                const isAnswered = answers[`${currentSubject}-${index}`] !== undefined;
                const isMarked = markedForReview[`${currentSubject}-${index}`];
                const isVisited = visitedQuestions[`${currentSubject}-${index}`];
                let buttonClass = 'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all transform hover:scale-110 relative ';
                if (isCurrentQuestion) {
                  buttonClass += 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg scale-110';
                } else if (isMarked) {
                  buttonClass += 'bg-gradient-to-br from-red-500 to-pink-500 text-white';
                } else if (isAnswered) {
                  buttonClass += 'bg-gradient-to-br from-green-500 to-emerald-500 text-white';
                } else if (isVisited) {
                  buttonClass += 'bg-gradient-to-br from-orange-400 to-pink-400 text-white';
                } else {
                  buttonClass += 'bg-gray-100 text-gray-600 hover:bg-gray-200';
                }
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={buttonClass}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* CSS for shimmer/floats */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TestInterface;
