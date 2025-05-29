"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TfiTimer } from "react-icons/tfi";
import { FaFlask, FaAtom, FaDna, FaClock, FaCheck, FaTimes, FaBookmark, FaChevronDown, FaChevronUp } from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";
import { useRouter } from "next/navigation";

const subjects = [
  { name: "Physics", icon: <FaAtom className="text-lg text-blue-500" />, questionCount: 45 },
  { name: "Chemistry", icon: <FaFlask className="text-lg text-green-500" />, questionCount: 45 },
  { name: "Biology", icon: <FaDna className="text-lg text-red-500" />, questionCount: 90 },
];

const TestInterface = () => {

  const router = useRouter();
  
  const [questionsData, setQuestionsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubject, setCurrentSubject] = useState("Physics");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [totalQuestionsBySubject, setTotalQuestionsBySubject] = useState({
    Physics: 45,
    Chemistry: 45,
    Biology: 90
  });
  const [testName, setTestName] = useState("");
  
  // Calculate total time based on question count (1 min per question)
  const totalQuestions = totalQuestionsBySubject.Physics + totalQuestionsBySubject.Chemistry + totalQuestionsBySubject.Biology;
  const [timer, setTimer] = useState(totalQuestions * 60); // 1 minute per question
  const [timeSpent, setTimeSpent] = useState({});


  // Detect the user exits fullscreen
  useEffect(() => {
  const handleFullScreenChange = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement
    ) {
      // User exited fullscreen mode
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
}, []);

  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/fetch-questions`
        );
        const data = response.data;
        console.log(data);
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
            chapter: item.question.chapter,
            options: item.options.map((opt) => opt.option_text),
            correctOption: item.options.find((opt) => opt.is_correct)
              ?.option_text,
          });
        });
        
        setQuestionsData(subjectWiseQuestions);
        localStorage.setItem("testStartTime", new Date().toISOString());
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

  useEffect(()=>{
    if(typeof window !== "undefined") {
      const savedTestName = localStorage.getItem("testName");
      if(savedTestName) setTestName(savedTestName);
    }
  },[])

  const formattedTime = {
    hours: Math.floor(timer / 3600),
    minutes: Math.floor((timer % 3600) / 60),
    seconds: timer % 60,
  };
  
  const handleOptionClick = (index) => {
  if (!questionsData[currentSubject] || !questionsData[currentSubject][currentQuestion]) {
    return;
  }

  // Get current question data
  const currentQData = questionsData[currentSubject][currentQuestion];
  const questionKey = `${currentSubject}-${currentQuestion}`;
  
  // Find correct answer index
  const correctIndex = currentQData.options.findIndex(
    opt => opt === currentQData.correctOption
  );
  
  // Get previous answer if exists
  const previousAnswer = answers[questionKey];
  const currentAnswers = JSON.parse(localStorage.getItem("testAnswers")) || {};

  // Remove previous correct count if existed
  if (previousAnswer !== undefined && previousAnswer === correctIndex) {
    const subjectKey = `${currentSubject.toLowerCase()}_correct`;
    currentAnswers[subjectKey] = Math.max((currentAnswers[subjectKey] || 0) - 1, 0);
  }

  // Update with new answer
  const newAnswers = { ...answers, [questionKey]: index };
  setAnswers(newAnswers);
  
  // Update correct count if new answer is correct
  if (index === correctIndex) {
    const subjectKey = `${currentSubject.toLowerCase()}_correct`;
    currentAnswers[subjectKey] = (currentAnswers[subjectKey] || 0) + 1;
  }

  // Save to localStorage
  currentAnswers[questionKey] = index;
  localStorage.setItem("testAnswers", JSON.stringify(currentAnswers));

  // Update visited questions
  const newVisited = { ...visitedQuestions, [questionKey]: true };
  setVisitedQuestions(newVisited);
  localStorage.setItem("visitedQuestions", JSON.stringify(newVisited));
};
  
  const handleNavigation = (direction) => {
    const currentTime = new Date().getTime();
    const newTimeSpent = {
      ...timeSpent,
      [`${currentSubject}-${currentQuestion}`]: currentTime,
    };
    setTimeSpent(newTimeSpent);
    
    // Save time spent to localStorage
    localStorage.setItem("timeSpent", JSON.stringify(newTimeSpent));
    
    const totalQuestionsInSubject = totalQuestionsBySubject[currentSubject] || 0;
    
    if (direction === "next" && currentQuestion < totalQuestionsInSubject - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === "next" && currentQuestion >= totalQuestionsInSubject - 1) {
      // Move to next subject
      const subjectIndex = subjects.findIndex(s => s.name === currentSubject);
      if (subjectIndex < subjects.length - 1) {
        setCurrentSubject(subjects[subjectIndex + 1].name);
        setCurrentQuestion(0);
      }
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (direction === "prev" && currentQuestion === 0) {
      // Move to previous subject
      const subjectIndex = subjects.findIndex(s => s.name === currentSubject);
      if (subjectIndex > 0) {
        const prevSubject = subjects[subjectIndex - 1].name;
        setCurrentSubject(prevSubject);
        setCurrentQuestion(totalQuestionsBySubject[prevSubject] - 1);
      }
    }
  };
  
  const handleReviewLater = () => {
    setMarkedForReview({
      ...markedForReview,
      [`${currentSubject}-${currentQuestion}`]: true,
    });
    
    // Save marked questions to localStorage
    localStorage.setItem(
      "markedForReview",
      JSON.stringify({
        ...markedForReview,
        [`${currentSubject}-${currentQuestion}`]: true,
      })
    );
    
    handleNavigation("next");
  };

  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[`${currentSubject}-${currentQuestion}`];
    setAnswers(updatedAnswers);
    
    // Update localStorage
    const currentAnswers = JSON.parse(localStorage.getItem("testAnswers")) || {};
    delete currentAnswers[`${currentSubject}-${currentQuestion}`];
    localStorage.setItem("testAnswers", JSON.stringify(currentAnswers));
  };

  const handleSubmit = async () => {
    const confirmSubmit = window.confirm("Are you sure you want to submit your test?");
    if (!confirmSubmit) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Authentication failed! Please log in again.", {
        duration: 5000
      });
      return;
    }
    
    const endTime = new Date().toISOString();
    const startTime = localStorage.getItem("testStartTime") || new Date().toISOString();
    let correctAnswers = [];
    let wrongAnswers = [];
    let notAttempted = [];
    let totalMarks = 0;

    // Process answers by subject
    Object.keys(questionsData).forEach((subject) => {
      questionsData[subject].forEach((question, index) => {
        const selectedOptionIndex = answers[`${subject}-${index}`];
        const selectedOption = question.options[selectedOptionIndex] || null;
        const correctOption = question.options.find(
          (opt) => opt === question.correctOption
        );
        const marks =
          selectedOption === correctOption
            ? 4
            : selectedOption === null
            ? 0
            : -1;

        const questionData = [
          question.id,
          subject,
          question.chapter,
          selectedOption,
          correctOption,
          marks,
          timeSpent[`${subject}-${index}`] || 0,
        ];

        if (selectedOption === null) {
          notAttempted.push([question.id, subject, question.chapter]);
        } else if (selectedOption === correctOption) {
          correctAnswers.push(questionData);
        } else {
          wrongAnswers.push(questionData);
        }

        totalMarks += marks;
      });
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
      }
    } catch (error) {
      toast.error(
        "Error submitting test: " + (error.response?.data?.message || error.message),
        { duration: 5000 }
      );
    }
  };
  
  // Helper functions for stats
  const getAnsweredCountBySubject = (subject) => {
    return Object.keys(answers).filter(key => key.startsWith(`${subject}-`)).length;
  };
  
  const getMarkedCountBySubject = (subject) => {
    return Object.keys(markedForReview).filter(key => key.startsWith(`${subject}-`)).length;
  };
  
  const getVisitedCountBySubject = (subject) => {
    return Object.keys(visitedQuestions).filter(key => key.startsWith(`${subject}-`)).length;
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50">
        <p className="text-center text-red-500 text-xl bg-white p-6 rounded-lg shadow-lg">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Header with Timer */}
      <div className="bg-white shadow-md py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">{testName}</h1>
          
          <div className="flex flex-wrap gap-4 items-center">
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
            
            <div className="text-center bg-gray-50 p-2 rounded-lg">
              <div className="text-sm text-gray-500">Time per question</div>
              <div className="font-bold text-gray-700">1 minute</div>
            </div>
            
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <FaCheck /> Submit Test
            </button>
          </div>
        </div>
      </div>

      {/* Main Content with sidebar at the top for mobile and on the right for desktop */}
      <div className="container mx-auto px-4 py-4 flex flex-col lg:flex-row gap-6">
        {/* Question Side Content */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          {/* Subject Tabs */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">Subject Sections</h2>
            <div className="grid grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.name}
                  className={`px-4 py-3 flex flex-col items-center gap-2 rounded-lg transition-all ${
                    currentSubject === subject.name
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => {
                    setCurrentSubject(subject.name);
                    setCurrentQuestion(0);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {subject.icon}
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {getAnsweredCountBySubject(subject.name)}/{subject.questionCount}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Question Box */}
          <div className="bg-white rounded-lg shadow-lg p-6 select-none">
            <div className="mb-6 flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-medium">
                Question {currentQuestion + 1} of {totalQuestionsBySubject[currentSubject]}
              </span>
              <span className="text-gray-500 flex items-center gap-2">
                {subjects.find(s => s.name === currentSubject)?.icon}
                <span className="font-medium">{currentSubject}</span>
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Question Content */}
              <div className="w-full">
                <h3 className="text-xl font-semibold mb-6">
                  {questionsData[currentSubject]?.[currentQuestion]?.question || 
                    "No question available for this subject yet"}
                </h3>
                
                <div className="space-y-4 mt-6">
                  {questionsData[currentSubject]?.[currentQuestion]?.options.map(
                    (option, index) => (
                      <button
                        key={index}
                        className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                          answers[`${currentSubject}-${currentQuestion}`] === index
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                        onClick={() => handleOptionClick(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                            answers[`${currentSubject}-${currentQuestion}`] === index
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200"
                          }`}>
                            <div className="border-4 border-gray-200 rounded-full"></div>
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    )
                  )}
                </div>
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
        </div>
        
        {/* Right Sidebar: Status & Question Grids */}
        <div className="lg:w-1/3 space-y-4 flex flex-col">
          {/* Test Status - Moved higher up */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Test Overview</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 text-sm">Answered</span>
                  <span className="text-green-700 font-bold">{Object.keys(answers).length}</span>
                </div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 text-sm">Marked</span>
                  <span className="text-purple-700 font-bold">{Object.keys(markedForReview).length}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 text-sm">Total</span>
                  <span className="text-blue-700 font-bold">{totalQuestions}</span>
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-red-700 text-sm">Remaining</span>
                  <span className="text-red-700 font-bold">
                    {totalQuestions - Object.keys(answers).length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Your Progress</div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-2" 
                  style={{ width: `${(Object.keys(answers).length / totalQuestions) * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-sm mt-1">
                {Math.round((Object.keys(answers).length / totalQuestions) * 100)}% Complete
              </div>
            </div>
          </div>
          
          {/* Question Legend - Moved higher up */}
          <div className="bg-white rounded-lg shadow-lg p-4 flex-grow overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{currentSubject} Questions</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {getAnsweredCountBySubject(currentSubject)}/{totalQuestionsBySubject[currentSubject]} answered
                </span>
              </div>
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
            
            {/* Only show current subject question grid */}
            <div className="bg-gray-50 p-3 rounded-lg">
              {/* Question number grid for current subject */}
              <div className="grid grid-cols-9 gap-1">
                {Array.from({ length: totalQuestionsBySubject[currentSubject] }).map((_, index) => (
                  <button
                    key={index}
                    className={`aspect-square flex items-center justify-center text-xs font-medium text-white rounded transition-all ${
                      currentQuestion === index
                        ? "ring-2 ring-blue-300 ring-offset-1"
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
                    onClick={() => {
                      setCurrentQuestion(index);
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;