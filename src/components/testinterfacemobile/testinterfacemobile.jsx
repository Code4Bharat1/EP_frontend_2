"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFlask, FaAtom, FaDna, FaCalculator } from "react-icons/fa"; // Icons
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"; // Arrows
import Image from "next/image"; // Import Next.js Image component
import Link from "next/link";

// Subject data
const subjects = [
  { name: "Maths", icon: <FaCalculator className="text-lg text-blue-500" /> },
  { name: "Physics", icon: <FaAtom className="text-lg text-blue-500" /> },
  { name: "Chemistry", icon:<FaFlask className="text-lg text-green-500" /> }, 
  { name: "Biology", icon: <FaDna className="text-lg text-red-500" /> },
];

const TestInterfaceMobile = () => {
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [timer, setTimer] = useState(10800); // 3 hours countdown
  const [questionsData, setQuestionsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(""); 

  
  // Fetch questions from API
  useEffect(() => {
    const subjectFromStorage = localStorage.getItem("selectedSubject");
    setCurrentSubject(subjectFromStorage);
    setSelectedSubject(subjectFromStorage); // Default to "Maths" if no subject is selected
  }, []);

  // Fetch questions based on the selected subject
  useEffect(() => {
    if (selectedSubject) {
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
            Maths: [],
          };

          // Filter questions based on the selected subject
          data.questions.forEach((item) => {
            const subject = item.question.subject;
            if (subject === selectedSubject) {
              subjectWiseQuestions[subject]?.push({
                id: item.question.id,
                question: item.question.question_text,
                options: item.options.map((opt) => opt.option_text),
                correctOption: item.options.find((opt) => opt.is_correct)?.option_text,
              });
            }
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
    }
  }, [selectedSubject]);

  // Countdown timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Format time for display
  const formattedTime = {
    hours: Math.floor(timer / 3600),
    minutes: Math.floor((timer % 3600) / 60),
    seconds: timer % 60,
  };

  // Handle answer selection
  const handleOptionClick = (index) => {
    setAnswers({ ...answers, [`${currentSubject}-${currentQuestion}`]: index });
    setVisitedQuestions({
      ...visitedQuestions,
      [`${currentSubject}-${currentQuestion}`]: true,
    });

    if (markedForReview[`${currentSubject}-${currentQuestion}`]) {
      setMarkedForReview({ ...markedForReview, [`${currentSubject}-${currentQuestion}`]: false });
    }
  };

  // Handle navigation between questions
  const handleNavigation = (direction) => {
    if (direction === "next" && currentQuestion < questionsData[currentSubject].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
    setVisitedQuestions({ ...visitedQuestions, [`${currentSubject}-${currentQuestion}`]: true });
  };

  // Mark question for review
  const handleReviewLater = () => {
    setMarkedForReview({ ...markedForReview, [`${currentSubject}-${currentQuestion}`]: true });
    handleNavigation("next");
  };

  // Clear answer for current question
  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[`${currentSubject}-${currentQuestion}`];
    setAnswers(updatedAnswers);
  };

  // Get question status (answered, unanswered, review, etc.)
  const getQuestionStatus = (questionIndex) => {
    const key = `${currentSubject}-${questionIndex}`;
    if (answers[key] !== undefined) return "answered"; // Answered
    if (markedForReview[key]) return "review"; // Marked for Review
    if (visitedQuestions[key]) return "unanswered"; // Visited but unanswered
    return "not-visited"; // Not visited
  };

  // Submit the test
  const handleSubmit = async () => {
    const confirmSubmit = window.confirm("Confirm submit?");
    if (!confirmSubmit) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Authentication failed! Please log in again.");
      return;
    }

    const endTime = new Date().toISOString();
    const startTime = localStorage.getItem("testStartTime") || new Date().toISOString();
    let correctAnswers = [];
    let wrongAnswers = [];
    let notAttempted = [];
    let totalMarks = 0;

    // Process all answers to categorize them properly
    Object.keys(questionsData).forEach((subject) => {
      questionsData[subject].forEach((question, index) => {
        const selectedOptionIndex = answers[`${subject}-${index}`];
        const selectedOption = question.options[selectedOptionIndex] || null;
        const correctOption = question.options.find((opt) => opt === question.correctOption);
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
          0, // Time spent can be calculated if tracked
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
        localStorage.removeItem("selectedSubject");
        window.location.href = "/result";
      } else {
        alert("Failed to submit test.");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert(`Error: ${error.response?.data?.error || "Something went wrong"}`);
    }
  };

  // Show loading screen if questions are still being fetched
  if (loading) return <p className="text-center text-xl">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col px-4 py-4">
      <div className="text-center py-4">
        <button className="bg-[#49A6CF] text-white font-bold py-2 px-6 rounded-md text-lg cursor-default">
          Mock Test
        </button>
      </div>

      {/* Subject Tabs */}
      <div className="flex justify-center items-center">
        {subjects.map((subject) => (
          currentSubject === subject.name && (
            <button
              key={subject.name}
              className={`px-6 py-2 flex items-center gap-2 rounded-md border ${
                currentSubject === subject.name
                  ? "border-blue-500 text-blue-600 font-bold"
                  : "border-gray-300"
              }`}
              onClick={() => setCurrentSubject(subject.name)}
            >
              {subject.icon} {subject.name}
            </button>
          )
        ))}
      </div>

      {/* Time Left Section */}
      <hr className="border-t border-gray-300 my-4 w-full" />
      <div className="text-center mt-1 flex justify-center items-center gap-4">
        <h3 className="font-bold text-sm">Time Left</h3>
        <div className="mt-0 flex gap-4 text-lg">
          <div className="bg-black text-white px-2 py-2 rounded-lg">{formattedTime.hours} HRS</div>
          <div className="bg-black text-white px-2 py-2 rounded-lg">{formattedTime.minutes} MIN</div>
          <div className="bg-black text-white px-2 py-2 rounded-lg">{formattedTime.seconds} SEC</div>
        </div>
      </div>
      <hr className="border-t border-gray-300 my-2" />

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-2 text-center mt-2">
        <div className="flex items-center gap-2">
          <div className="bg-[#16DBCC] w-6 h-6 rounded"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#FE5C73] w-6 h-6 rounded"></div>
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#F1C40F] w-6 h-6 rounded"></div>
          <span>Not Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#007AFF] w-6 h-6 rounded"></div>
          <span>Review</span>
        </div>
      </div>

      {/* Question Number Navigation */}
      <div className="flex justify-between items-center mt-4">
        <IoIosArrowBack className="text-2xl cursor-pointer" onClick={() => handleNavigation("prev")} />
        {[...Array(10)].map((_, index) => {
          const status = getQuestionStatus(index);
          const bgColor = {
            answered: "bg-[#16DBCC]",
            unanswered: "bg-[#FE5C73]",
            "not-visited": "bg-[#F1C40F]",
            review: "bg-[#007AFF]",
          }[status];
          return (
            <button
              key={index}
              className={`w-8 h-8 border rounded-md text-center text-white ${bgColor}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          );
        })}
        <IoIosArrowForward className="text-2xl cursor-pointer" onClick={() => handleNavigation("next")} />
      </div>

      {/* Question and Options Section */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Q{currentQuestion + 1}. {questionsData[currentSubject]?.[currentQuestion]?.question || "No Question Available"}</h3>
        <div className="my-4">
          <Image
            src="/question.png"
            alt="Question Image"
            width={300}
            height={200}
            className="rounded-lg"
          />
        </div>

        {/* Options with Highlight */}
        {questionsData[currentSubject]?.[currentQuestion]?.options.map((option, index) => (
          <button
            key={index}
            className={`block w-full text-left px-4 py-2 border rounded-md mt-2 ${
              answers[`${currentSubject}-${currentQuestion}`] === index
                ? "bg-[#49A6CF] text-white border-blue-500"
                : "border-gray-300"
            }`}
            onClick={() => handleOptionClick(index)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button className="bg-[#49A6CF] text-white py-2 px-4 rounded-md" onClick={handleClearResponse}>
          Clear Response
        </button>
        <button className="bg-[#49A6CF] text-white py-2 px-4 rounded-md" onClick={handleReviewLater}>
          Review Later
        </button>
        <button className="bg-[#49A6CF] text-white py-2 px-4 rounded-md" onClick={() => handleNavigation("prev")}>
          Previous
        </button>
        <button className="bg-[#49A6CF] text-white py-2 px-4 rounded-md" onClick={() => handleNavigation("next")}>
          Next
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <Link href="/result">
          <button className="bg-[#e51d1d] text-white py-2 px-5 rounded-sm font-bold text-lg">
            Submit Test
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TestInterfaceMobile;
