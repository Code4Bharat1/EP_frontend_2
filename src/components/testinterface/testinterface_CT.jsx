"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TfiTimer } from "react-icons/tfi";
import { FaFlask, FaAtom, FaDna, FaClock, FaCheck, FaExclamation } from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";

const subjects = [
  { name: "Physics", icon: <FaAtom className="text-lg text-blue-500" /> },
  { name: "Chemistry", icon: <FaFlask className="text-lg text-green-500" /> },
  { name: "Biology", icon: <FaDna className="text-lg text-red-500" /> },
];

const TestInterface = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState({});
  const [questionsData, setQuestionsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubject, setCurrentSubject] = useState("Physics");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({}); 
  const [timer, setTimer] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  const [numQuestions, setNumQuestions] = useState(0);
  const [startTime, setStartTime] = useState(new Date());

  useEffect(() => {
    if (typeof window === "undefined") return; // Safety check for SSR
  
    const selectedChapters = JSON.parse(localStorage.getItem("selectedChapters")) || {};
    setSelectedChapters(selectedChapters);
  
    const storedSubjects = JSON.parse(localStorage.getItem("selectedSubjects")) || [];
    setSelectedSubjects(storedSubjects);
  
    const subjectChapters = selectedChapters[currentSubject];
    const numQuestion = subjectChapters
      ? Object.values(subjectChapters).reduce(
          (total, chapter) => total + (Number(chapter.numQuestions) || 0),
          0
        )
      : 0;
    
    setNumQuestions(numQuestion);
    
    // Set timer based on number of questions (1 minute per question)
    if (numQuestion > 0) {
      setTimer(numQuestion * 60);
    }
  
    const fetchQuestions = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/createtest/fetch-questions`,
          {
            selectedSubjects: storedSubjects,
            selectedChapters,
            numQuestions: numQuestion,
          }
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
            correctAnswer: item.correctAnswer
              ? item.correctAnswer.option_text
              : null,
          });
        });
  
        setQuestionsData(subjectWiseQuestions);
        setLoading(false);
  
        // Store chapter info
        const questionInfo = data.questions.map((item) => ({
          chapterId: item.question.chapterId,
          chapterName: item.question.chapter,
          questionIds: item.question.id,
        }));
  
        localStorage.setItem("questionInfo", JSON.stringify(questionInfo));
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions");
        setLoading(false);
      }
    };
  
    fetchQuestions();
  }, [currentSubject]); 
  
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

  // useEffect for fixing the numQuestion bug
  useEffect(() => {
    if (numQuestions > 0) {
      setLastIndex(numQuestions);
    }
  }, [numQuestions]);

  const formattedTime = {
    hours: Math.floor(timer / 3600),
    minutes: Math.floor((timer % 3600) / 60),
    seconds: timer % 60,
  };
  
  const handleOptionClick = (index) => {
    if (!questionsData[currentSubject] || !questionsData[currentSubject][currentQuestion]) {
      return;
    }
    
    const questionData = questionsData[currentSubject][currentQuestion];
    const selectedAnswer = questionData.options[index];
    const correctAnswer = questionData.correctAnswer;
    const isCorrect = selectedAnswer === correctAnswer;
  
    const answerSnapshot = {
      question_id: questionData.id,
      selectedAnswer,
      correctAnswer,
    };
    localStorage.setItem("lastAnswerClicked", JSON.stringify(answerSnapshot));
  
    const questionId = questionData.id;
    const questionInfo = JSON.parse(localStorage.getItem("questionInfo")) || [];
    const chapterInfo = questionInfo.find(
      (item) => item.questionIds === questionId
    );
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
  
    let savedAnswers = JSON.parse(localStorage.getItem("testAnswers")) || [];
  
    const existingIndex = savedAnswers.findIndex(
      (answer) =>
        answer.question_id === questionData.id &&
        answer.subject === currentSubject
    );
  
    const currentTime = new Date();
    const timeTakenInSeconds = (currentTime - startTime) / 1000;
    const minutes = Math.floor(timeTakenInSeconds / 60);
    const seconds = Math.floor(timeTakenInSeconds % 60);
  
    const answerWithTime = { ...answerData, timeTaken: { minutes, seconds } };
  
    // Replace if already answered, otherwise add new
    if (existingIndex >= 0) {
      savedAnswers[existingIndex] = answerWithTime;
    } else {
      savedAnswers.push(answerWithTime);
    }
  
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
    const totalQuestions = lastIndex || 0;
    
    if (direction === "next" && currentQuestion >= totalQuestions - 1) {
      const currentSubjectIndex = selectedSubjects.indexOf(currentSubject);
      const nextSubjectIndex = (currentSubjectIndex + 1) % selectedSubjects.length;
      setCurrentSubject(selectedSubjects[nextSubjectIndex]);
      setCurrentQuestion(0);
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (direction === "next" && currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === "prev" && currentQuestion === 0) {
      // Go to previous subject if at first question
      const currentSubjectIndex = selectedSubjects.indexOf(currentSubject);
      if (currentSubjectIndex > 0) {
        const prevSubject = selectedSubjects[currentSubjectIndex - 1];
        setCurrentSubject(prevSubject);
        
        // Get the number of questions in the previous subject
        const prevSubjectChapters = selectedChapters[prevSubject];
        const prevSubjectQuestions = prevSubjectChapters
          ? Object.values(prevSubjectChapters).reduce(
              (total, chapter) => total + (Number(chapter.numQuestions) || 0),
              0
            )
          : 0;
          
        setCurrentQuestion(Math.max(prevSubjectQuestions - 1, 0));
      }
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
    
    // Also update localStorage
    let savedAnswers = JSON.parse(localStorage.getItem("testAnswers")) || [];
    savedAnswers = savedAnswers.filter(
      answer => !(answer.question_id === questionsData[currentSubject][currentQuestion]?.id &&
                answer.subject === currentSubject)
    );
    localStorage.setItem("testAnswers", JSON.stringify(savedAnswers));
  };

  // Calculate the total time according to the subjects
  const calculateTotalTime = (subject) => {
    const questionTime = JSON.parse(localStorage.getItem("questionTime")) || {};
    let totalTimeInSeconds = 0;
  
    // Sum up the time for each question in the current subject
    Object.keys(questionTime).forEach((key) => {
      if (key.startsWith(subject)) {
        totalTimeInSeconds += questionTime[key];
      }
    });
  
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = Math.floor(totalTimeInSeconds % 60);
  
    return { minutes, seconds };
  };
  
  // Helper functions for stats
  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };
  
  const getMarkedCount = () => {
    return Object.keys(markedForReview).length;
  };
  
  const getAnsweredCountBySubject = (subject) => {
    return Object.keys(answers).filter(key => key.startsWith(`${subject}-`)).length;
  };

  const handleSubmit = async () => {
    if (!window.confirm("Confirm submit?")) return;
  
    const testAnswers = JSON.parse(localStorage.getItem("testAnswers")) || [];
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const testName = localStorage.getItem("testName") || [];
  
    if (!authToken) {
      alert("No authentication token found!");
      return;
    }
  
    const correctAnswers = [];
    const wrongAnswers = [];
    const notAttempted = [];
  
    const subjectWiseMarks = {
      Physics: 0,
      Chemistry: 0,
      Biology: 0,
    };
  
    const endTime = new Date();
    let total_marks = 0;
  
    // Calculate total time per subject
    const totalTimePerSubject = {
      Physics: calculateTotalTime("Physics"),
      Chemistry: calculateTotalTime("Chemistry"),
      Biology: calculateTotalTime("Biology"),
    };
  
    // Loop through the answers and calculate subject-wise marks
    testAnswers.forEach((answerObj) => {
      const { subject, question, selectedAnswer, correctAnswer } = answerObj;
  
      const chapter = "General"; // You can refine this if you track chapters per question
      const questionId = question; // Ideally, replace with questionId if available
      const marks = selectedAnswer === correctAnswer ? 4 : -1; // +4 for correct, -1 for incorrect
      const timeSpent = "N/A"; // Optional: you can integrate actual tracking
  
      // Update the subject-wise marks
      if (selectedAnswer === correctAnswer) {
        subjectWiseMarks[subject] += 4; // Add 4 for correct answers
      } else if (selectedAnswer !== null && selectedAnswer !== "") {
        subjectWiseMarks[subject] -= 1; // Subtract 1 for incorrect answers
      }
  
      const answerPayload = [
        questionId,
        subject,
        chapter,
        selectedAnswer,
        correctAnswer,
        marks,
        timeSpent,
      ];
  
      if (!selectedAnswer) {
        notAttempted.push([questionId, subject, chapter]);
      } else if (selectedAnswer === correctAnswer) {
        correctAnswers.push(answerPayload);
        total_marks += 4;
      } else {
        if (selectedAnswer !== "") {
          wrongAnswers.push(answerPayload);
        }
      }
    });
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/createtest/submit-test`,
        {
          correctAnswers,
          wrongAnswers,
          notAttempted,
          total_marks,
          selectedChapters,
          testName,
          startTime,
          endTime,
          subjectWiseMarks, // Add subject-wise marks to the payload
          totalTimePerSubject, // Send total time spent per subject
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      toast.success(response.data.message, {
        duration: 5000
      });

      window.location.href = "/resultCT";
    } catch (error) {
      toast.error("Error submitting test!", {
        duration: 5000
      });
      console.error(error);
    }
  };
  
  if (loading)
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <Loading />
      </div>
    );
    
  if (error) 
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <p className="text-center text-red-500 text-xl bg-white p-6 rounded-lg shadow-lg">
          {error}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md py-4 ">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Mock Test</h1>
          
          <div className="flex items-center gap-4">
            {/* Timer Display */}
            <div className="bg-blue-50 p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 mb-1">
                <FaClock className="text-blue-600" />
                <span className="font-medium text-blue-700">Time Left</span>
              </div>
              <div className="flex gap-2">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-medium">
                  {formattedTime.hours.toString().padStart(2, '0')}h
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-medium">
                  {formattedTime.minutes.toString().padStart(2, '0')}m
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-md font-medium">
                  {formattedTime.seconds.toString().padStart(2, '0')}s
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="text-sm text-gray-500">Time per question:</span>
              <span className="font-bold text-gray-700">1 minute</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <h2 className="text-lg font-semibold mb-3">Selected Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedSubjects.length > 0 ? (
              selectedSubjects.map((subject, index) => (
                <button
                  key={index}
                  className={`px-6 py-3 flex items-center justify-center gap-2 rounded-lg transition-all ${
                    currentSubject === subject
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                  }`}
                  onClick={() => {
                    setCurrentSubject(subject);
                    setCurrentQuestion(0);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {subjects.find((s) => s.name === subject)?.icon}
                    <span className="font-medium">{subject}</span>
                  </div>
                  {getAnsweredCountBySubject(subject) > 0 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                      {getAnsweredCountBySubject(subject)} answered
                    </span>
                  )}
                </button>
              ))
            ) : (
              <p className="text-gray-500 col-span-3 text-center">No subjects selected</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 flex-grow flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left Section: Questions & Options */}
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-medium">
              Question {currentQuestion + 1} of {numQuestions}
            </span>
            <span className="text-gray-500 flex items-center gap-2">
              {subjects.find((s) => s.name === currentSubject)?.icon}
              <span className="font-medium">{currentSubject}</span>
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Question Image - For visual interest, can be hidden if not needed */}
            <div className="w-full md:w-1/4 flex justify-center items-start">
              <img
                src="/question.png"
                alt="Question"
                className="w-full max-w-[200px] object-contain opacity-60"
              />
            </div>
            
            {/* Question Content */}
            <div className="w-full md:w-3/4">
              {questionsData[currentSubject]?.length > 0 ? (
                <>
                  <h3 className="text-xl font-semibold mb-6">
                    {questionsData[currentSubject][currentQuestion]?.question ||
                      "No Question Available"}
                  </h3>
                  
                  <div className="space-y-4">
                    {questionsData[currentSubject][currentQuestion]?.options.map((option, index) => (
                      <button
                        key={`${currentSubject}-${currentQuestion}-${index}`}
                        className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                          answers[`${currentSubject}-${currentQuestion}`] === index
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        onClick={() => handleOptionClick(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 flex-shrink-0 ${
                            answers[`${currentSubject}-${currentQuestion}`] === index
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200"
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg">
                  <FaExclamation className="text-yellow-500 text-2xl mb-2" />
                  <p className="text-gray-500">No questions available for this subject</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="mt-8 flex flex-wrap justify-between gap-4">
            <div className="flex gap-3">
              <button
                onClick={handleClearResponse}
                className="px-6 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-colors"
              >
                Clear Response
              </button>
              <button
                onClick={handleReviewLater}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  markedForReview[`${currentSubject}-${currentQuestion}`]
                    ? "bg-purple-700 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                {markedForReview[`${currentSubject}-${currentQuestion}`] 
                  ? "Marked for Review" 
                  : "Mark for Review"}
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleNavigation("prev")}
                className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => handleNavigation("next")}
                className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Status & Question Grid */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Test Overview - At the top for better visibility */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Test Overview</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 text-sm">Answered</span>
                  <span className="text-green-700 font-bold">{getAnsweredCount()}</span>
                </div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 text-sm">Marked</span>
                  <span className="text-purple-700 font-bold">{getMarkedCount()}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 text-sm">Total</span>
                  <span className="text-blue-700 font-bold">{numQuestions}</span>
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-red-700 text-sm">Remaining</span>
                  <span className="text-red-700 font-bold">
                    {numQuestions - getAnsweredCount()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Your Progress</div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-2" 
                  style={{ width: `${(getAnsweredCount() / numQuestions) * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-sm mt-1">
                {Math.round((getAnsweredCount() / numQuestions) * 100)}% Complete
              </div>
            </div>
          </div>
          
          {/* Question Legend - Also higher for better visibility */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Question Legend</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {numQuestions} questions
              </span>
            </div>
            
            {/* Legend colors */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm">Unanswered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-sm">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Review</span>
              </div>
            </div>
            
            {/* Question Numbers */}
            <div className="grid grid-cols-5 gap-2 text-center">
              {Array.from({ length: numQuestions }).map((_, index) => (
                <button
                  key={index}
                  className={`aspect-square flex items-center justify-center text-xs font-medium text-white rounded-md transition-colors ${
                    currentQuestion === index
                      ? "ring-2 ring-blue-300 ring-offset-2"
                      : ""
                  } ${
                    markedForReview[`${currentSubject}-${index}`]
                      ? "bg-purple-500 hover:bg-purple-600"
                      : answers[`${currentSubject}-${index}`] !== undefined
                      ? "bg-green-500 hover:bg-green-600"
                      : visitedQuestions[`${currentSubject}-${index}`]
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <FaCheck className="text-white" />
              Submit Test
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Your test will be evaluated and results will be shown.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;