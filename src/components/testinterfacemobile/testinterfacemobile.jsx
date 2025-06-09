"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFlask, FaAtom, FaDna, FaClock, FaCheck, FaFlag } from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";

const subjects = [
  { name: "Physics", icon: <FaAtom className="text-lg text-blue-500" /> },
  { name: "Chemistry", icon: <FaFlask className="text-lg text-green-500" /> },
  { name: "Biology", icon: <FaDna className="text-lg text-red-500" /> },
];

const TestInterfaceMobile = () => {
  const [questionsData, setQuestionsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubject, setCurrentSubject] = useState("Physics");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timer, setTimer] = useState(0);
  const [allocatedQuestions, setAllocatedQuestions] = useState(0);
  const [testEndTime, setTestEndTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load test setup info and questions
  useEffect(() => {
    // Read startTest data from localStorage for per-student info
    const startTestData = JSON.parse(localStorage.getItem("startTest"));
    if (startTestData) {
      setCurrentSubject(startTestData.subject);
      const allocated = startTestData.allocatedQuestions || 0;
      setAllocatedQuestions(allocated);

      // 1 minute per question
      const timeInSeconds = allocated * 60;
      setTimer(timeInSeconds);

      // End time calculation
      const endTime = new Date();
      endTime.setSeconds(endTime.getSeconds() + timeInSeconds);
      setTestEndTime(endTime);

      // Mark first question as visited
      setVisitedQuestions({ [`${startTestData.subject}-0`]: true });
    }

    // Fetch questions
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

  // Timer logic (ends test at timeout)
  useEffect(() => {
    if (!testEndTime) return;
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
  }, [testEndTime]);

  // Timer formatting
  const formattedTime = {
    hours: Math.floor(timer / 3600),
    minutes: Math.floor((timer % 3600) / 60),
    seconds: timer % 60,
  };

  // Option click handler
  const handleOptionClick = (index) => {
    const questionData = questionsData[currentSubject][currentQuestion];
    const selectedAnswer = questionData.options[index];
    const correctAnswer = questionData.correctOption;

    // Find the chapter name if present in localStorage
    const questionId = questionData.id;
    const questionInfo = JSON.parse(localStorage.getItem("questionInfo")) || [];
    const chapterInfo = questionInfo.find(item => item.questionIds === questionId);
    const chapterName = chapterInfo ? chapterInfo.chapterName : "Unknown Chapter";

    // Save answer data
    const isCorrect = selectedAnswer === correctAnswer;
    const answerData = {
      subject: currentSubject,
      question: questionData.question,
      question_id: questionData.id,
      chapterName,
      selectedAnswer,
      isCorrect,
      correctAnswer,
    };

    // Update examplan in localStorage
    let savedAnswers = JSON.parse(localStorage.getItem("examplan")) || [];
    const questionIndex = savedAnswers.findIndex(ans => ans.question_id === questionData.id);
    if (questionIndex >= 0) savedAnswers[questionIndex] = answerData;
    else savedAnswers.push(answerData);
    localStorage.setItem("examplan", JSON.stringify(savedAnswers));

    // Update UI states
    setAnswers({ ...answers, [`${currentSubject}-${currentQuestion}`]: index });
    setVisitedQuestions({ ...visitedQuestions, [`${currentSubject}-${currentQuestion}`]: true });
  };

  // Navigation
  const handleNavigation = (direction) => {
    if (direction === "next") {
      if (currentQuestion >= allocatedQuestions - 1) {
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

  // Mark for review
  const handleReviewLater = () => {
    setMarkedForReview({
      ...markedForReview,
      [`${currentSubject}-${currentQuestion}`]: !markedForReview[`${currentSubject}-${currentQuestion}`],
    });
  };

  // Clear response
  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[`${currentSubject}-${currentQuestion}`];
    setAnswers(updatedAnswers);

    // Remove from localStorage
    const savedAnswers = JSON.parse(localStorage.getItem("examplan")) || [];
    const currentQuestionData = questionsData[currentSubject][currentQuestion];
    const updatedSavedAnswers = savedAnswers.filter(
      answer => answer.question_id !== currentQuestionData.id
    );
    localStorage.setItem("examplan", JSON.stringify(updatedSavedAnswers));
  };

  // Submit
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
    let correctAnswers = [];
    let wrongAnswers = [];
    let notAttempted = [];
    let totalMarks = 0;
    const savedAnswers = JSON.parse(localStorage.getItem("examplan")) || [];

    savedAnswers.forEach((answer) => {
      const { question_id, selectedAnswer, correctAnswer, isCorrect, subject, chapterName } = answer;
      const marks = isCorrect ? 4 : selectedAnswer === null ? 0 : -1;
      const questionData = [
        question_id, subject, chapterName, selectedAnswer, correctAnswer, marks, 0
      ];
      if (selectedAnswer === null) {
        notAttempted.push([question_id, subject, chapterName]);
      } else if (isCorrect) {
        correctAnswers.push(questionData);
      } else {
        wrongAnswers.push(questionData);
      }
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
      }
    } catch (error) {
      toast.error(
        "Error submitting test: " + (error.response?.data?.message || error.message),
        { duration: 5000 }
      );
      setIsSubmitting(false);
    }
  };

  // Status helper
  const getQuestionStatus = (questionIndex) => {
    const key = `${currentSubject}-${questionIndex}`;
    if (markedForReview[key]) return "review";
    if (answers[key] !== undefined) return "answered";
    if (visitedQuestions[key]) return "unanswered";
    return "not-visited";
  };

  // Progress
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.keys(markedForReview).filter(key => markedForReview[key]).length;
  const notVisitedCount = allocatedQuestions - Object.keys(visitedQuestions).length;

  // UI
  if (loading)
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">{error}</div>
    );

  const isLowTime = timer < 300;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-white shadow sticky top-0 z-20">
        <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded">
          Mock Test
        </span>
        <button
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-md shadow font-semibold flex items-center"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Submitting...
            </>
          ) : (
            <>Submit</>
          )}
        </button>
      </div>

      {/* Timer and Progress */}
      <div className={`flex items-center justify-between my-2 px-4 py-2 rounded-lg shadow ${
        isLowTime ? "bg-red-100 animate-pulse" : "bg-white"
      }`}>
        <div className="flex items-center gap-2">
          <FaClock className={`text-xl ${isLowTime ? "text-red-600" : "text-blue-600"}`} />
          <span className={`font-mono font-semibold text-lg ${isLowTime ? "text-red-600" : "text-blue-700"}`}>
            {String(formattedTime.hours).padStart(2, "0")}:
            {String(formattedTime.minutes).padStart(2, "0")}:
            {String(formattedTime.seconds).padStart(2, "0")}
          </span>
        </div>
        <span className="text-xs text-gray-700 font-semibold">
          {answeredCount}/{allocatedQuestions} Answered
        </span>
      </div>

      {/* Question Navigation Grid */}
      <div className="flex flex-wrap gap-2 justify-center p-2">
        {Array.from({ length: allocatedQuestions }).map((_, index) => {
          const status = getQuestionStatus(index);
          const bgMap = {
            answered: "bg-gradient-to-br from-green-500 to-emerald-500",
            review: "bg-gradient-to-br from-purple-500 to-pink-500",
            unanswered: "bg-gradient-to-br from-red-500 to-orange-500",
            "not-visited": "bg-gray-400",
          };
          return (
            <button
              key={index}
              className={`w-9 h-9 rounded-md text-xs text-white font-bold shadow ${bgMap[status]} ${
                currentQuestion === index ? "ring-2 ring-blue-300 scale-110" : ""
              }`}
              onClick={() => {
                setCurrentQuestion(index);
                setVisitedQuestions({
                  ...visitedQuestions,
                  [`${currentSubject}-${index}`]: true,
                });
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-around text-xs my-2">
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>Answered</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded-full inline-block"></span>Review</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>Unanswered</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-400 rounded-full inline-block"></span>Not Visited</div>
      </div>

      {/* Main Question Display */}
      <div className="bg-white rounded-2xl shadow-lg mx-2 my-2 p-4 flex flex-col flex-grow">
        <div className="mb-2 flex justify-between items-center">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
            Question {currentQuestion + 1} of {allocatedQuestions}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
            {subjects.find(s => s.name === currentSubject)?.icon}
            {currentSubject}
          </span>
        </div>
        <div className="font-semibold mb-3 min-h-[40px]">
          {questionsData[currentSubject]?.[currentQuestion]?.question ||
            "No question available for this subject yet"}
        </div>
        <div className="flex flex-col gap-2">
          {questionsData[currentSubject]?.[currentQuestion]?.options.map((option, idx) => {
            const selected = answers[`${currentSubject}-${currentQuestion}`] === idx;
            return (
              <button
                key={idx}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 flex items-center gap-3 transition ${
                  selected
                    ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 font-semibold shadow"
                    : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50"
                }`}
                onClick={() => handleOptionClick(idx)}
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                    selected ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white"
                  }`}
                >
                  {selected ? <FaCheck /> : String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            );
          })}
        </div>
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <button
            className="bg-yellow-500 text-white py-2 px-2 rounded-md text-xs font-semibold shadow hover:bg-yellow-600 transition"
            onClick={handleClearResponse}
          >
            Clear Response
          </button>
          <button
            className={`py-2 px-2 rounded-md text-xs font-semibold shadow transition ${
              markedForReview[`${currentSubject}-${currentQuestion}`]
                ? "bg-purple-700 text-white"
                : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            }`}
            onClick={handleReviewLater}
          >
            {markedForReview[`${currentSubject}-${currentQuestion}`]
              ? "Marked for Review"
              : <><FaFlag className="inline mr-1" />Mark for Review</>}
          </button>
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md text-xs font-semibold shadow hover:bg-blue-200 transition"
            onClick={() => handleNavigation("prev")}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-xs font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => handleNavigation("next")}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInterfaceMobile;
