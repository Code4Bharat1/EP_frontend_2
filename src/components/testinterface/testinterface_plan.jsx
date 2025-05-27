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
  FaRegQuestionCircle, 
  FaFlag
} from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";

const subjects = [
  { name: "Physics", icon: <FaAtom className="text-lg text-blue-500" /> },
  { name: "Chemistry", icon: <FaFlask className="text-lg text-green-500" /> },
  { name: "Biology", icon: <FaDna className="text-lg text-red-500" /> },
];

const TestInterface = () => {
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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/fetch-questions`
        );
        const data = response.data;
        const subjectWiseQuestions = {
          Physics: [],
          Chemistry: [],
          Biology: [],
        };

        data.questions.forEach((item) => {
          const subject = item.question.subject;
          subjectWiseQuestions[subject]?.push({
            id: item.question.id,
            question: item.question.question_text,
            options: item.options.map((opt) => opt.option_text),
            correctOption: item.options.find((opt) => opt.is_correct)
              ?.option_text,
          });
        });
        setQuestionsData(subjectWiseQuestions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
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
      
      // Set timer based on number of questions (1 minute per question)
      const timeInSeconds = allocatedQuestions * 60; // 60 seconds per question
      setTimer(timeInSeconds);
      
      // Calculate and store the end time
      const endTime = new Date();
      endTime.setSeconds(endTime.getSeconds() + timeInSeconds);
      setTestEndTime(endTime);
      
      if (allocatedQuestions > 0) {
        setLastIndex(allocatedQuestions);
      }

      const filteredSubject = subjects.filter(
        (subject) => subject.name === startTestData.subject
      );
      setSelectedSubjects(filteredSubject);
      
      // Mark first question as visited
      setVisitedQuestions({
        [`${startTestData.subject}-0`]: true,
      });
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
    const correctAnswer = questionData.correctOption; // Correct answer from the backend
  
    // Determine if the selected answer is correct
    const isCorrect = selectedAnswer === correctAnswer;
    
    // Find the chapter name by matching the question_id
    const questionId = questionData.id;
    const questionInfo = JSON.parse(localStorage.getItem("questionInfo")) || [];
    const chapterInfo = questionInfo.find(
      (item) => item.questionIds === questionId
    );
  
    // If chapterInfo exists, add the chapter name to the answer data
    const chapterName = chapterInfo ? chapterInfo.chapterName : "Unknown Chapter";
  
    const answerData = {
      subject: currentSubject,
      question: questionData.question,
      question_id: questionData.id,
      chapterName, // Add chapter name here
      selectedAnswer,
      isCorrect, // Save whether the answer is correct
      correctAnswer,
    };
  
    let savedAnswers = JSON.parse(localStorage.getItem("examplan")) || [];
  
    const questionIndex = savedAnswers.findIndex(
      (answer) => answer.question_id === questionData.id // Use question_id to identify the question
    );
  
    if (questionIndex >= 0) {
      // If the question is already in the examplan, update it
      savedAnswers[questionIndex] = answerData;
    } else {
      // If the question is not in the examplan, add it
      savedAnswers.push(answerData);
    }
  
    // Save the updated examplan in localStorage
    localStorage.setItem("examplan", JSON.stringify(savedAnswers));
  
    // Update state for answers and visited questions
    setAnswers({ ...answers, [`${currentSubject}-${currentQuestion}`]: index });
    setVisitedQuestions({
      ...visitedQuestions,
      [`${currentSubject}-${currentQuestion}`]: true,
    });
  };
    
  const handleNavigation = (direction) => {
    if (direction === "next") {
      if (currentQuestion >= lastIndex - 1) {
        setCurrentQuestion(0); // Reset to the first question if the last question is reached
      } else {
        const nextQuestionIndex = currentQuestion + 1;
        setCurrentQuestion(nextQuestionIndex); 
        // Mark the next question as visited
        setVisitedQuestions({
          ...visitedQuestions,
          [`${currentSubject}-${nextQuestionIndex}`]: true,
        });
      }
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1); // Go to the previous question
    }
  };

  const handleReviewLater = () => {
    setMarkedForReview({
      ...markedForReview,
      [`${currentSubject}-${currentQuestion}`]: true,
    });
    handleNavigation("next"); // Move to the next question after review
  };

  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[`${currentSubject}-${currentQuestion}`];
    setAnswers(updatedAnswers);
    
    // Remove from localStorage as well
    const savedAnswers = JSON.parse(localStorage.getItem("examplan")) || [];
    const currentQuestionData = questionsData[currentSubject][currentQuestion];
    const updatedSavedAnswers = savedAnswers.filter(
      answer => answer.question_id !== currentQuestionData.id
    );
    localStorage.setItem("examplan", JSON.stringify(updatedSavedAnswers));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    const confirmSubmit = window.confirm("Are you sure you want to submit this test?");
    if (!confirmSubmit) return;
  
    setIsSubmitting(true);
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Authentication failed! Please log in again.", {
        duration: 5000
      });
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
        question_id,
        subject,
        chapterName,
        selectedAnswer,
        correctAnswer,
        marks,
        0, // Assuming 0 is for some other data
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
        toast.success("Test submitted successfully!", {
          duration: 5000
        });
        window.location.href = "/result";
      } else {
        toast.error("Failed to submit test.", {
          duration: 5000
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(
        "❌ Error submitting test:",
        error.response?.data || error.message
      );
      toast.error(`Error: ${error.response?.data?.error || "Something went wrong"}`, {
        duration: 5000
      });
      setIsSubmitting(false);
    }
  };
  
  const getAnsweredCount = () => {
    return Object.keys(answers).filter(key => key.startsWith(currentSubject)).length;
  };
  
  const getMarkedForReviewCount = () => {
    return Object.keys(markedForReview).filter(key => key.startsWith(currentSubject)).length;
  };
  
  const getNotVisitedCount = () => {
    return lastIndex - Object.keys(visitedQuestions).filter(key => key.startsWith(currentSubject)).length;
  };
  
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

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Header Section */}
      <div className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/nexcore-logo-pc.png" alt="Logo" className="h-20 mr-4" />
          
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Timer */}
          <div className="flex items-center space-x-2">
            <FaRegClock className="text-xl text-blue-600" />
            <div className="flex space-x-1">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-md shadow-sm">
                {String(formattedTime.hours).padStart(2, '0')}
              </div>
              <span className="text-gray-800 font-bold">:</span>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-md shadow-sm">
                {String(formattedTime.minutes).padStart(2, '0')}
              </div>
              <span className="text-gray-800 font-bold">:</span>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-md shadow-sm">
                {String(formattedTime.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
          
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:from-red-600 hover:to-red-700 transition duration-300 flex items-center"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              "Submit Test"
            )}
          </button>
        </div>
      </div>

      {/* Test Header */}
      <div className="bg-white shadow-sm mt-1 py-3 px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-700">
            Mock Test
          </h2>
          
          <div className="flex gap-2">
            {selectedSubjects.map((subject) => (
              <button
                key={subject.name}
                className={`px-5 py-1.5 flex items-center gap-2 rounded-md transition-all duration-300 ${
                  currentSubject === subject.name
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setCurrentSubject(subject.name);
                  setCurrentQuestion(0);
                }}
              >
                {subject.icon} {subject.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-grow p-4">
        {/* Question Section */}
        <div className="w-3/4 pr-4 select-none">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
            {/* Question Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">
                Question {currentQuestion + 1} of {lastIndex}
              </h3>
              
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  markedForReview[`${currentSubject}-${currentQuestion}`]
                    ? "bg-amber-100 text-amber-800"
                    : answers[`${currentSubject}-${currentQuestion}`] !== undefined
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {markedForReview[`${currentSubject}-${currentQuestion}`]
                    ? "Marked for Review"
                    : answers[`${currentSubject}-${currentQuestion}`] !== undefined
                    ? "Answered"
                    : "Not Answered"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {currentSubject}
                </span>
              </div>
            </div>
            
            {/* Question Content */}
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center items-start">
                  <img
                    src="/question.png"
                    alt="Question"
                    className="max-w-full h-auto rounded-lg object-contain"
                  />
                </div>

                <div className="md:w-2/3">
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-800">
                      {questionsData[currentSubject]?.[currentQuestion]?.question ||
                        "No Question Available"}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {questionsData[currentSubject]?.[currentQuestion]?.options.map(
                      (option, index) => (
                        <button
                          key={index}
                          className={`w-full text-left px-5 py-3 rounded-lg border transition-all duration-300 flex items-center ${
                            answers[`${currentSubject}-${currentQuestion}`] === index
                              ? "bg-blue-600 text-white border-blue-600 shadow-md"
                              : "bg-white hover:bg-gray-50 border-gray-200"
                          }`}
                          onClick={() => handleOptionClick(index)}
                        >
                          <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 border ${
                            answers[`${currentSubject}-${currentQuestion}`] === index
                              ? "border-white bg-white/20"
                              : "border-gray-300 bg-gray-50"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-md">{option}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={() => handleNavigation("prev")}
                disabled={currentQuestion === 0}
                className={`px-6 py-2 rounded-lg flex items-center space-x-1 transition-all ${
                  currentQuestion === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleClearResponse}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear</span>
                </button>
                
                <button
                  onClick={handleReviewLater}
                  className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all flex items-center space-x-1"
                >
                  <FaFlag className="h-4 w-4" />
                  <span>Mark for Review</span>
                </button>
              </div>
              
              <button
                onClick={() => handleNavigation("next")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center space-x-1"
              >
                <span>Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Questions Navigation Panel */}
        <div className="w-1/4">
          <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700 flex items-center">
                <span className="mr-2">Questions Overview</span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{allocatedQuestions} Questions</span>
              </h3>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                  <span className="text-sm text-gray-700">Answered ({getAnsweredCount()})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                  <span className="text-sm text-gray-700">Not Answered ({allocatedQuestions - getAnsweredCount() - getNotVisitedCount()})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
                  <span className="text-sm text-gray-700">Not Visited ({getNotVisitedCount()})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
                  <span className="text-sm text-gray-700">For Review ({getMarkedForReviewCount()})</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 flex-grow overflow-y-auto">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: allocatedQuestions }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-full aspect-square flex items-center justify-center text-sm rounded-md transition-all ${
                      currentQuestion === index
                        ? "bg-blue-600 text-white border-2 border-blue-700 shadow-md"
                        : markedForReview[`${currentSubject}-${index}`]
                        ? "bg-amber-500 text-white"
                        : answers[`${currentSubject}-${index}`] !== undefined
                        ? "bg-green-500 text-white"
                        : visitedQuestions[`${currentSubject}-${index}`]
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                    onClick={() => {
                      setCurrentQuestion(index);
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
            
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-sm hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Submit Test
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;