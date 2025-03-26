"use client";
import React, { useState, useEffect } from "react";
import { TfiTimer } from "react-icons/tfi";
import { FaFlask, FaAtom, FaDna, FaCalculator } from "react-icons/fa"; // Icons
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"; // Arrows
import Image from "next/image"; // Import Next.js Image component
import Link from "next/link";

const subjects = [
  { name: "Maths", icon: <FaCalculator className="text-lg text-blue-500" /> },
  { name: "Physics", icon: <FaAtom className="text-lg text-blue-500" /> },
  { name: "Chemistry", icon: <FaFlask className="text-lg text-green-500" /> },
  { name: "Biology", icon: <FaDna className="text-lg text-red-500" /> },
];

const totalQuestions = 10;
const allQuestions = {
  Maths: Array(10).fill({
    question: "What is the purpose of a loader in an interface?",
    options: ["Improves speed", "Enhances UI", "Shows progress", "Saves memory"],
  }),
  Physics: Array(10).fill({
    question: "What is Newton’s Second Law?",
    options: ["F = ma", "E = mc^2", "V = IR", "P = IV"],
  }),
  Chemistry: Array(10).fill({
    question: "What is Avogadro's number?",
    options: ["6.022x10^23", "1.6x10^-19", "9.81", "3.0x10^8"],
  }),
  Biology: Array(10).fill({
    question: "What is the powerhouse of the cell?",
    options: ["Mitochondria", "Nucleus", "Ribosome", "Golgi apparatus"],
  }),
};

const TestInterfaceMobile = () => {
  const [currentSubject, setCurrentSubject] = useState("Maths");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [timer, setTimer] = useState(10800); // 3 hours countdown

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
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
    setVisitedQuestions({ ...visitedQuestions, [`${currentSubject}-${currentQuestion}`]: true });

    if (markedForReview[`${currentSubject}-${currentQuestion}`]) {
      setMarkedForReview({ ...markedForReview, [`${currentSubject}-${currentQuestion}`]: false });
    }
  };

  const handleNavigation = (direction) => {
    if (direction === "next" && currentQuestion < allQuestions[currentSubject].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
    setVisitedQuestions({ ...visitedQuestions, [`${currentSubject}-${currentQuestion}`]: true });
  };

  const handleReviewLater = () => {
    setMarkedForReview({ ...markedForReview, [`${currentSubject}-${currentQuestion}`]: true });
    handleNavigation("next");
  };

  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[`${currentSubject}-${currentQuestion}`];
    setAnswers(updatedAnswers);
  };

  const getQuestionStatus = (questionIndex) => {
    const key = `${currentSubject}-${questionIndex}`;
    if (answers[key] !== undefined) return "answered"; // Answered
    if (markedForReview[key]) return "review"; // Marked for Review
    if (visitedQuestions[key]) return "unanswered"; // Visited but unanswered
    return "not-visited"; // Not visited
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col px-4 py-4">
      {/* Mock Test Header */}
      <div className="text-center">
        <button className="bg-[#49A6CF] text-white font-bold py-2 px-6 rounded-md text-lg cursor-default">
          Mock Test
        </button>
      </div>

      {/* Subject Tabs */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {subjects.map((subject) => (
          <button
            key={subject.name}
            className={`px-6 py-2 flex items-center justify-center gap-2 rounded-md border ${
              currentSubject === subject.name ? "bg-[#49A6CF] text-white font-bold" : "border-gray-300"
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
        <h3 className="text-lg font-semibold">Q{currentQuestion + 1}. {allQuestions[currentSubject][currentQuestion].question}</h3>
        
        {/* Add the Image Here */}
        <div className="my-4">
          <Image
            src="/question.png" // Path to your image
            alt="Question Image"
            width={300} // Adjust width as needed
            height={200} // Adjust height as needed
            className="rounded-lg"
          />
        </div>

        {/* Options with Highlight */}
        {allQuestions[currentSubject][currentQuestion].options.map((option, index) => (
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
        <button
          className="bg-[#49A6CF] text-white py-2 px-4 rounded-md"
          onClick={handleClearResponse}
        >
          Clear Response
        </button>
        <button
          className="bg-[#49A6CF] text-white py-2 px-4 rounded-md"
          onClick={handleReviewLater}
        >
          Review Later
        </button>
        <button
          className="bg-[#49A6CF] text-white py-2 px-4 rounded-md"
          onClick={() => handleNavigation("prev")}
        >
          Previous
        </button>
        <button
          className="bg-[#49A6CF] text-white py-2 px-4 rounded-md"
          onClick={() => handleNavigation("next")}
        >
          Next
        </button>
      </div>

      {/* Submit Button Centered */}
      <div className="flex justify-center  mt-4">
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
