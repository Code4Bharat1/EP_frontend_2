import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SpeedCard = ({ selectedFilter }) => {
  // Dummy data for different filters
  const speedData = {
    "This Year": { physics: 30, chemistry: 40, biology: 35, zoology: 30,prevSpeed: 35 },
    "This Month": { physics: 25, chemistry: 38, biology: 30, zoology: 29,prevSpeed: 28 },
    "This Week": { physics: 20, chemistry: 28, biology: 25, zoology: 40, prevSpeed: 22 },
  };

  // Set data dynamically based on selected filter
  const [data, setData] = useState(speedData["This Year"]);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    setData(speedData[selectedFilter]);
    setSpeed(Math.min(speedData[selectedFilter].physics, speedData[selectedFilter].chemistry, speedData[selectedFilter].biology));
  }, [selectedFilter]);

  // Determine performance trend (green for improvement, red for decrease)
  const isImproving = speed < data.prevSpeed;
  const trendColor = isImproving ? "text-green-500" : "text-red-500";
  const TrendIcon = isImproving ? FaArrowUp : FaArrowDown;

  // Chart Data
  const chartData = {
    labels: ["Physics", "Chemistry", "Biology", "Zoology"],
    datasets: [
      {
        label: "Test Solve Speed (min)",
        data: [data.physics, data.chemistry, data.biology, data.zoology],
        backgroundColor: ["#16DBCC", "#FFBB38", "#FE5C73", "#1814F3"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="w-full max-w-sm p-5 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-500">SPEED</h3>
        <span className={`flex items-center text-sm font-medium ${trendColor}`}>
          <TrendIcon className="mr-1" />
          {isImproving ? "Improved" : "Decreased"}
        </span>
      </div>

      {/* Speed Display */}
      <h2 className="text-2xl font-bold mt-2">{speed} minutes</h2>

      {/* Bar Chart */}
      <div className="w-full h-32 mt-4">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 50,
              },
            },
            plugins: {
              legend: { display: false },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SpeedCard;
