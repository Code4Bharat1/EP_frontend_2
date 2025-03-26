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
  const [questionsData, setQuestionsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubject, setCurrentSubject] = useState("Physics");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timer, setTimer] = useState(10800);
  
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

  const formattedTime = {
    hours: Math.floor(timer / 3600),
    minutes: Math.floor((timer % 3600) / 60),
    seconds: timer % 60,
  };
  const handleOptionClick = (index) => {
    setAnswers({ ...answers, [`${currentSubject}-${currentQuestion}`]: index });
    setVisitedQuestions({
      ...visitedQuestions,
      [`${currentSubject}-${currentQuestion}`]: true,
    });
  };
  const [timeSpent, setTimeSpent] = useState({});
  const handleNavigation = (direction) => {
    const currentTime = new Date().getTime();
    setTimeSpent({
      ...timeSpent,
      [`${currentSubject}-${currentQuestion}`]: currentTime,
    });
    const totalQuestions = questionsData[currentSubject]?.length || 0;
    if (direction === "next" && currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
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
  };

  const handleSubmit = async () => {
    const confirmSubmit = window.confirm("Confirm submit?");
    if (!confirmSubmit) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication failed! Please log in again.");
      return;
    }
    const endTime = new Date().toISOString();
    const startTime =
      localStorage.getItem("testStartTime") || new Date().toISOString(); // ✅ Assuming start time is saved when the test starts.
    let correctAnswers = [];
    let wrongAnswers = [];
    let notAttempted = [];
    let totalMarks = 0;

    // ✅ Process all answers to categorize them properly
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
          0, // ✅ Time spent can be calculated if tracked
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
        alert("Test submitted successfully!");
        window.location.href = "/result";
      } else {
        alert("Failed to submit test.");
      }
    } catch (error) {
      console.error(
        "❌ Error submitting test:",
        error.response?.data || error.message
      );
      alert(`Error: ${error.response?.data?.error || "Something went wrong"}`);
    }
  };

  if (loading)
    return <p className="text-center text-xl">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      {/* Mock Test Header */}
      <div className="text-center py-4">
        <button className="bg-[#49A6CF] text-white font-bold py-2 px-6 rounded-md text-lg cursor-default">
          Mock Test
        </button>
      </div>

      {/* Subject Tabs */}
      <div className="flex flex-col">
        <div className="flex justify-center gap-6">
          {subjects.map((subject) => (
            <button
              key={subject.name}
              className={`px-6 py-2 flex items-center gap-2 rounded-md border ${
                currentSubject === subject.name
                  ? "border-blue-500 text-blue-600 font-bold"
                  : "border-gray-300"
              }`}
              onClick={() => {
                setCurrentSubject(subject.name);
                setCurrentQuestion(0);
              }}
            >
              {subject.icon} {subject.name} Section
            </button>
          ))}
        </div>
        <hr className="border-t border-gray-200 mt-4" />
      </div>

      {/* Main Content */}
      <div className="flex flex-grow mt-6 px-8">
        {/* Left Section: Questions & Options */}
        <div className="w-2/3 bg-white p-8 rounded-lg shadow-md flex flex-col gap-8">
          <div className="flex items-center gap-8">
            {/* Question Image */}
            <div className="w-1/3 flex justify-center items-center">
              <img
                src="/question.png"
                alt="Question"
                className="w-full max-w-[400px] object-contain"
              />
            </div>

            {/* Question & Options */}
            <div className="w-3/5">
              <h3 className="text-2xl">
                Q{currentQuestion + 1}.{" "}
                {questionsData[currentSubject]?.[currentQuestion]?.question ||
                  "No Question Available"}
              </h3>

              <div className="mt-6">
                {questionsData[currentSubject]?.[currentQuestion]?.options.map(
                  (option, index) => (
                    <button
                      key={index}
                      className={`block w-2/3 text-left px-6 py-3 rounded-lg border text-lg font- mb-3 ${
                        answers[`${currentSubject}-${currentQuestion}`] ===
                        index
                          ? "bg-[#0077B6] text-white"
                          : "bg-white"
                      }`}
                      onClick={() => handleOptionClick(index)}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-center gap-6">
            <button
              onClick={handleClearResponse}
              className="px-8 py-3 rounded-lg bg-[#49A6CF] text-white text-lg font-semibold"
            >
              Clear Response
            </button>
            <button
              onClick={handleReviewLater}
              className="px-8 py-3 rounded-lg bg-[#49A6CF] text-white text-lg font-semibold"
            >
              Review Later
            </button>
            <button
              onClick={() => handleNavigation("prev")}
              className="px-8 py-3 rounded-lg bg-[#49A6CF] text-white text-lg font-semibold"
            >
              Previous
            </button>
            <button
              onClick={() => handleNavigation("next")}
              className="px-8 py-3 rounded-lg bg-[#49A6CF] text-white text-lg font-semibold"
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Sidebar: Timer & Legend */}
        <div className="w-1/3 p-6">
          {/* Timer */}
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

          {/* Boxes section */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#16DBCC] rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FE5C73] rounded"></div>
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-400 rounded"></div>
              <span>Not Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#007AFF] rounded"></div>
              <span>Review Left</span>
            </div>
          </div>

          {/* Legend & Question Number Boxes */}
          <div className="mt-6">
            <h3 className="font-bold mb-2">Legend</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {questionsData[currentSubject]?.map((_, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 flex items-center justify-center text-white rounded ${
                    markedForReview[`${currentSubject}-${index}`]
                      ? "bg-[#007AFF]"
                      : answers[`${currentSubject}-${index}`] !== undefined
                      ? "bg-[#16DBCC]"
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

            {/* Instructions for Mandatory Marking Scheme */}
            <div className="mt-6 text-center text-lg font-semibold">
              All the questions in this section are Mandatory. Marking scheme
              for this section:
            </div>

            {/* Submit Test Button */}
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
    </div>
  );
};

export default TestInterface;
