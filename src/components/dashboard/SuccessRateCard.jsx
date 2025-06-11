"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from "axios";

const SuccessRateCard = ({ selectedFilter }) => {
  const [data, setData] = useState({
    physics: 0,
    chemistry: 0,
    biology: 0,
    prevRate: 0,
  });
  const [successRate, setSuccessRate] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [trendPercentage, setTrendPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/success`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rawData = response.data;
        const currentDate = new Date();

        const isSameYear = (date) =>
          new Date(date).getFullYear() === currentDate.getFullYear();
        const isSameMonth = (date) =>
          isSameYear(date) &&
          new Date(date).getMonth() === currentDate.getMonth();
        const isSameWeek = (date) => {
          const testDate = new Date(date);
          const weekStart = new Date(currentDate);
          weekStart.setDate(currentDate.getDate() - currentDate.getDay());
          return testDate >= weekStart;
        };

        let filtered = [];
        switch (selectedFilter) {
          case "This Year":
            filtered = rawData.filter((item) => isSameYear(item.updatedAt));
            break;
          case "This Month":
            filtered = rawData.filter((item) => isSameMonth(item.updatedAt));
            break;
          case "This Week":
            filtered = rawData.filter((item) => isSameWeek(item.updatedAt));
            break;
          default:
            filtered = rawData;
        }

        const calculateTotalMarks = (filteredData) => {
          const total = { physics: 0, chemistry: 0, biology: 0 };
          filteredData.forEach((item) => {
            total.physics += item.Physics || 0;
            total.chemistry += item.Chemistry || 0;
            total.biology += item.Biology || 0;
          });
          return total;
        };

        const totalMarks = calculateTotalMarks(filtered);

        const avgSuccessRate = Math.min(
          Math.round(
            (totalMarks.physics + totalMarks.chemistry + totalMarks.biology) / 3
          ),
          100
        );

        const prevRate = data.prevRate || 0;
        const isTrendIncreasing = avgSuccessRate > prevRate;
        const trendPercent = Math.min(
          (((avgSuccessRate - prevRate) / (prevRate || 1)) * 100).toFixed(1),
          100
        );

        setIsIncreasing(isTrendIncreasing);
        setTrendPercentage(trendPercent);
        setSuccessRate(avgSuccessRate);
        setData({ ...totalMarks, prevRate: avgSuccessRate });
      } catch (err) {
        console.error("Error fetching success rate data:", err);
      }
    };

    fetchData();
  }, [selectedFilter]);

  const trendColor = isIncreasing ? "text-green-500" : "text-red-500";
  const TrendIcon = isIncreasing ? FaArrowUp : FaArrowDown;

  const chartData = [
    { subject: "Physics", rate: Math.min(data.physics, 100) },
    { subject: "Chemistry", rate: Math.min(data.chemistry, 100) },
    { subject: "Biology", rate: Math.min(data.biology, 100) },
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
      <div className="w-full h-48 mt-4"> {/* Increased height from h-32 to h-48 */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={35}>
            <XAxis dataKey="subject" tickLine={false} axisLine={false} />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(tick) => `${tick}%`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="rate" fill="#FFD599" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SuccessRateCard;
