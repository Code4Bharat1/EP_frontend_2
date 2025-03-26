"use client";

import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Dummy accuracy data with high-low variations for different filters
const accuracyData = {
    "This Year": {
      physics: [85, 92, 45, 88, 78, 63, 89], // Mixed high & low values
      chemistry: [90, 40, 55, 91, 48, 79, 92], // Some below 50, some above 75
      biology: [87, 60, 88, 39, 86, 75, 88], // More variance in performance
      prevAccuracy: 72,
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    "This Month": {
      physics: [80, 42, 78, 84, 35, 91, 83], // Low and high mix
      chemistry: [85, 43, 30, 76, 55, 84, 67], // Random mix with very low values
      biology: [83, 50, 82, 45, 78, 86, 64], // Alternating highs and lows
      prevAccuracy: 68,
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    },
    "This Week": {
      physics: [75, 78, 52, 37, 80, 46, 59], // Low mid-range scores
      chemistry: [40, 27, 75, 62, 38, 79, 81], // Some subjects doing worse than others
      biology: [78, 33, 47, 80, 41, 56, 69], // Strong fluctuations
      prevAccuracy: 60,
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  };
  

const AccuracyCard = ({ selectedFilter }) => {
  // State for selected dataset
  const [data, setData] = useState(accuracyData["This Year"]);
  const [avgAccuracy, setAvgAccuracy] = useState(0);

  useEffect(() => {
    setData(accuracyData[selectedFilter]);

    // Calculate average accuracy dynamically
    const avg =
      (accuracyData[selectedFilter].physics.reduce((a, b) => a + b, 0) +
        accuracyData[selectedFilter].chemistry.reduce((a, b) => a + b, 0) +
        accuracyData[selectedFilter].biology.reduce((a, b) => a + b, 0)) /
      (accuracyData[selectedFilter].physics.length * 3);
    
    setAvgAccuracy(Math.round(avg));
  }, [selectedFilter]);

  // Calculate trend direction (increase/decrease)
  const isImproving = avgAccuracy > data.prevAccuracy;
  const trendColor = isImproving ? "text-green-500" : "text-red-500";
  const TrendIcon = isImproving ? FaArrowUp : FaArrowDown;
  const trendPercentage = (((avgAccuracy - data.prevAccuracy) / data.prevAccuracy) * 100).toFixed(1);

  // Generate chart data
  const chartData = data.labels.map((label, index) => ({
    label,
    physics: data.physics[index],
    chemistry: data.chemistry[index],
    biology: data.biology[index],
  }));

  return (
    <div className="w-full max-w-sm p-5 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-500">ACCURACY</h3>
        <span className={`flex items-center text-sm font-medium ${trendColor}`}>
          <TrendIcon className="mr-1" />
          {Math.abs(trendPercentage)}% {isImproving ? "Increase" : "Decrease"}
        </span>
      </div>

      {/* Accuracy Display */}
      <h2 className="text-2xl font-bold mt-2">{avgAccuracy}</h2>

      {/* Line Chart */}
      <div className="w-full h-32 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <Tooltip />

            {/* Physics - Red Line */}
            <Line
              type="monotone"
              dataKey="physics"
              stroke="#0E5FD9"
              strokeWidth={3}
              dot={false}
              opacity={0.7}
            />

            {/* Chemistry - Yellow Line */}
            <Line
              type="monotone"
              dataKey="chemistry"
              stroke="#0FAF62"
              strokeWidth={3}
              dot={false}
              opacity={0.7}
            />

            {/* Biology - Green Line */}
            <Line
              type="monotone"
              dataKey="biology"
              stroke="#E84646"
              strokeWidth={3}
              dot={false}
              opacity={0.7}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccuracyCard;
