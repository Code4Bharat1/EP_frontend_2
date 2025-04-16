"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TfiTimer } from "react-icons/tfi";
import { FaFlask, FaAtom, FaDna } from "react-icons/fa";

const subjects = [
  { name: "Physics", icon: <FaAtom className="text-lg text-blue-500" /> },
  { name: "Chemistry", icon: <FaFlask className="text-lg text-green-500" /> },
  { name: "Biology", icon: <FaDna className="text-lg text-red-500" /> },
];

const TestInterface = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [questionsData, setQuestionsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubject, setCurrentSubject] = useState("Physics");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timer, setTimer] = useState(10800);
  const [startTime, setStartTime] = useState(new Date());

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


  //chapters from the controller for the respective testid
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
  
        if (!testDetails || !testDetails.topic_name) {
          console.warn("No topic_name found in test details");
          return;
        }
  
        // ✅ Save the topic_name directly
        localStorage.setItem("selectedChapters", JSON.stringify(testDetails.topic_name));
        console.log("selectedChapters saved:", testDetails.topic_name);
  
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };
  
    fetchChapterNames();
  }, []);
    

  const formattedTime = {
    hours: Math.floor(timer / 3600),
    minutes: Math.floor((timer % 3600) / 60),
    seconds: timer % 60,
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
  
    // ✅ Always add to the log
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
      timestamp: currentTime.toISOString(), // optional: track exact time
    };
  
    // ✅ Always push (no overwrite)
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
  
    const savedTimeForCurrentQuestion =
      previousTime[`${currentSubject}-${currentQuestion}`];
    const newStartTime = savedTimeForCurrentQuestion
      ? new Date(new Date() - savedTimeForCurrentQuestion * 1000)
      : currentTime;
  
    setStartTime(newStartTime);
  };
      
  
  const handleNavigation = (direction) => {
    const totalQuestions = numQuestions;
    if (direction === "next" && currentQuestion >= totalQuestions - 1) {
      const currentSubjectIndex = selectedSubjects.indexOf(currentSubject);
      const nextSubjectIndex =
        (currentSubjectIndex + 1) % selectedSubjects.length;
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
      [`${currentSubject}-${currentQuestion}`]: true,
    });
    handleNavigation("next");
  };

  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[`${currentSubject}-${currentQuestion}`];
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      const testAnswers = JSON.parse(localStorage.getItem("testAnswers")) || [];
      const selectedChapters = JSON.parse(localStorage.getItem("selectedChapters")) || [];
      const testid = localStorage.getItem("testid");
      const testname = localStorage.getItem("testName");
  
      // Decode JWT to get studentId
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");
  
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(atob(base64));
      const studentId = decodedToken?.id || decodedToken?.studentId;
      if (!studentId) throw new Error("Student ID not found in token");
  
      // Get total questions (should be saved earlier in localStorage)
      const totalquestions = parseInt(localStorage.getItem("totalQuestions")) || testAnswers.length;
  
      const correctAnswers = testAnswers.filter(a => a.isCorrect).length;
      const incorrectAnswers = testAnswers.filter(a => !a.isCorrect && a.selectedAnswer !== null).length;
      const attempted = correctAnswers + incorrectAnswers;
      const unattempted = totalquestions - attempted;
  
      const score = (correctAnswers * 4) - incorrectAnswers;
      const overallmarks = totalquestions * 4;
  
      // Simplified answers for backend
      const simplifiedAnswers = testAnswers.map((ans) => ({
        subject: ans.subject,
        question: ans.question,
        correctAnswer: ans.correctAnswer,
      }));
  
      // Subject-wise marks calculation
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
  
      // Final payload to backend
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
  
      // Send to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/newadmin/save-test`,
        payload
      );
  
      console.log("Test result submitted:", response.data);
      alert("Test submitted and saved!");
      
      // Optional: clear saved answers or redirect
      // localStorage.removeItem("testAnswers");
      // localStorage.removeItem("questionTime");
  
    } catch (error) {
      console.error("Error submitting test result:", error);
      alert("Failed to submit test. Please try again.");
    }
  };
    
  

  if (loading) return <p className="text-center text-xl">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      {/* Subject Tabs */}
      <div className="w-full p-4 bg-transparent">
        <h1 className="text-2xl font-bold mb-4 text-center">Selected Subjects</h1>
        <div className="flex justify-center gap-6">
          {selectedSubjects.length > 0 ? (
            selectedSubjects.map((subject, index) => (
              <button
                key={index}
                className={`px-6 py-2 flex items-center gap-2 rounded-md border ${
                  currentSubject === subject
                    ? "border-blue-500 text-blue-600 font-bold"
                    : "border-gray-300"
                }`}
                onClick={() => {
                  setCurrentSubject(subject);
                  setCurrentQuestion(0);
                }}
              >
                {subjects.find((s) => s.name === subject)?.icon}
                {subject} Section
              </button>
            ))
          ) : (
            <p className="text-gray-500">No subjects selected</p>
          )}
        </div>
        <hr className="border-t border-gray-200 mt-4" />
      </div>

      {/* Main Content */}
      <div className="flex flex-grow mt-6 px-8">
        {/* Left Section */}
        <div className="w-2/3 bg-white p-8 rounded-lg shadow-md flex flex-col gap-8">
          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <img src="/question.png" alt="Question" className="w-full max-w-[400px] object-contain" />
            </div>
            <div className="w-2/3">
              <h3 className="text-2xl mb-4">
                Q{currentQuestion + 1}. {questionsData[currentSubject]?.[currentQuestion]?.question || "No Question Available"}
              </h3>
              <div className="space-y-4">
                {questionsData[currentSubject]?.[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={`${currentSubject}-${currentQuestion}-${index}`}
                    className={`block w-full text-left px-6 py-3 rounded-lg border text-lg font- mb-3 ${
                      answers[`${currentSubject}-${currentQuestion}`] === index
                        ? "bg-[#0077B6] text-white"
                        : "bg-white"
                    }`}
                    onClick={() => handleOptionClick(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-6">
            <button onClick={handleClearResponse} className="px-8 py-3 rounded-lg bg-yellow-500 text-white text-lg font-semibold">
              Clear Response
            </button>
            <button onClick={handleReviewLater} className="px-8 py-3 rounded-lg bg-purple-500 text-white text-lg font-semibold">
              Review Later
            </button>
            <button onClick={() => handleNavigation("prev")} className="px-8 py-3 rounded-lg bg-[#49A6CF] text-white text-lg font-semibold">
              Previous
            </button>
            <button onClick={() => handleNavigation("next")} className="px-8 py-3 rounded-lg bg-[#49A6CF] text-white text-lg font-semibold">
              Next
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3 p-6">
          <div className="text-center">
            <h3 className="font-bold text-lg">Time Left</h3>
            <div className="mt-4 flex justify-center gap-4 text-lg">
              <div className="bg-black text-white px-4 py-2 rounded-lg">
                {formattedTime.hours} HRS
              </div>
              <div className="bg-black text-white px-4 py-2 rounded-lg">
                {formattedTime.minutes} MIN
              </div>
              <div className="bg-black text-white px-4 py-2 rounded-lg">
                {formattedTime.seconds} SEC
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-2">Legend</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {questionsData[currentSubject]?.map((_, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 flex items-center justify-center text-white rounded transition duration-300 ${
                    currentQuestion === index
                      ? "bg-[#003366]"
                      : markedForReview[`${currentSubject}-${index}`]
                      ? "bg-red-500"
                      : answers[`${currentSubject}-${index}`] !== undefined
                      ? "bg-green-500"
                      : visitedQuestions[`${currentSubject}-${index}`]
                      ? "bg-[#FE5C73]"
                      : "bg-gray-400"
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-red-600 text-white text-lg font-bold hover:bg-red-700 transition"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
