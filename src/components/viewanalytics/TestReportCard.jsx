"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Label, Tooltip, Cell } from "recharts";
import axios from "axios";

const TestReportChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/fulltest/results`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const result = response.data.testResult;

        // Directly use the counts from the API
        const chart = [
          {
            name: "Correct",
            value: result.correctAnswersCount,
            color: "#28a745",
          }, // Green
          { name: "Wrong", value: result.wrongAnswersCount, color: "#dc3545" }, // Red
          {
            name: "Unattempted",
            value: result.notAttemptedCount,
            color: "#ffc107",
          }, // Yellow
        ];

        setChartData(chart);
      } catch (error) {
        console.error("Error fetching test report data:", error);
      }
    };
    fetchResults();
  }, []);
  const totalQuestions = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 text-left">
        Test Report
      </h2>

      <PieChart width={250} height={250}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <Label
            value={totalQuestions}
            position="center"
            className="text-3xl"
            dy={-10}
          />
          <Label
            value="Total Questions"
            position="center"
            className="text-sm"
            dy={10}
          />
        </Pie>
        <Tooltip />
      </PieChart>
      {/* Legend */}
      <div className="mt-4 flex flex-col gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="text-gray-900 font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestReportChart;
