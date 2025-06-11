"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaClock, FaCheck, FaFlask, FaAtom, FaDna } from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "../Loading/Loading";
import { useRouter } from "next/navigation";

const subjects = [
  { name: "Physics", icon: <FaAtom className="text-sm" />, questionCount: 45 },
  { name: "Chemistry", icon: <FaFlask className="text-sm" />, questionCount: 45 },
  { name: "Biology", icon: <FaDna className="text-sm" />, questionCount: 90 },
];

const TestInterfaceMobile = () => {
  const router = useRouter();
  const [questionsData, setQuestionsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSubject, setCurrentSubject] = useState("Physics");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [totalQuestionsBySubject] = useState({ Physics: 45, Chemistry: 45, Biology: 90 });
  const totalQuestions = 180;
  const [timer, setTimer] = useState(totalQuestions * 60);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/question/fetch-questions`);
        const data = res.data;
        const sorted = { Physics: [], Chemistry: [], Biology: [] };
        data.questions.forEach((item) => {
          const subject = item.question.subject;
          sorted[subject]?.push({
            id: item.question.id,
            question: item.question.question_text,
            chapter: item.question.chapter,
            options: item.options.map((o) => o.option_text),
            correctOption: item.options.find((o) => o.is_correct)?.option_text,
          });
        });
        setQuestionsData(sorted);
        setLoading(false);
      } catch (err) {
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
    h: String(Math.floor(timer / 3600)).padStart(2, "0"),
    m: String(Math.floor((timer % 3600) / 60)).padStart(2, "0"),
    s: String(timer % 60).padStart(2, "0"),
  };

  const handleOptionClick = (index) => {
    const key = `${currentSubject}-${currentQuestion}`;
    const newAns = { ...answers, [key]: index };
    setAnswers(newAns);
    setVisitedQuestions({ ...visitedQuestions, [key]: true });
  };

  const handleNavigation = (dir) => {
    const total = totalQuestionsBySubject[currentSubject];
    if (dir === "next") {
      if (currentQuestion < total - 1) setCurrentQuestion(currentQuestion + 1);
    } else {
      if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReviewLater = () => {
    const key = `${currentSubject}-${currentQuestion}`;
    setMarkedForReview({ ...markedForReview, [key]: true });
    handleNavigation("next");
  };

  const handleClearResponse = () => {
    const key = `${currentSubject}-${currentQuestion}`;
    const newAns = { ...answers };
    delete newAns[key];
    setAnswers(newAns);
  };

  const handleSubmit = () => {
    if (window.confirm("Submit test?")) {
      toast.success("Test submitted.");
      router.push("/result");
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  const qData = questionsData[currentSubject]?.[currentQuestion];
  const key = `${currentSubject}-${currentQuestion}`;

  return (
    <div className="lg:hidden">
      {/* Top Nav */}
      <div className="fixed top-0 w-full z-20 bg-white border-b shadow-sm">
        <div className="flex justify-between items-center px-4 py-2 text-sm">
          <span className="font-semibold">{currentSubject} Q{currentQuestion + 1}</span>
          <div className="flex items-center gap-2">
            <FaClock className="text-blue-600" />
            <span className="text-blue-600">{formattedTime.h}:{formattedTime.m}:{formattedTime.s}</span>
          </div>
        </div>
        <div className="flex justify-around pb-2">
          {subjects.map((s) => (
            <button key={s.name} className={`flex flex-col items-center text-xs ${currentSubject === s.name ? "text-blue-600 font-bold" : "text-gray-500"}`} onClick={() => { setCurrentSubject(s.name); setCurrentQuestion(0); }}>{s.icon}<span>{s.name}</span></button>
          ))}
        </div>
      </div>

      {/* Question Section */}
      <div className="mt-24 px-4 pb-32">
        <div className="text-base font-medium mb-4">{qData?.question}</div>
        <div className="space-y-3">
          {qData?.options.map((opt, i) => (
            <button key={i} onClick={() => handleOptionClick(i)} className={`w-full px-4 py-3 rounded-md border text-sm ${answers[key] === i ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300"}`}>{opt}</button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t z-30 flex justify-around py-3 text-sm">
        <button onClick={() => handleNavigation("prev")} className="text-blue-600 font-medium">Prev</button>
        <button onClick={handleReviewLater} className="text-purple-600 font-medium">Review</button>
        <button onClick={handleClearResponse} className="text-yellow-600 font-medium">Clear</button>
        <button onClick={() => handleNavigation("next")} className="text-blue-600 font-medium">Next</button>
      </div>

      <button onClick={handleSubmit} className="fixed bottom-16 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm shadow">Submit</button>
    </div>
  );
};

export default TestInterfaceMobile;
