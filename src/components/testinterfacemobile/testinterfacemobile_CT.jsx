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
  const [lastIndex, setLastIndex] = useState(0);

  const selectedChapters =
    JSON.parse(localStorage.getItem("selectedChapters")) || {};
  const numQuestions = selectedChapters[currentSubject]
    ? Object.values(selectedChapters[currentSubject]).reduce(
        (total, chapter) => total + (Number(chapter.numQuestions) || 0),
        0
      )
    : 0;

  useEffect(() => {
    const storedSubjects = JSON.parse(
      localStorage.getItem("selectedSubjects") || "[]"
    );
    setSelectedSubjects(storedSubjects);

    const fetchQuestions = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/createtest/fetch-questions`,
          {
            selectedSubjects: storedSubjects,
            selectedChapters,
            numQuestions,
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

        // Store the data (chapterId, chapterName, questionIds) in localStorage
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
  }, [numQuestions]);

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

  //useEffect for fixing the numQuestion bug
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
    console.log(totalQuestions);
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

  const [startTime, setStartTime] = useState(new Date());

  const calculateTotalTime = (subject) => {
    const questionTime = JSON.parse(localStorage.getItem("questionTime")) || {};
    let totalTimeInSeconds = 0;

    Object.keys(questionTime).forEach((key) => {
      if (key.startsWith(subject)) {
        totalTimeInSeconds += questionTime[key];
      }
    });

    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = Math.floor(totalTimeInSeconds % 60);

    return { minutes, seconds };
  };

  const handleSubmit = async () => {
    if (!window.confirm("Confirm submit?")) return;

    const testAnswers = JSON.parse(localStorage.getItem("testAnswers")) || [];
    const authToken =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const testName = localStorage.getItem("testName") || [];

    if (!authToken) {
      toast.error("No authentication token found!",{
        duration: 5000
      });
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

    const totalTimePerSubject = {
      Physics: calculateTotalTime("Physics"),
      Chemistry: calculateTotalTime("Chemistry"),
      Biology: calculateTotalTime("Biology"),
    };

    testAnswers.forEach((answerObj) => {
      const { subject, question, selectedAnswer, correctAnswer } = answerObj;

      const chapter = "General"; 
      const questionId = question; 
      const marks = selectedAnswer === correctAnswer ? 4 : -1;

      if (selectedAnswer === correctAnswer) {
        subjectWiseMarks[subject] += 4;
      } else if (selectedAnswer !== null && selectedAnswer !== "") {
        subjectWiseMarks[subject] -= 1;
      }

      const answerPayload = [
        questionId,
        subject,
        chapter,
        selectedAnswer,
        correctAnswer,
        marks,
        "N/A", 
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
          subjectWiseMarks,
          totalTimePerSubject,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.error(response.data.message,{
        duration: 5000
      });
      window.location.href = "/resultCT";
    } catch (error) {
      toast.error("Error submitting test!",{
        duration: 5000
      });
      console.error(error);
    }
  };

  if (loading) return <p className="text-center text-xl">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="text-center py-4">
        <button className="bg-[#49A6CF] text-white font-bold py-2 px-6 rounded-md text-lg cursor-default">
          Mock Test
        </button>
      </div>

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
              {questionsData[currentSubject]?.length > 0 ? (
                <>
                  <h3 className="text-2xl">
                    Q{currentQuestion + 1}.{" "}
                    {questionsData[currentSubject][currentQuestion]?.question ||
                      "No Question Available"}
                  </h3>
                  <div className="mt-6">
                    {questionsData[currentSubject][
                      currentQuestion
                    ]?.options.map((option, index) => (
                      <button
                        key={`${currentSubject}-${currentQuestion}-${index}`}
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
                    ))}
                  </div>
                </>
              ) : (
                <p>Loading questions...</p>
              )}
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

          {/* Status Legend */}
          <div className="mt-6 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#16DBCC] rounded" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FE5C73] rounded" />
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-400 rounded" />
              <span>Not Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#007AFF] rounded" />
              <span>Review Later</span>
            </div>
          </div>

          {/* Question Palette */}
          <div className="mt-6">
            <h3 className="font-bold mb-2">Legend</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {Array.from({ length: numQuestions }).map((_, index) => (
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

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-red-600 text-white text-lg font-bold hover:bg-red-700 transition"
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
