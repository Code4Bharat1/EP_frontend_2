"use client";

import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const AccuracyCard = ({ selectedFilter }) => {
  const [data, setData] = useState([]);
  const [avgAccuracy, setAvgAccuracy] = useState(0);
  const [isImproving, setIsImproving] = useState(false);
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

        let labels = [];
        let performanceData = [];

        if (selectedFilter === "This Year") {
          labels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          performanceData = labels.map((month, index) => {
            const filtered = rawData.filter((item) => {
              const testDate = new Date(item.updatedAt);
              return (
                isSameYear(item.updatedAt) && testDate.getMonth() === index
              );
            });
            const totalPhysics = filtered.reduce(
              (sum, item) => sum + (item.Physics || 0),
              0
            );
            const totalChemistry = filtered.reduce(
              (sum, item) => sum + (item.Chemistry || 0),
              0
            );
            const totalBiology = filtered.reduce(
              (sum, item) => sum + (item.Biology || 0),
              0
            );
            return {
              label: month,
              physics: totalPhysics,
              chemistry: totalChemistry,
              biology: totalBiology,
            };
          });
        } else if (selectedFilter === "This Month") {
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
          performanceData = labels.map((week, index) => {
            const filtered = rawData.filter((item) => {
              const testDate = new Date(item.updatedAt);
              const weekNumber = Math.floor(testDate.getDate() / 7);
              return isSameMonth(item.updatedAt) && weekNumber === index;
            });
            const totalPhysics = filtered.reduce(
              (sum, item) => sum + (item.Physics || 0),
              0
            );
            const totalChemistry = filtered.reduce(
              (sum, item) => sum + (item.Chemistry || 0),
              0
            );
            const totalBiology = filtered.reduce(
              (sum, item) => sum + (item.Biology || 0),
              0
            );
            return {
              label: week,
              physics: totalPhysics,
              chemistry: totalChemistry,
              biology: totalBiology,
            };
          });
        } else if (selectedFilter === "This Week") {
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          performanceData = labels.map((day, index) => {
            const filtered = rawData.filter((item) => {
              const testDate = new Date(item.updatedAt);
              return isSameWeek(item.updatedAt) && testDate.getDay() === index;
            });
            const totalPhysics = filtered.reduce(
              (sum, item) => sum + (item.Physics || 0),
              0
            );
            const totalChemistry = filtered.reduce(
              (sum, item) => sum + (item.Chemistry || 0),
              0
            );
            const totalBiology = filtered.reduce(
              (sum, item) => sum + (item.Biology || 0),
              0
            );
            return {
              label: day,
              physics: totalPhysics,
              chemistry: totalChemistry,
              biology: totalBiology,
            };
          });
        }

        setData(performanceData);

        // Calculate average accuracy
        const avgAccuracy = Math.min(
          Math.round(
            performanceData.reduce(
              (acc, item) => acc + item.physics + item.chemistry + item.biology,
              0
            ) /
              (performanceData.length * 3)
          ),
          100
        );

        // Trend calculation
        const prevAccuracy = avgAccuracy > 0 ? avgAccuracy - 5 : avgAccuracy; // Previous accuracy as 5 less for simulation
        const isTrendIncreasing = avgAccuracy > prevAccuracy;
        const trendPercent = (
          ((avgAccuracy - prevAccuracy) / (prevAccuracy || 1)) *
          100
        ).toFixed(1);

        setAvgAccuracy(avgAccuracy);
        setIsImproving(isTrendIncreasing);
        setTrendPercentage(trendPercent);
      } catch (err) {
        console.error("Error fetching accuracy data:", err);
      }
    };

    fetchData();
  }, [selectedFilter]);

  // Determine trend icon and color
  const trendColor = isImproving ? "text-green-500" : "text-red-500";
  const TrendIcon = isImproving ? FaArrowUp : FaArrowDown;

  return (
    <div className="w-full max-w-sm p-5 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-500">ACCURACY</h3>
        <span className={`flex items-center text-sm font-medium ${trendColor}`}>
          <TrendIcon className="mr-1" />
          {Math.abs(trendPercentage)}% {isImproving ? "Increase" : "Decrease"}
        </span>
      </div>

      <h2 className="text-2xl font-bold mt-2">{avgAccuracy}%</h2>

      <div className="w-full h-32 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="physics"
              stroke="#0E5FD9"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="chemistry"
              stroke="#0FAF62"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="biology"
              stroke="#E84646"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccuracyCard;
