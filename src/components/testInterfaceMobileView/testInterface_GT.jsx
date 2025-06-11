"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFlask, FaAtom, FaDna, FaEraser, FaFlag, FaChevronLeft, FaChevronRight,
  FaClock, FaBolt, FaFire
} from "react-icons/fa";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { MdFlag, MdVisibility } from "react-icons/md";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";
import { useRouter } from "next/navigation";
import { RiQuestionnaireFill } from "react-icons/ri";

const subjectIcons = {
  Physics: { icon: FaAtom, color: "text-blue-600", gradient: "from-blue-400 to-blue-600" },
  Chemistry: { icon: FaFlask, color: "text-green-600", gradient: "from-green-400 to-green-600" },
  Biology: { icon: FaDna, color: "text-red-600", gradient: "from-red-400 to-red-600" },
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
  const [showNavModal, setShowNavModal] = useState(false);

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
        setError("Failed to load questions");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Prevent leaving fullscreen (mobile fix: optional)
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (
        !document.fullscreenElement && !document.webkitFullscreenElement &&
        !document.msFullscreenElement && !document.mozFullscreenElement
      ) {
        router.push("/testselection");
      }
    };
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
  }, [router]);

  // Timer
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
        if (testDetails?.duration) setTimer(testDetails.duration * 60);
        if (testDetails?.topic_name)
          localStorage.setItem("selectedChapters", JSON.stringify(testDetails.topic_name));
      } catch (error) {}
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
    } catch { savedAnswers = []; }
    const currentTime = new Date();
    const timeTakenInSeconds = (currentTime - startTime) / 1000;
    const minutes = Math.floor(timeTakenInSeconds / 60);
    const seconds = Math.floor(timeTakenInSeconds % 60);
    const answerWithTime = { ...answerData, timeTaken: { minutes, seconds }, timestamp: currentTime.toISOString() };
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
      // End of subject (optional: next subject)
      return;
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
        if (ans.isCorrect) subjectWiseMarks[subject] += 4;
        else if (ans.selectedAnswer !== null) subjectWiseMarks[subject] -= 1;
      });
      const payload = {
        studentId, testid, testname, selectedChapters, answers: simplifiedAnswers, score,
        correctAnswers, incorrectAnswers, unattempted, totalquestions, overallmarks, subjectWiseMarks,
      };
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/newadmin/save-test`, payload);
      toast.success("Test submitted successfully! 🎉", { duration: 5000 });
    } catch (error) {
      toast.error("Failed to submit test. Please try again. ❌", { duration: 5000 });
    } finally { setIsSubmitting(false); }
  };

  const getStats = () => {
    const total = numQuestions;
    const answered = Object.keys(answers).filter(key => key.startsWith(`${currentSubject}-`)).length;
    const marked = Object.keys(markedForReview).filter(key => key.startsWith(`${currentSubject}-`) && markedForReview[key]).length;
    const visited = Object.keys(visitedQuestions).filter(key => key.startsWith(`${currentSubject}-`)).length;
    const notVisited = total - visited;
    return { total, answered, marked, visited, notVisited };
  };

  // === MOBILE RENDER STARTS ===
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your test...</p>
        </div>
      </div>
    );
  if (error)
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

  const currentQuestionData = questionsData[currentSubject]?.[currentQuestion];
  const subjectConfig = subjectIcons[currentSubject] || subjectIcons.Physics;
  const stats = getStats();
  const isLowTime = timer < 300;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex flex-col pb-24">
      {/* Mobile sticky header */}
      <div className="sticky top-0 z-30 bg-white py-3 px-2 shadow flex items-center justify-between">
        <div className="flex gap-1 items-center">
          <FaClock className={`text-xl ${isLowTime ? "text-red-600 animate-pulse" : "text-blue-600"}`} />
          <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded text-xs">{formattedTime.hours}:{formattedTime.minutes}:{formattedTime.seconds}</span>
        </div>
        <div className="flex gap-1">
          {selectedSubjects.map((subject) => {
            const SubjectIcon = subjectIcons[subject]?.icon || FaAtom;
            return (
              <button
                key={subject}
                onClick={() => { setCurrentSubject(subject); setCurrentQuestion(0); }}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg ${currentSubject === subject ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                <SubjectIcon />
                {subject}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question section */}
      <div className="flex-1 flex flex-col px-1 pt-2">
        <div className="bg-white rounded-xl shadow border mx-1 mt-2 flex flex-col overflow-hidden">
          {/* Question info */}
          <div className="px-4 py-2 flex justify-between items-center border-b bg-gray-50">
            <span className="text-xs text-blue-600 font-bold">
              Q {currentQuestion + 1} / {numQuestions}
            </span>
            <span className={`text-xs rounded px-2 py-0.5 font-semibold ${markedForReview[`${currentSubject}-${currentQuestion}`] ? "bg-amber-100 text-amber-800" : answers[`${currentSubject}-${currentQuestion}`] !== undefined ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
              {markedForReview[`${currentSubject}-${currentQuestion}`]
                ? "Marked"
                : answers[`${currentSubject}-${currentQuestion}`] !== undefined
                ? "Answered"
                : "Not Answered"}
            </span>
          </div>
          {/* The Question */}
          <div className="p-4">
            <div className="mb-3 flex items-center">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subjectConfig.gradient} flex items-center justify-center text-white mr-2`}>
                <RiQuestionnaireFill className="text-xl" />
              </div>
              <span className="text-md font-medium">{currentQuestionData?.question || "No Question Available"}</span>
            </div>
            {/* Options */}
            <div className="space-y-2 mt-4">
              {currentQuestionData?.options.map(
                (option, index) => {
                  const isSelected = answers[`${currentSubject}-${currentQuestion}`] === index;
                  const isHovered = hoveredOption === index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(index)}
                      onMouseEnter={() => setHoveredOption(index)}
                      onMouseLeave={() => setHoveredOption(null)}
                      className={`w-full text-left px-4 py-3 rounded-lg border flex items-center ${isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200"} ${isHovered && !isSelected ? "ring-2 ring-blue-100" : ""}`}
                    >
                      <span className={`w-6 h-6 mr-3 flex items-center justify-center rounded-full border ${isSelected ? "border-white bg-white/20" : "border-gray-300 bg-gray-50"}`}>
                        {isSelected && <IoMdCheckmark className="text-blue-600 bg-white rounded-full" />}
                      </span>
                      <span className="text-base">{option}</span>
                    </button>
                  );
                }
              )}
            </div>
            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleClearResponse}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs"
              >Clear Response</button>
              <button
                onClick={handleReviewLater}
                className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-xs flex items-center justify-center"
              ><FaFlag className="mr-1" />Mark</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed left-0 right-0 bottom-0 bg-white shadow-lg border-t z-40 flex items-center justify-between px-1 py-2">
        <button
          onClick={() => handleNavigation("prev")}
          disabled={currentQuestion === 0}
          className={`flex-1 mx-1 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm ${currentQuestion === 0 && "opacity-50"}`}
        ><FaChevronLeft className="inline mr-1" /> Prev</button>
        <button
          onClick={() => setShowNavModal(true)}
          className="flex-1 mx-1 py-2 bg-gray-100 rounded-lg font-bold text-sm flex items-center justify-center"
        ><MdVisibility className="mr-1" /> Questions</button>
        <button
          onClick={() => handleNavigation("next")}
          disabled={currentQuestion === numQuestions - 1}
          className={`flex-1 mx-1 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm ${currentQuestion === numQuestions - 1 && "opacity-50"}`}
        >Next <FaChevronRight className="inline ml-1" /></button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 mx-1 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold text-sm flex items-center justify-center"
        >
          {isSubmitting
            ? <span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></span>
            : <><FaFire className="mr-1" />Submit</>
          }
        </button>
      </div>

      {/* Modal: Question Navigation */}
      {showNavModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full rounded-t-2xl bg-white px-4 py-5 max-h-[70vh]">
            <div className="flex items-center mb-2">
              <span className="text-lg font-bold flex-1">Questions Overview</span>
              <button
                onClick={() => setShowNavModal(false)}
                className="text-2xl px-2">&times;</button>
            </div>
            <div className="flex flex-wrap gap-3 mb-3 text-xs">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div>Answered ({stats.answered})</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div>Not Answered ({stats.total - stats.answered - stats.notVisited})</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-400 rounded"></div>Not Visited ({stats.notVisited})</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded"></div>For Review ({stats.marked})</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: numQuestions }).map((_, index) => {
                const isCurrent = currentQuestion === index;
                const isAnswered = answers[`${currentSubject}-${index}`] !== undefined;
                const isMarked = markedForReview[`${currentSubject}-${index}`];
                const isVisited = visitedQuestions[`${currentSubject}-${index}`];
                let buttonClass = "w-8 h-8 flex items-center justify-center text-xs rounded-md ";
                if (isCurrent) buttonClass += "bg-blue-600 text-white border-2 border-blue-700";
                else if (isMarked) buttonClass += "bg-amber-500 text-white";
                else if (isAnswered) buttonClass += "bg-green-500 text-white";
                else if (isVisited) buttonClass += "bg-red-500 text-white";
                else buttonClass += "bg-gray-300 text-gray-700";
                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => {
                      setCurrentQuestion(index);
                      setShowNavModal(false);
                      if (!visitedQuestions[`${currentSubject}-${index}`]) {
                        setVisitedQuestions({ ...visitedQuestions, [`${currentSubject}-${index}`]: true });
                      }
                    }}
                  >{index + 1}</button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px);}
          50% { transform: translateY(-20px);}
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default TestInterface;
