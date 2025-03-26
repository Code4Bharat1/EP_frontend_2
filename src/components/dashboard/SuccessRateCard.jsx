"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const SuccessRateCard = ({ selectedFilter }) => {
  // Dummy success rate data for different filters
  const successRateData = {
    "This Year": {
      physics: 78,
      chemistry: 85,
      biology: 65,
      prevRate: 73, // Previous success rate
    },
    "This Month": {
      physics: 70,
      chemistry: 80,
      biology: 60,
      prevRate: 68,
    },
    "This Week": {
      physics: 55,
      chemistry: 75,
      biology: 50,
      prevRate: 62,
    },
  };

  // State for dynamic data
  const [data, setData] = useState(successRateData["This Year"]);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    setData(successRateData[selectedFilter]);
    setSuccessRate(Math.round((successRateData[selectedFilter].physics + successRateData[selectedFilter].chemistry + successRateData[selectedFilter].biology) / 3));
  }, [selectedFilter]);

  // Calculate trend percentage and direction
  const isIncreasing = successRate > data.prevRate;
  const trendColor = isIncreasing ? "text-green-500" : "text-red-500";
  const TrendIcon = isIncreasing ? FaArrowUp : FaArrowDown;
  const trendPercentage = (((successRate - data.prevRate) / data.prevRate) * 100).toFixed(1);

  // Chart Data
  const chartData = [
    { subject: "Physics", rate: data.physics },
    { subject: "Chemistry", rate: data.chemistry },
    { subject: "Biology", rate: data.biology },
  ];

  return (
    <div className="w-full max-w-sm p-5 bg-white rounded-2xl shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-500">SUCCESS RATE</h3>
        <span className={`flex items-center text-sm font-medium ${trendColor}`}>
          <TrendIcon className="mr-1" />
          {Math.abs(trendPercentage)}% {isIncreasing ? "Increase" : "Decrease"}
        </span>
      </div>

      {/* Success Rate Display */}
      <h2 className="text-2xl font-bold mt-2">{successRate}%</h2>

      {/* Bar Chart */}
      <div className="w-full h-32 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={35}>
            <XAxis dataKey="subject" tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
            <Tooltip />
            <Bar dataKey="rate" fill="#FFD599" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SuccessRateCard;
