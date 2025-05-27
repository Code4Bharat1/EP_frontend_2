import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  const { difficulty, numberOfQuestions } = quizSettings;

  const difficultySettings = {
    easy: { timeLimit: 40, color: "emerald", image: "/easy-level-bot.png" },
    medium: { timeLimit: 30, color: "amber", image: "/medium-level-bot.png" },
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
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [botThinking, setBotThinking] = useState(false);
  const timerRef = useRef(null);
  const thinkingRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex] || {};
  const currentAnswer = answers[currentQuestion.id];

  useEffect(() => {
    fetchQuestions();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (thinkingRef.current) clearInterval(thinkingRef.current);
    };
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !quizCompleted) {
      startTimer();
      startBotThinking();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (thinkingRef.current) clearInterval(thinkingRef.current);
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

  const startBotThinking = () => {
    setBotThinking(true);
    setBotPrompt("🤔 Let me think about this question...");
    
    const thinkingPrompts = [
      "🤔 Hmm, analyzing the options...",
      "🧠 Let me process this carefully...",
      "💭 Considering all possibilities...",
      "⚡ Almost got it, just a few more seconds...",
      "🎯 I think I know the answer...",
      "🔍 Double-checking my reasoning...",
      "💡 This is a tricky one!",
      "⏳ Time is ticking, but I'm confident...",
      "🤖 My circuits are working hard on this!",
      "🏃‍♂️ Racing against time here..."
    ];

    let promptIndex = 0;
    thinkingRef.current = setInterval(() => {
      if (promptIndex < thinkingPrompts.length && !showResult) {
        setBotPrompt(thinkingPrompts[promptIndex]);
        promptIndex++;
      } else {
        setBotPrompt("⚡ Ready to answer when time's up!");
      }
    }, 2000 + Math.random() * 2000);
  };

  const stopBotThinking = () => {
    setBotThinking(false);
    if (thinkingRef.current) {
      clearInterval(thinkingRef.current);
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
          stopBotThinking();
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
      handleOptionSelect(currentQuestion.id, correctAnswer, true);
      setBotPrompt("⏱️ Time's up! I got this one for my team. Try to be faster!");
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
      stopBotThinking();
      setShowResult(true);

      const feedbacks = [
        isCorrect
          ? "🎯 Excellent! You beat me to it!"
          : "🤔 Oops! That's a point for me.",
        isCorrect
          ? "🔥 You're quick! Well done!"
          : "😅 I would have gotten that one right!",
        isCorrect
          ? "👏 Nice work! You're getting good at this!"
          : "💡 Better luck on the next question!",
        isCorrect
          ? "⚡ Wow, you're fast! Great job!"
          : "🤖 My answer would have been correct!",
        isCorrect
          ? "🏆 You got it before me this time!"
          : "🎯 I was just about to pick the right one!"
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
    startBotThinking();
    setBotPrompt("🔄 Fresh start! Let's see who gets it first this time.");
  };

  const handleSubmitTest = () => {
    setQuizCompleted(true);
    clearInterval(timerRef.current);
    clearInterval(thinkingRef.current);
    setShowFinalResults(true);
  };

  const calculateResults = () => {
    let studentCorrect = 0;
    let botCorrect = 0;
    let totalAnswered = 0;

    Object.values(answers).forEach((answer) => {
      if (answer.isCorrect) {
        if (answer.isAutoAnswered) {
          botCorrect++;
        } else {
          studentCorrect++;
        }
      }
      totalAnswered++;
    });

    const studentAccuracy = totalAnswered > 0 ? (studentCorrect / Object.keys(answers).length) * 100 : 0;
    const botAccuracy = totalAnswered > 0 ? (botCorrect / Object.keys(answers).length) * 100 : 0;

    return {
      studentCorrect,
      botCorrect,
      totalQuestions: questions.length,
      totalAnswered,
      studentAccuracy: Math.round(studentAccuracy),
      botAccuracy: Math.round(botAccuracy),
      winner: studentCorrect > botCorrect ? 'student' : studentCorrect < botCorrect ? 'bot' : 'tie'
    };
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
    let classes = "flex items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group";
    const correctAnswer = currentQuestion.correctAnswer;
    const selectedOption = currentAnswer?.selectedOption;

    if (showResult) {
      if (opt === correctAnswer) {
        classes += " bg-emerald-50 border-emerald-400 shadow-emerald-100 shadow-lg";
      } else if (opt === selectedOption) {
        classes += " bg-red-50 border-red-400 shadow-red-100 shadow-lg";
      } else {
        classes += " bg-gray-50 border-gray-200";
      }
    } else if (opt === selectedOption) {
      classes += " bg-indigo-50 border-indigo-400 shadow-indigo-100 shadow-lg";
    } else {
      classes += " border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md";
    }

    return classes;
  };

  const getTimerColor = () => {
    if (timeLeft > difficultySettings[difficulty].timeLimit * 0.6) return 'text-emerald-500 bg-emerald-100';
    if (timeLeft > difficultySettings[difficulty].timeLimit * 0.3) return 'text-amber-500 bg-amber-100';
    return 'text-red-500 bg-red-100';
  };

  if (showFinalResults) {
    const results = calculateResults();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Quiz Complete!</h1>
            <p className="text-xl text-slate-600">Let's see how you did against the Bot</p>
          </div>

          {/* Winner Announcement */}
          <div className="bg-white rounded-3xl p-8 mb-8 shadow-xl border border-slate-200">
            <div className="text-center">
              {results.winner === 'student' && (
                <>
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-bold text-emerald-600 mb-2">You Won!</h2>
                  <p className="text-slate-600">Congratulations! You outperformed the Quiz Bot!</p>
                </>
              )}
              {results.winner === 'bot' && (
                <>
                  <div className="text-6xl mb-4">🤖</div>
                  <h2 className="text-3xl font-bold text-red-600 mb-2">Bot Wins!</h2>
                  <p className="text-slate-600">The Quiz Bot got more answers right this time. Try again!</p>
                </>
              )}
              {results.winner === 'tie' && (
                <>
                  <div className="text-6xl mb-4">🤝</div>
                  <h2 className="text-3xl font-bold text-indigo-600 mb-2">It's a Tie!</h2>
                  <p className="text-slate-600">Great match! You and the Bot are evenly matched!</p>
                </>
              )}
            </div>
          </div>

          {/* Score Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Student Score */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Your Score</h3>
                  <p className="text-slate-600">Human Player</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Correct Answers:</span>
                  <span className="text-2xl font-bold text-emerald-600">{results.studentCorrect}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Accuracy:</span>
                  <span className="text-xl font-semibold text-indigo-600">{results.studentAccuracy}%</span>
                </div>
              </div>
            </div>

            {/* Bot Score */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Bot Score</h3>
                  <p className="text-slate-600">AI Assistant</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Correct Answers:</span>
                  <span className="text-2xl font-bold text-emerald-600">{results.botCorrect}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Accuracy:</span>
                  <span className="text-xl font-semibold text-indigo-600">{results.botAccuracy}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Quiz Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl font-bold text-slate-800">{results.totalQuestions}</div>
                <div className="text-sm text-slate-600">Total Questions</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl font-bold text-slate-800">{results.totalAnswered}</div>
                <div className="text-sm text-slate-600">Questions Answered</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl font-bold text-slate-800 capitalize">{difficulty}</div>
                <div className="text-sm text-slate-600">Difficulty Level</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl font-bold text-slate-800">{difficultySettings[difficulty].timeLimit}s</div>
                <div className="text-sm text-slate-600">Time Per Question</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Take Another Quiz
            </button>
            <button
              onClick={() => router.push("/testselection")}
              className="px-8 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br select-none from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Fast Quiz Challenge</h1>
                <p className="text-slate-600 capitalize">
                  {difficulty} Level • {numberOfQuestions} Questions
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Your Progress</div>
              <div className="text-lg font-semibold text-indigo-600">
                {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading questions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {questions.length > 0 && !quizCompleted && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Quiz Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Timer and Progress */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getTimerColor()}`}>
                      {timeLeft}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Time Remaining</div>
                      <div className="text-sm text-slate-600">seconds left</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-slate-600 mb-2">Progress</div>
                    <div className="w-32 bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Question */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                      Question {currentQuestionIndex + 1}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800 leading-relaxed">
                    {currentQuestion.questionText}
                  </h2>
                </div>

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
                        className="mr-4 w-4 h-4 text-indigo-600"
                        checked={currentAnswer?.selectedOption === opt}
                        readOnly
                      />
                      <label htmlFor={`${currentQuestion.id}-${idx}`} className="flex-1 cursor-pointer font-medium">
                        {opt}
                      </label>
                      {showResult && opt === currentQuestion.correctAnswer && (
                        <span className="ml-2 text-emerald-600 text-xl">✓</span>
                      )}
                      {showResult &&
                        currentAnswer?.selectedOption === opt &&
                        opt !== currentQuestion.correctAnswer && (
                          <span className="ml-2 text-red-600 text-xl">✗</span>
                        )}
                      {currentAnswer?.isAutoAnswered &&
                        currentAnswer.selectedOption === opt && (
                          <span className="ml-2 bg-amber-100 text-amber-600 px-2 py-1 rounded-full text-xs font-medium">
                            Bot's Answer
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <div>
                  {currentQuestionIndex > 0 && (
                    <button
                      onClick={() => handleNavigation("prev")}
                      className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-all duration-300"
                    >
                      ← Previous
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() => handleNavigation("next")}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitTest}
                      className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all duration-300 shadow-lg"
                    >
                      🏁 Finish Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bot Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 sticky top-6">
                <div className="text-center mb-4">
                  <img
                    src={difficultySettings[difficulty].image}
                    alt="Quiz Bot"
                    className="w-32 h-32 mx-auto mb-4 object-contain"
                  />
                  <h3 className="font-bold text-slate-800 mb-2">Quiz Bot</h3>
                  <p className="text-sm text-slate-600">Your AI Competitor</p>
                </div>
                
                {botPrompt && (
                  <div className={`border rounded-xl p-4 mb-4 transition-all duration-300 ${
                    botThinking 
                      ? 'bg-amber-50 border-amber-200 animate-pulse' 
                      : showResult 
                        ? 'bg-indigo-50 border-indigo-200' 
                        : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className={`text-center font-medium ${
                      botThinking 
                        ? 'text-amber-700' 
                        : showResult 
                          ? 'text-indigo-700' 
                          : 'text-slate-700'
                    }`}>
                      {botPrompt}
                    </div>
                    {botThinking && (
                      <div className="flex justify-center mt-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Score Tracking */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">👤 Your Score:</span>
                    <span className="font-bold text-emerald-600">
                      {Object.values(answers).filter(a => a.isCorrect && !a.isAutoAnswered).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-600">🤖 Bot Score:</span>
                    <span className="font-bold text-amber-600">
                      {Object.values(answers).filter(a => a.isCorrect && a.isAutoAnswered).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;