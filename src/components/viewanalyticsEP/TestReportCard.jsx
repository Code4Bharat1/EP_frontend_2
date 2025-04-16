"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Label, Tooltip, Cell } from "recharts";

const TestReportChart = () => {
  const [subjectReport, setSubjectReport] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    // Get testAnswers from localStorage
    const storedAnswers = JSON.parse(localStorage.getItem("testAnswers"));

    if (storedAnswers) {
      // Initialize an empty report object
      const report = {};

      // Loop through the answers to count correct, incorrect, and skipped answers by subject
      storedAnswers.forEach(({ subject, isCorrect, skipped }) => {
        if (!report[subject]) {
          report[subject] = { correct: 0, incorrect: 0, skipped: 0 };
        }

        if (isCorrect) {
          report[subject].correct += 1;
        } else if (skipped) {
          report[subject].skipped += 1;
        } else {
          report[subject].incorrect += 1;
        }
      });

      // Update the state with the calculated report
      setSubjectReport(report);

      // Set the first subject as the default selected subject
      const firstSubject = Object.keys(report)[0];
      setSelectedSubject(firstSubject);
    }
  }, []);

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const chartData = subjectReport[selectedSubject]
    ? [
        {
          name: "Correct",
          value: subjectReport[selectedSubject].correct,
          color: "#356CF9",
        },
        {
          name: "Incorrect",
          value: subjectReport[selectedSubject].incorrect,
          color: "#E84646",
        },
        {
          name: "Skipped",
          value: subjectReport[selectedSubject].skipped,
          color: "#FF9500",
        },
      ]
    : [];

  const totalQuestions = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm md:mb-0 mb-7 flex flex-col mx-auto">
      {/* Heading aligned to the start */}
      <h2 className="text-lg font-semibold text-gray-800 text-left">
        Test Report
      </h2>

      {/* Dropdown for selecting subject */}
      <div className="flex justify-end mb-4">
        <select
          className="p-2 border border-gray-300 rounded"
          value={selectedSubject}
          onChange={handleSubjectChange}
        >
          {Object.keys(subjectReport).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Pie Chart */}
      <div className="flex justify-center">
        <PieChart width={200} height={200}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            strokeWidth={4}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            {/* Center Labels */}
            <Label
              value={totalQuestions}
              position="center"
              className="text-3xl font-medium fill-gray-900"
              dy={-10} // Moves number up
            />
            <Label
              value="Total Question"
              position="center"
              className="text-sm fill-gray-500"
              dy={10} // Moves text below number
            />
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1 mt-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#356CF9]" /> {/* Blue */}
            <span className="text-gray-700 text-sm">{chartData[0]?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#E84646]" /> {/* Red */}
            <span className="text-gray-700 text-sm">{chartData[1]?.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#FF9500]" /> {/* Orange */}
          <span className="text-gray-700 text-sm">{chartData[2]?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default TestReportChart;
