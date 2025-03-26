"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Sample Data for Different Timeframes
const performanceData = {
  "This Year": {
    Zoology: [130, 90, 110, 70, 85, 120, 105],
    Physics: [80, 75, 85, 95, 100, 90, 95],
    Chemistry: [100, 60, 90, 85, 75, 95, 110],
    Botany: [95, 110, 75, 60, 120, 100, 105],
  },
  "This Month": {
    Zoology: [100, 85, 90, 95, 80, 115, 100],
    Physics: [90, 70, 80, 85, 95, 105, 80],
    Chemistry: [110, 80, 95, 70, 105, 115, 95],
    Botany: [80, 100, 85, 75, 90, 110, 85],
  },
  "This Week": {
    Zoology: [90, 75, 80, 100, 85, 105, 90],
    Physics: [95, 65, 85, 70, 105, 100, 95],
    Chemistry: [85, 55, 75, 90, 70, 105, 80],
    Botany: [70, 90, 65, 50, 100, 85, 75],
  },
};

const PerformanceSummaryCard = ({ selectedFilter }) => {
  const [data, setData] = useState(performanceData[selectedFilter]);

  useEffect(() => {
    setData(performanceData[selectedFilter]);
  }, [selectedFilter]);

  const chartData = {
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"], // Weekdays
    datasets: [
      {
        label: "Zoology",
        data: data.Zoology,
        backgroundColor: "#1814F3", // Blue
        barThickness: 8,
        borderRadius: 10,
      },
      {
        label: "Physics",
        data: data.Physics,
        backgroundColor: "#FE5C73", // Red
        barThickness: 8,
        borderRadius: 10,
      },
      {
        label: "Chemistry",
        data: data.Chemistry,
        backgroundColor: "#FFBB38", // Orange
        barThickness: 8,
        borderRadius: 10,
      },
      {
        label: "Botany",
        data: data.Botany,
        backgroundColor: "#16DBCC", // Teal
        barThickness: 8,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 19,
          color: "#718EBF",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 150,
        ticks: {
          stepSize: 30,
          color: "#718EBF",
        },
      },
      x: {
        ticks: {
          color: "#718EBF",
        },
      },
    },
  };

  return (
    <div className="pt-4 flex flex-col items-center justify-center gap-4 sm:w-full sm:h-auto md:flex-row md:items-start md:justify-center ">
      <div className="bg-white rounded-2xl p-4 shadow-lg sm:w-full h-96 sm:mb-4 md:w-[450px]">
        <h2 className="text-lg font-semibold mb-4 text-center md:text-left text-[#343C6A]">
          Performance Summary
        </h2>
        <div className="relative w-full h-72 sm:h-64 md:h-80 md:max-w-lg lg:max-w-lg xl:max-w-xl">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummaryCard;
