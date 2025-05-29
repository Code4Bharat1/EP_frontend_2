"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TfiTimer } from "react-icons/tfi";
import { FaFlask, FaAtom, FaDna, FaCheck, FaFlag, FaChevronLeft, FaChevronRight, FaEraser, FaClock, FaBolt, FaFire } from "react-icons/fa";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { MdOutlineRemoveDone, MdDone, MdFlag, MdVisibility } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { RiQuestionnaireFill } from "react-icons/ri";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";
import { useRouter } from "next/navigation";

const subjectIcons = {
  Physics: { icon: FaAtom, color: "text-blue-600", bgColor: "bg-blue-500", bgLight: "bg-blue-50", borderColor: "border-blue-300", gradientFrom: "from-blue-400", gradientTo: "to-blue-600" },
  Chemistry: { icon: FaFlask, color: "text-green-600", bgColor: "bg-green-500", bgLight: "bg-green-50", borderColor: "border-green-300", gradientFrom: "from-green-400", gradientTo: "to-green-600" },
  Biology: { icon: FaDna, color: "text-red-600", bgColor: "bg-red-500", bgLight: "bg-red-50", borderColor: "border-red-300", gradientFrom: "from-red-400", gradientTo: "to-red-600" },
};

const TestInterface = () => {

  const router = useRouter();

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [questionsData, setQuestionsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubject, setCurrentSubject] = useState("Physics");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);

  const numQuestions = questionsData[currentSubject]?.length || 0;

  useEffect(() => {
    const fetchQuestions = async () => {
      const testid = localStorage.getItem("testid");
      if (!testid) {
        setError("No test ID found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/newadmin/get-questions`,
          { testid }
        );

        const data = response.data.data;
        const grouped = {};
        data.forEach((q) => {
          if (!grouped[q.subject]) grouped[q.subject] = [];
          grouped[q.subject].push({
            id: q.id || q.question_id,
            question: q.question_text,
            options: q.options,
            correctAnswer: q.correctanswer,
          });
        });

        setQuestionsData(grouped);
        const uniqueSubjects = [...new Set(data.map((q) => q.subject))];
        setSelectedSubjects(uniqueSubjects);
        setCurrentSubject(uniqueSubjects[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching test questions:", err);
        setError("Failed to load questions");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  //useEffect to control the escape screen
    useEffect (() => {
      const handleFullScreenChange = () =>{
        if(!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement && !document.mozFullscreenElement) {
          //push the page 
          router.push("/testselection")
        }
      }
  
      document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);
  
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
    },[])

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(countdown);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    const fetchChapterNames = async () => {
      const testid = localStorage.getItem("testid");
      if (!testid) return;
  
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/newadmin/test-data-by-id`,
          { testid }
        );
  
        const testDetails = response.data?.test;
        if (testDetails?.duration) {
          setTimer(testDetails.duration * 60);
        }
  
        if (testDetails?.topic_name) {
          localStorage.setItem("selectedChapters", JSON.stringify(testDetails.topic_name));
        }
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };
  
    fetchChapterNames();
  }, []);

  const formattedTime = {
    hours: String(Math.floor(timer / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((timer % 3600) / 60)).padStart(2, '0'),
    seconds: String(timer % 60).padStart(2, '0'),
  };

  const handleOptionClick = (index) => {
    const questionData = questionsData[currentSubject][currentQuestion];
    const selectedAnswer = questionData.options[index];
    const correctAnswer = questionData.correctAnswer;
    const isCorrect = selectedAnswer === correctAnswer;
  
    const answerData = {
      subject: currentSubject,
      question: questionData.question,
      question_id: questionData.id,
      selectedAnswer,
      isCorrect,
      correctAnswer,
    };
  
    let savedAnswers = [];
    try {
      const stored = localStorage.getItem("testAnswers");
      savedAnswers = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(savedAnswers)) savedAnswers = [];
    } catch {
      savedAnswers = [];
    }
  
    const currentTime = new Date();
    const timeTakenInSeconds = (currentTime - startTime) / 1000;
    const minutes = Math.floor(timeTakenInSeconds / 60);
    const seconds = Math.floor(timeTakenInSeconds % 60);
  
    const answerWithTime = {
      ...answerData,
      timeTaken: { minutes, seconds },
      timestamp: currentTime.toISOString(),
    };
  
    savedAnswers.push(answerWithTime);
    localStorage.setItem("testAnswers", JSON.stringify(savedAnswers));
  
    setAnswers({ ...answers, [`${currentSubject}-${currentQuestion}`]: index });
    setVisitedQuestions({
      ...visitedQuestions,
      [`${currentSubject}-${currentQuestion}`]: true,
    });
  
    const previousTime = JSON.parse(localStorage.getItem("questionTime")) || {};
    previousTime[`${currentSubject}-${currentQuestion}`] = timeTakenInSeconds;
    localStorage.setItem("questionTime", JSON.stringify(previousTime));
  
    const savedTimeForCurrentQuestion = previousTime[`${currentSubject}-${currentQuestion}`];
    const newStartTime = savedTimeForCurrentQuestion
      ? new Date(new Date() - savedTimeForCurrentQuestion * 1000)
      : currentTime;
  
    setStartTime(newStartTime);
  };

  const handleNavigation = (direction) => {
    const totalQuestions = numQuestions;
    if (direction === "next" && currentQuestion >= totalQuestions - 1) {
      const currentSubjectIndex = selectedSubjects.indexOf(currentSubject);
      const nextSubjectIndex = (currentSubjectIndex + 1) % selectedSubjects.length;
      setCurrentSubject(selectedSubjects[nextSubjectIndex]);
      setCurrentQuestion(0);
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (direction === "next" && currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleReviewLater = () => {
    setMarkedForReview({
      ...markedForReview,
      [`${currentSubject}-${currentQuestion}`]: !markedForReview[`${currentSubject}-${currentQuestion}`],
    });
  };

  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[`${currentSubject}-${currentQuestion}`];
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const testAnswers = JSON.parse(localStorage.getItem("testAnswers")) || [];
      const selectedChapters = JSON.parse(localStorage.getItem("selectedChapters")) || [];
      const testid = localStorage.getItem("testid");
      const testname = localStorage.getItem("testName");
  
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");
  
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(atob(base64));
      const studentId = decodedToken?.id || decodedToken?.studentId;
      if (!studentId) throw new Error("Student ID not found in token");
  
      const totalquestions = parseInt(localStorage.getItem("totalQuestions")) || testAnswers.length;
  
      const correctAnswers = testAnswers.filter(a => a.isCorrect).length;
      const incorrectAnswers = testAnswers.filter(a => !a.isCorrect && a.selectedAnswer !== null).length;
      const attempted = correctAnswers + incorrectAnswers;
      const unattempted = totalquestions - attempted;
  
      const score = (correctAnswers * 4) - incorrectAnswers;
      const overallmarks = totalquestions * 4;
  
      const simplifiedAnswers = testAnswers.map((ans) => ({
        subject: ans.subject,
        question: ans.question,
        correctAnswer: ans.correctAnswer,
      }));
  
      const subjectWiseMarks = {};
      testAnswers.forEach((ans) => {
        const subject = ans.subject;
        if (!subjectWiseMarks[subject]) subjectWiseMarks[subject] = 0;
        if (ans.isCorrect) {
          subjectWiseMarks[subject] += 4;
        } else if (ans.selectedAnswer !== null) {
          subjectWiseMarks[subject] -= 1;
        }
      });
  
      const payload = {
        studentId,
        testid,
        testname,
        selectedChapters,
        answers: simplifiedAnswers,
        score,
        correctAnswers,
        incorrectAnswers,
        unattempted,
        totalquestions,
        overallmarks,
        subjectWiseMarks,
      };
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/newadmin/save-test`,
        payload
      );
  
      console.log("Test result submitted:", response.data);
      toast.success("Test submitted successfully! 🎉", { duration: 5000 });
  
    } catch (error) {
      console.error("Error submitting test result:", error);
      toast.error("Failed to submit test. Please try again. ❌", { duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuestionStats = () => {
    const total = numQuestions;
    const answered = Object.keys(answers)
      .filter(key => key.startsWith(`${currentSubject}-`))
      .length;
    const marked = Object.keys(markedForReview)
      .filter(key => key.startsWith(`${currentSubject}-`) && markedForReview[key])
      .length;
    const visited = Object.keys(visitedQuestions)
      .filter(key => key.startsWith(`${currentSubject}-`))
      .length;
    const notVisited = total - visited;
    return { total, answered, marked, visited, notVisited };
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
            <IoMdClose className="text-3xl text-red-600" />
          </div>
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = questionsData[currentSubject]?.[currentQuestion];
  const subjectConfig = subjectIcons[currentSubject] || subjectIcons.Physics;
  const stats = getQuestionStats();
  const isLowTime = timer < 300; // Less than 5 minutes

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Animated Header */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/90 shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Animated Timer Section */}
            <div className="relative">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isLowTime ? 'bg-red-100 animate-pulse' : 'bg-blue-100'} transition-all`}>
                  <FaClock className={`text-xl ${isLowTime ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div className="flex gap-1">
                  <div className={`${isLowTime ? 'bg-red-600 animate-pulse' : 'bg-gray-900'} text-white px-3 py-1 rounded-lg font-mono text-base min-w-[3rem] text-center transition-all transform hover:scale-105`}>
                    {formattedTime.hours}
                  </div>
                  <span className="text-gray-600 self-center font-bold">:</span>
                  <div className={`${isLowTime ? 'bg-red-600 animate-pulse' : 'bg-gray-900'} text-white px-3 py-1 rounded-lg font-mono text-base min-w-[3rem] text-center transition-all transform hover:scale-105`}>
                    {formattedTime.minutes}
                  </div>
                  <span className="text-gray-600 self-center font-bold">:</span>
                  <div className={`${isLowTime ? 'bg-red-600 animate-pulse' : 'bg-gray-900'} text-white px-3 py-1 rounded-lg font-mono text-base min-w-[3rem] text-center transition-all transform hover:scale-105`}>
                    {formattedTime.seconds}
                  </div>
                </div>
              </div>
              {isLowTime && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                  <div className="absolute top-0 w-4 h-4 bg-red-600 rounded-full"></div>
                </div>
              )}
            </div>

            {/* Stylish Subject Tabs */}
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
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : config.bgColor}`} />
                  </button>
                );
              })}
            </div>

            {/* Gradient Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="relative overflow-hidden px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FaBolt className="text-sm" />
              )}
              Submit Test
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content with Enhanced Layout */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Question Section */}
        <div className="lg:col-span-2 select-none">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
            {/* Animated Background Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full filter blur-3xl -translate-y-20 translate-x-20"></div>
            
            {/* Question Header with Animation */}
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subjectConfig.gradientFrom} ${subjectConfig.gradientTo} flex items-center justify-center text-white shadow-lg`}>
                      <RiQuestionnaireFill className="text-xl" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`font-semibold ${subjectConfig.color}`}>{currentSubject}</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span className="text-gray-500">Question {currentQuestion + 1} of {numQuestions}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Total Score: {stats.total * 4} marks</div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-medium text-gray-900 leading-relaxed">
                    {currentQuestionData?.question}
                  </h2>
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
                    <MdFlag className={markedForReview[`${currentSubject}-${currentQuestion}`] ? 'animate-pulse' : ''} />
                  </button>
                </div>
              </div>

              {/* Enhanced Options with Hover Effects */}
              <div className="space-y-4 mb-8">
                {currentQuestionData?.options.map((option, index) => {
                  const isSelected = answers[`${currentSubject}-${currentQuestion}`] === index;
                  const isHovered = hoveredOption === index;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      onMouseEnter={() => setHoveredOption(index)}
                      onMouseLeave={() => setHoveredOption(null)}
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
                          {isSelected && (
                            <IoMdCheckmark className="text-white text-sm" />
                          )}
                          {isHovered && !isSelected && (
                            <div className="absolute inset-0 bg-blue-100 rounded-full scale-75 opacity-50"></div>
                          )}
                        </div>
                        <span className="text-base leading-relaxed">
                          <span className="font-medium text-gray-600 mr-2">({String.fromCharCode(65 + index)})</span>
                          {option}
                        </span>
                      </div>
                      {/* Animated selection indicator */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent transform -skew-x-12 translate-x-full animate-[shimmer_0.7s_ease-out]"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Action Buttons */}
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
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stylish Progress Card */}
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

          {/* Enhanced Question Navigation Grid */}
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
                    {isCurrentQuestion && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-pink-500 rounded"></div>
                <span className="text-gray-600">Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-pink-400 rounded"></div>
                <span className="text-gray-600">Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded"></div>
                <span className="text-gray-600">Current</span>
              </div>
            </div>
          </div>

          {/* Floating Action Button for Mobile */}
          <div className="lg:hidden fixed bottom-8 right-8 z-30">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <FaFire className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          >
            <div className="w-2 h-2 bg-blue-400/20 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(100%) skewX(-12deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TestInterface;