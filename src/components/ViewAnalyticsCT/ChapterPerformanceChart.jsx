"use client";

import { useState, useEffect } from "react";
import { FaFlask, FaAtom, FaDna } from "react-icons/fa"; // Icons for subjects
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChapterPerformanceChart = () => {
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [chartData, setChartData] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [skipped, setSkipped] = useState(0);

  // Icons and background colors for subjects
  const subjectMapping = {
    Physics: {
      icon: <FaAtom className="text-red-500 text-xl" />,
      bgColor: "bg-red-100",
    },
    Chemistry: {
      icon: <FaFlask className="text-yellow-500 text-xl" />,
      bgColor: "bg-yellow-100",
    },
    Biology: {
      icon: <FaDna className="text-green-500 text-xl" />,
      bgColor: "bg-green-100",
    },
  };

  // Fetch subjects and chapters from localStorage (only on the client-side)
  const [selectedChaptersFromStorage, setSelectedChaptersFromStorage] = useState({});
  const [testAnswers, setTestAnswers] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedChapters = JSON.parse(localStorage.getItem("selectedChapters")) || {};
      const storedTestAnswers = JSON.parse(localStorage.getItem("testAnswers")) || [];
      setSelectedChaptersFromStorage(storedChapters);
      setTestAnswers(storedTestAnswers);
    }
  }, []);

  const handleSubjectChange = (subject) => {
    setSelectedSubject(subject);
  };

  useEffect(() => {
    if (selectedSubject && selectedChaptersFromStorage[selectedSubject]) {
      const sectionChapters = selectedChaptersFromStorage[selectedSubject] || [];
      const sectionAnswers = testAnswers.filter(
        (answer) => answer.subject === selectedSubject
      );

      let totalCorrect = 0;
      let totalIncorrect = 0;
      let totalSkipped = 0;
      let chapterData = [];

      // Loop through the chapters and calculate correct, incorrect, and skipped questions
      sectionChapters.forEach((chapter) => {
        const chapterName = chapter.name;
        const numQuestions = chapter.numQuestions || 0;

        // Filter answers for this chapter
        const chapterAnswers = sectionAnswers.filter(
          (answer) =>
            answer.chapterName.toLowerCase() === chapterName.toLowerCase()
        );

        // Calculate correct and incorrect answers for this chapter
        const correctAnswers = chapterAnswers.filter(
          (answer) => answer.isCorrect
        ).length;
        const incorrectAnswers = chapterAnswers.length - correctAnswers; // Total answers - correct answers

        // Calculate skipped questions
        const skippedAnswers =
          numQuestions - (correctAnswers + incorrectAnswers);

        chapterData.push({
          date: chapterName,
          incorrect: incorrectAnswers,
          correct: correctAnswers,
          skipped: Math.max(0, skippedAnswers), // Ensure skipped is never negative
        });

        // Accumulate totals for all chapters
        totalCorrect += correctAnswers;
        totalIncorrect += incorrectAnswers;
        totalSkipped += skippedAnswers;
      });

      // Set chart data and subject performance data
      setChartData(chapterData);
      setCorrect(totalCorrect);
      setIncorrect(totalIncorrect);
      setSkipped(totalSkipped);
    }
  }, [selectedSubject, selectedChaptersFromStorage, testAnswers]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto flex flex-col items-start">
      <div className="flex flex-wrap justify-between items-center gap-20 text-sm md:text-md">
        <span className="text-xs md:text-base md:font-semibold text-black">
          Chapter-wise Performance
        </span>

        <div className="flex gap-4 mb-4">
          {Object.keys(selectedChaptersFromStorage).map((subject) => (
            <button
              key={subject}
              onClick={() => handleSubjectChange(subject)}
              className={`px-4 py-2 text-sm rounded-md flex items-center gap-2 transition ${
                selectedSubject === subject
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {subjectMapping[subject]?.icon}
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(tick) => `${tick}%`}
          />
          <YAxis dataKey="date" type="category" />
          <Tooltip />
          <Bar
            dataKey="incorrect"
            stackId="a"
            fill="#F93535"
            barSize={8}
            radius={[10, 10, 10, 10]}
          />
          <Bar
            dataKey="correct"
            stackId="a"
            fill="#356CF9"
            barSize={8}
            radius={[10, 10, 10, 10]}
          />
          <Bar
            dataKey="skipped"
            stackId="a"
            fill="#F9AB35"
            barSize={8}
            radius={[10, 10, 10, 10]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="w-full flex flex-wrap md:flex-row md:items-center md:justify-around mb-4">
        <div className="flex flex-wrap gap-4 mt-2 md:mt-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 md:w-4 md:h-4 bg-[#F93535] rounded"></span>
            <span className="text-gray-700 text-xs md:text-sm">Incorrect</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 md:w-4 md:h-4 bg-[#356CF9] rounded"></span>
            <span className="text-gray-700 text-xs md:text-sm">Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 md:w-4 md:h-4 bg-[#F9AB35] rounded"></span>
            <span className="text-gray-700 text-xs md:text-sm">Skipped</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPerformanceChart;
