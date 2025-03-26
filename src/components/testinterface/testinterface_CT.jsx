"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaFlask, FaAtom, FaDna } from "react-icons/fa";
import { TfiTimer } from "react-icons/tfi";

const subjects = [
  { name: "Physics", icon: <FaAtom className="text-lg text-blue-500" /> },
  { name: "Chemistry", icon: <FaFlask className="text-lg text-green-500" /> },
  { name: "Biology", icon: <FaDna className="text-lg text-red-500" /> },
];

const TestInterface = () => {
  const [questionsData, setQuestionsData] = useState({}); // stores all questions per subject
  const [currentSubject, setCurrentSubject] = useState("Physics");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [timer, setTimer] = useState(10800); // 3 hours in seconds
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetching questions from localStorage
  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("testQuestions"));
    if (storedQuestions && storedQuestions.length > 0) {
      // Organize questions by subjects and chapters
      const subjectWiseQuestions = {
        Physics: [],
        Chemistry: [],
        Biology: [],
      };

      storedQuestions.forEach((item) => {
        const subject = item.subject;
        subjectWiseQuestions[subject]?.push({
          id: item.question.id,
          question: item.question.question_text,
          options: item.options.map((opt) => opt.option_text),
        });
      });

      setQuestionsData(subjectWiseQuestions);
      setLoading(false);
    } else {
      alert("No test questions found. Please generate the test again.");
      router.push("/preview");
    }

    // Start the countdown timer
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

  const handleOptionClick = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [`${currentSubject}-${questionId}`]: optionId,
    });
    setVisitedQuestions({
      ...visitedQuestions,
      [`${currentSubject}-${questionId}`]: true,
    });
  };

  const handleNavigation = (direction) => {
    const totalQuestions = questionsData[currentSubject]?.length || 0;
    if (direction === "next" && currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReviewLater = () => {
    const questionId = questionsData[currentSubject][currentQuestionIndex].id;
    setMarkedForReview({
      ...markedForReview,
      [`${currentSubject}-${questionId}`]: true,
    });
    handleNavigation("next");
  };

  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[`${currentSubject}-${currentQuestionIndex}`];
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
      localStorage.getItem("testStartTime") || new Date().toISOString();
    let correctAnswers = [];
    let wrongAnswers = [];
    let notAttempted = [];
    let totalMarks = 0;

    // Process all answers
    Object.values(questionsData).forEach((subjectQuestions) => {
      subjectQuestions.forEach((question) => {
        const selectedOptionIndex = answers[`${currentSubject}-${question.id}`];
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
          currentSubject,
          question.chapter,
          selectedOption,
          correctOption,
          marks,
          0,
        ];

        if (selectedOption === null) {
          notAttempted.push([question.id, currentSubject, question.chapter]);
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
      console.error("Error submitting test:", error);
      alert("Error submitting test. Please try again.");
    }
  };

  if (loading)
    return <p className="text-center text-xl">Loading questions...</p>;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  const currentQuestion = questionsData[currentSubject]?.[currentQuestionIndex];

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      {/* Test Header */}
      <div className="text-center py-4">
        <button className="bg-[#49A6CF] text-white font-bold py-2 px-6 rounded-md text-lg cursor-default">
          {currentSubject} Created Test
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
                setCurrentQuestionIndex(0);
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
                Q{currentQuestionIndex + 1}:{" "}
                {currentQuestion?.question || "No Question Available"}
              </h3>

              <div className="mt-6">
                {currentQuestion?.options?.map((option, index) => (
                  <button
                    key={index}
                    className={`block w-2/3 text-left px-6 py-3 rounded-lg border text-lg mb-3 ${
                      answers[`${currentSubject}-${currentQuestionIndex}`] ===
                      index
                        ? "bg-[#0077B6] text-white"
                        : "bg-white"
                    }`}
                    onClick={() => handleOptionClick(currentQuestion.id, index)}
                  >
                    {option}
                  </button>
                ))}
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
                  className={`w-10 h-10 flex items-center justify-center text-white rounded transition duration-300 ${
                    currentQuestion === index
                      ? "bg-[#003366]" // Darker shade for selected question
                      : markedForReview[`${currentSubject}-${index}`]
                      ? "bg-red-500"
                      : answers[`${currentSubject}-${index}`] !== undefined
                      ? "bg-green-500"
                      : visitedQuestions[`${currentSubject}-${index}`]
                      ? "bg-[#FE5C73]"
                      : "bg-gray-400"
                  }`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
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
  );
};

export default TestInterface;
