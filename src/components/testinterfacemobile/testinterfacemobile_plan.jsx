"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFlask, FaAtom, FaDna } from "react-icons/fa";
import toast from "react-hot-toast";

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
  const [timer, setTimer] = useState(10800);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [allocatedQuestions, setAllocatedQuestions] = useState(0);

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
      if (allocatedQuestions > 0) {
        setLastIndex(allocatedQuestions);
      }

      const filteredSubject = subjects.filter(
        (subject) => subject.name === startTestData.subject
      );
      setSelectedSubjects(filteredSubject);
    }
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
        setCurrentQuestion(currentQuestion + 1); // Go to the next question
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
  };

  const handleSubmit = async () => {
    const confirmSubmit = window.confirm("Confirm submit?");
    if (!confirmSubmit) return;

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Authentication failed! Please log in again.",{
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
        toast.success("Test submitted successfully!",{
          duration: 5000
        });
        window.location.href = "/result";
      } else {
        toast.error("Failed to submit test.",{
          duration: 5000
        });
      }
    } catch (error) {
      console.error("❌ Error submitting test:", error.response?.data || error.message);
      toast.error(`Error: ${error.response?.data?.error || "Something went wrong"}`,{
        duration: 5000
      });
    }
  };

  if (loading)
    return <p className="text-center text-xl">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      <div className="text-center py-4">
        <button className="bg-[#49A6CF] text-white font-bold py-2 px-6 rounded-md text-lg cursor-default">
          Mock Test
        </button>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-center gap-6">
          {selectedSubjects.map((subject) => (
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

      <div className="flex flex-grow mt-6 px-8">
        <div className="w-2/3 bg-white p-8 rounded-lg shadow-md flex flex-col gap-8">
          <div className="flex items-center gap-8">
            <div className="w-1/3 flex justify-center items-center">
              <img
                src="/question.png"
                alt="Question"
                className="w-full max-w-[400px] object-contain"
              />
            </div>

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

          <div className="mt-6">
            <h3 className="font-bold mb-2">Legend</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {Array.from({ length: allocatedQuestions }).map((_, index) => (
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

export default TestInterfaceMobile;
