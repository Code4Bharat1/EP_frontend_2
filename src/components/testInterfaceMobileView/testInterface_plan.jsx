"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaFlask, 
  FaAtom, 
  FaDna, 
  FaRegClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaFlag
} from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";
import { useRouter } from "next/navigation";

const subjects = [
  { name: "Physics", icon: <FaAtom className="text-lg text-blue-500" /> },
  { name: "Chemistry", icon: <FaFlask className="text-lg text-green-500" /> },
  { name: "Biology", icon: <FaDna className="text-lg text-red-500" /> },
];

const TestInterface = () => {
  const router = useRouter();

  // State
  const [questionsData, setQuestionsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubject, setCurrentSubject] = useState("Physics");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timer, setTimer] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [allocatedQuestions, setAllocatedQuestions] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testEndTime, setTestEndTime] = useState(null);

  // For mobile overlays
  const [showNavModal, setShowNavModal] = useState(false);

  // Handle full screen escape
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullscreenElement && !document.msFullscreenElement) {
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

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/fetch-questions`
        );
        const data = response.data;
        const subjectWiseQuestions = { Physics: [], Chemistry: [], Biology: [] };

        data.questions.forEach((item) => {
          const subject = item.question.subject;
          subjectWiseQuestions[subject]?.push({
            id: item.question.id,
            question: item.question.question_text,
            options: item.options.map((opt) => opt.option_text),
            correctOption: item.options.find((opt) => opt.is_correct)?.option_text,
          });
        });
        setQuestionsData(subjectWiseQuestions);
        setLoading(false);
      } catch (err) {
        setError("Failed to load questions");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    const startTestData = JSON.parse(localStorage.getItem("startTest"));
    if (startTestData) {
      setCurrentSubject(startTestData.subject);
      const allocatedQuestions = startTestData.allocatedQuestions || 0;
      setAllocatedQuestions(allocatedQuestions);
      setTimer(allocatedQuestions * 60);
      const endTime = new Date();
      endTime.setSeconds(endTime.getSeconds() + allocatedQuestions * 60);
      setTestEndTime(endTime);
      setLastIndex(allocatedQuestions);

      const filteredSubject = subjects.filter(
        (subject) => subject.name === startTestData.subject
      );
      setSelectedSubjects(filteredSubject);
      setVisitedQuestions({ [`${startTestData.subject}-0`]: true });
    }
  }, []);

  useEffect(() => {
    if (testEndTime) {
      const countdown = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((testEndTime - now) / 1000);
        if (diff <= 0) {
          clearInterval(countdown);
          setTimer(0);
          handleSubmit();
        } else {
          setTimer(diff);
        }
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [testEndTime]);

  const formattedTime = {
    hours: Math.floor(timer / 3600),
    minutes: Math.floor((timer % 3600) / 60),
    seconds: timer % 60,
  };

  const handleOptionClick = (index) => {
    const questionData = questionsData[currentSubject][currentQuestion];
    const selectedAnswer = questionData.options[index];
    const correctAnswer = questionData.correctOption;
    const isCorrect = selectedAnswer === correctAnswer;
    const questionId = questionData.id;
    const questionInfo = JSON.parse(localStorage.getItem("questionInfo")) || [];
    const chapterInfo = questionInfo.find((item) => item.questionIds === questionId);
    const chapterName = chapterInfo ? chapterInfo.chapterName : "Unknown Chapter";
    const answerData = {
      subject: currentSubject,
      question: questionData.question,
      question_id: questionData.id,
      chapterName,
      selectedAnswer,
      isCorrect,
      correctAnswer,
    };
    let savedAnswers = JSON.parse(localStorage.getItem("examplan")) || [];
    const questionIndex = savedAnswers.findIndex(
      (answer) => answer.question_id === questionData.id
    );
    if (questionIndex >= 0) savedAnswers[questionIndex] = answerData;
    else savedAnswers.push(answerData);
    localStorage.setItem("examplan", JSON.stringify(savedAnswers));
    setAnswers({ ...answers, [`${currentSubject}-${currentQuestion}`]: index });
    setVisitedQuestions({ ...visitedQuestions, [`${currentSubject}-${currentQuestion}`]: true });
  };

  const handleNavigation = (direction) => {
    if (direction === "next") {
      if (currentQuestion >= lastIndex - 1) {
        setCurrentQuestion(0);
      } else {
        const nextQuestionIndex = currentQuestion + 1;
        setCurrentQuestion(nextQuestionIndex);
        setVisitedQuestions({
          ...visitedQuestions,
          [`${currentSubject}-${nextQuestionIndex}`]: true,
        });
      }
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReviewLater = () => {
    setMarkedForReview({
      ...markedForReview,
      [`${currentSubject}-${currentQuestion}`]: true,
    });
    handleNavigation("next");
  };

  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[`${currentSubject}-${currentQuestion}`];
    setAnswers(updatedAnswers);
    const savedAnswers = JSON.parse(localStorage.getItem("examplan")) || [];
    const currentQuestionData = questionsData[currentSubject][currentQuestion];
    const updatedSavedAnswers = savedAnswers.filter(
      answer => answer.question_id !== currentQuestionData.id
    );
    localStorage.setItem("examplan", JSON.stringify(updatedSavedAnswers));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const confirmSubmit = window.confirm("Are you sure you want to submit this test?");
    if (!confirmSubmit) return;
    setIsSubmitting(true);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Authentication failed! Please log in again.", { duration: 5000 });
      setIsSubmitting(false);
      return;
    }
    const endTime = new Date().toISOString();
    const startTime = localStorage.getItem("testStartTime") || new Date().toISOString();
    let correctAnswers = [], wrongAnswers = [], notAttempted = [], totalMarks = 0;
    const savedAnswers = JSON.parse(localStorage.getItem("examplan")) || [];
    savedAnswers.forEach((answer) => {
      const { question_id, selectedAnswer, correctAnswer, isCorrect, subject, chapterName } = answer;
      const marks = isCorrect ? 4 : selectedAnswer == null ? 0 : -1;
      const questionData = [
        question_id, subject, chapterName, selectedAnswer, correctAnswer, marks, 0
      ];
      if (selectedAnswer == null) notAttempted.push([question_id, subject, chapterName]);
      else if (isCorrect) correctAnswers.push(questionData);
      else wrongAnswers.push(questionData);
      totalMarks += marks;
    });
    const testResults = {
      correctAnswers,
      wrongAnswers,
      notAttempted,
      startTime,
      endTime,
      total_marks: totalMarks,
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/fulltest/submit`,
        testResults,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Test submitted successfully!", { duration: 5000 });
        window.location.href = "/result";
      } else {
        toast.error("Failed to submit test.", { duration: 5000 });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.error || "Something went wrong"}`, { duration: 5000 });
      setIsSubmitting(false);
    }
  };

  const getAnsweredCount = () => Object.keys(answers).filter(key => key.startsWith(currentSubject)).length;
  const getMarkedForReviewCount = () => Object.keys(markedForReview).filter(key => key.startsWith(currentSubject)).length;
  const getNotVisitedCount = () => lastIndex - Object.keys(visitedQuestions).filter(key => key.startsWith(currentSubject)).length;

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <Loading/>
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">
            <FaTimesCircle className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Test</h2>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  // MOBILE RENDER STARTS HERE
  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white py-3 px-4 shadow-sm flex items-center justify-between">
        <img src="/nexcore-logo-pc.png" alt="Logo" className="h-12" />
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center space-x-2">
            <FaRegClock className="text-xl text-blue-600" />
            <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded">{String(formattedTime.hours).padStart(2, '0')}</span>
            <span className="text-blue-900 font-bold">:</span>
            <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded">{String(formattedTime.minutes).padStart(2, '0')}</span>
            <span className="text-blue-900 font-bold">:</span>
            <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded">{String(formattedTime.seconds).padStart(2, '0')}</span>
          </div>
          {/* Subject tabs */}
          {selectedSubjects.map((subject) => (
            <button
              key={subject.name}
              className={`px-2 py-1 rounded transition-all text-xs flex items-center gap-1 ${currentSubject === subject.name ? "bg-blue-600 text-white font-semibold" : "bg-gray-100 text-gray-700"}`}
              onClick={() => { setCurrentSubject(subject.name); setCurrentQuestion(0); }}
            >
              {subject.icon} {subject.name}
            </button>
          ))}
        </div>
      </div>

      {/* Question Box */}
      <div className="flex-1 flex flex-col px-1 pt-2">
        <div className="bg-white rounded-xl shadow border mx-1 mt-2 flex flex-col overflow-hidden">
          {/* Question progress */}
          <div className="px-4 py-2 flex justify-between items-center border-b bg-gray-50">
            <span className="text-xs text-blue-600 font-bold">
              Q {currentQuestion + 1} / {lastIndex}
            </span>
            <span className={`text-xs rounded px-2 py-0.5 font-semibold ${markedForReview[`${currentSubject}-${currentQuestion}`] ? "bg-amber-100 text-amber-800" : answers[`${currentSubject}-${currentQuestion}`] !== undefined ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
              {markedForReview[`${currentSubject}-${currentQuestion}`]
                ? "Marked for Review"
                : answers[`${currentSubject}-${currentQuestion}`] !== undefined
                ? "Answered"
                : "Not Answered"}
            </span>
          </div>
          {/* Question */}
          <div className="p-4">
            <div className="mb-3 flex items-center">
              <img src="/question.png" alt="Q" className="h-10 w-10 rounded object-contain mr-2 border" />
              <span className="text-md font-medium">{questionsData[currentSubject]?.[currentQuestion]?.question || "No Question Available"}</span>
            </div>
            {/* Options */}
            <div className="space-y-2 mt-4">
              {questionsData[currentSubject]?.[currentQuestion]?.options.map(
                (option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-3 py-3 rounded-lg border flex items-center ${answers[`${currentSubject}-${currentQuestion}`] === index ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200"}`}
                    onClick={() => handleOptionClick(index)}
                  >
                    <span className={`w-6 h-6 mr-3 flex items-center justify-center rounded-full border ${answers[`${currentSubject}-${currentQuestion}`] === index ? "border-white bg-white/20" : "border-gray-300 bg-gray-50"}`}>
                      <div className="border-4 border-gray-50 rounded-full"></div>
                    </span>
                    <span>{option}</span>
                  </button>
                )
              )}
            </div>
            {/* Actions: Clear/Review */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleClearResponse}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-xs"
              >Clear Response</button>
              <button
                onClick={handleReviewLater}
                className="flex-1 py-2 bg-amber-500 text-white rounded-lg text-xs flex items-center justify-center"
              ><FaFlag className="mr-1" />Mark for Review</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Nav */}
      <div className="fixed left-0 right-0 bottom-0 bg-white shadow-lg border-t z-40 flex items-center justify-between px-1 py-2">
        <button
          onClick={() => handleNavigation("prev")}
          disabled={currentQuestion === 0}
          className={`flex-1 mx-1 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-sm ${currentQuestion === 0 && "opacity-50"}`}
        >Previous</button>
        <button
          onClick={() => setShowNavModal(true)}
          className="flex-1 mx-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm"
        >Questions</button>
        <button
          onClick={() => handleNavigation("next")}
          className="flex-1 mx-1 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm"
        >Next</button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 mx-1 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold text-sm"
        >
          {isSubmitting ? (
            <div className="mx-auto h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Submit"
          )}
        </button>
      </div>

      {/* Questions Navigation Modal */}
      {showNavModal && (
        <div className="fixed z-50 inset-0 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-4 pb-12 max-h-[65vh]">
            <div className="flex items-center mb-2">
              <span className="text-lg font-bold flex-1">Questions Overview</span>
              <button
                onClick={() => setShowNavModal(false)}
                className="text-2xl px-2">&times;</button>
            </div>
            <div className="flex flex-wrap gap-3 mb-3 text-xs">
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div>Answered ({getAnsweredCount()})</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"></div>Not Answered ({allocatedQuestions - getAnsweredCount() - getNotVisitedCount()})</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-400 rounded"></div>Not Visited ({getNotVisitedCount()})</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded"></div>For Review ({getMarkedForReviewCount()})</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: allocatedQuestions }).map((_, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 flex items-center justify-center text-xs rounded-md ${
                    currentQuestion === index
                      ? "bg-blue-600 text-white border-2 border-blue-700"
                      : markedForReview[`${currentSubject}-${index}`]
                      ? "bg-amber-500 text-white"
                      : answers[`${currentSubject}-${index}`] !== undefined
                      ? "bg-green-500 text-white"
                      : visitedQuestions[`${currentSubject}-${index}`]
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                  onClick={() => {
                    setCurrentQuestion(index);
                    setShowNavModal(false);
                    if (!visitedQuestions[`${currentSubject}-${index}`]) {
                      setVisitedQuestions({
                        ...visitedQuestions,
                        [`${currentSubject}-${index}`]: true,
                      });
                    }
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestInterface;
