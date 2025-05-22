import { useState, useEffect, useRef } from "react";
import axios from "axios";

const QuizInterface = () => {
  const quizSettings = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem("fastquiz"));
      return {
        difficulty: stored?.difficultyLevel || "medium",
        numberOfQuestions: stored?.numberOfQuestions || 10,
      };
    } catch (err) {
      return { difficulty: "medium", numberOfQuestions: 10 };
    }
  })();

  const { difficulty, numberOfQuestions } = quizSettings;

  const difficultySettings = {
    easy: { timeLimit: 40, color: "green", image: "/easy-level-bot.png" },
    medium: { timeLimit: 30, color: "blue", image: "/medium-level-bot.png" },
    hard: { timeLimit: 20, color: "red", image: "/hard-level-bot.png" },
  };

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(difficultySettings[difficulty].timeLimit);
  const [showResult, setShowResult] = useState(false);
  const [botPrompt, setBotPrompt] = useState("");
  const timerRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex] || {};
  const currentAnswer = answers[currentQuestion.id];

  useEffect(() => {
    fetchQuestions();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      startTimer();
      setBotPrompt("");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, questions]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/questions`, {
        numberOfQuestions,
        difficulty,
      });
      setQuestions(res.data.questions);
    } catch (err) {
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimeLeft(difficultySettings[difficulty].timeLimit);
    setShowResult(false);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          autoAnswerQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const autoAnswerQuestion = () => {
    if (currentAnswer === undefined) {
      const correctAnswer = currentQuestion.correctAnswer;
      const options = parseQuestionOptions(currentQuestion.questionOption);
      const correctIndex = options.indexOf(correctAnswer);
      handleOptionSelect(currentQuestion.id, correctAnswer, true);
      setBotPrompt("⏱️ Time's up! I picked the right answer for you. Beat me next time!");
    }
    setShowResult(true);
  };

  const handleOptionSelect = (questionId, selectedOption, isAutoAnswered = false) => {
    const correctAnswer = questions.find((q) => q.id === questionId)?.correctAnswer;
    const isCorrect = selectedOption === correctAnswer;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOption,
        isAutoAnswered,
        isCorrect,
      },
    }));

    if (!isAutoAnswered) {
      clearInterval(timerRef.current);
      setShowResult(true);

      const feedbacks = [
        isCorrect
          ? "🎯 Nice! You got it right."
          : "🤔 Oops! That wasn't it.",
        isCorrect
          ? "🔥 You're on fire!"
          : "😅 Try harder on the next one!",
        isCorrect
          ? "👏 Great pick!"
          : "💡 Better luck next time!",
      ];
      setBotPrompt(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
    }
  };

  const handleNavigation = (direction) => {
    if (direction === "next" && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleClearResponse = () => {
    const updatedAnswers = { ...answers };
    delete updatedAnswers[currentQuestion.id];
    setAnswers(updatedAnswers);
    setShowResult(false);
    startTimer();
    setBotPrompt("🔄 Cleared your response. Ready for another try?");
  };

  const parseQuestionOptions = (optionsString) => {
    try {
      const parsed = JSON.parse(optionsString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return optionsString.split(",").map((opt) => opt.trim());
    }
  };

  const getOptionClasses = (opt) => {
    let classes = "flex items-center p-3 rounded-lg border-2 transition-all";
    const correctAnswer = currentQuestion.correctAnswer;
    const selectedOption = currentAnswer?.selectedOption;

    if (showResult) {
      if (opt === correctAnswer) {
        classes += " bg-green-100 border-green-500";
      } else if (opt === selectedOption) {
        classes += " bg-red-100 border-red-500";
      }
    } else if (opt === selectedOption) {
      classes += " bg-blue-100 border-blue-500";
    } else {
      classes += " border-gray-200 hover:border-gray-400";
    }

    return classes;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Fast Quiz Test ({difficulty})</h1>

      {loading && <p>Loading questions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {questions.length > 0 && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side: Main Quiz Content */}
          <div className="flex-1 space-y-6">
            {/* Timer and Progress */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-${difficultySettings[difficulty].color}-500`}
                >
                  {timeLeft}
                </div>
                <span className="text-sm">seconds remaining</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${difficultySettings[difficulty].color}-600 h-2 rounded-full`}
                    style={{
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Current Question */}
            <div key={currentQuestion.id} className="border p-6 rounded-lg shadow">
              <h2 className="font-semibold text-lg mb-4">
                {currentQuestionIndex + 1}. {currentQuestion.questionText}
              </h2>

              <div className="space-y-3">
                {parseQuestionOptions(currentQuestion.questionOption).map((opt, idx) => (
                  <div
                    key={idx}
                    className={getOptionClasses(opt)}
                    onClick={() => !showResult && handleOptionSelect(currentQuestion.id, opt)}
                  >
                    <input
                      type="radio"
                      id={`${currentQuestion.id}-${idx}`}
                      name={`question-${currentQuestion.id}`}
                      className="mr-3"
                      checked={currentAnswer?.selectedOption === opt}
                      readOnly
                    />
                    <label htmlFor={`${currentQuestion.id}-${idx}`} className="flex-1 cursor-pointer">
                      {opt}
                    </label>
                    {showResult && opt === currentQuestion.correctAnswer && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                    {showResult &&
                      currentAnswer?.selectedOption === opt &&
                      opt !== currentQuestion.correctAnswer && (
                        <span className="ml-2 text-red-600">✗</span>
                      )}
                    {currentAnswer?.isAutoAnswered &&
                      currentAnswer.selectedOption === opt && (
                        <span className="ml-2 text-gray-500 text-xs">(Auto)</span>
                      )}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <div>
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={() => handleNavigation("prev")}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleClearResponse}
                  className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  disabled={showResult}
                >
                  Clear Response
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={() => handleNavigation("next")}
                    className={`px-6 py-2 ${
                      showResult ? "bg-purple-600" : "bg-blue-600"
                    } text-white rounded hover:bg-blue-700 transition`}
                  >
                    {showResult ? "Continue" : "Next"}
                  </button>
                ) : (
                  <button
                    onClick={() => alert("Test completed!")}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Bot Prompt */}
          <div className="w-full md:w-1/3 border rounded-lg p-4 bg-gray-50 shadow-md">
            <img
              src={difficultySettings[difficulty].image}
              alt="Quiz Bot"
              className="w-32 h-32 mx-auto mb-4 object-contain"
            />
            {botPrompt && (
              <div className="text-center text-blue-700 italic">{botPrompt}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizInterface;
