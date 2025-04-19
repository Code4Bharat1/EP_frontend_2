"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceSummaryCard = ({ selectedFilter }) => {
  const [data, setData] = useState({
    Physics: [],
    Chemistry: [],
    Biology: [],
    labels: [],
  });

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
        let performanceData = { Physics: [], Chemistry: [], Biology: [] };

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
          labels.forEach((month, index) => {
            const filtered = rawData.filter((item) => {
              const testDate = new Date(item.updatedAt);
              return (
                isSameYear(item.updatedAt) && testDate.getMonth() === index
              );
            });
            performanceData.Physics.push(
              filtered.reduce((sum, item) => sum + (item.Physics || 0), 0)
            );
            performanceData.Chemistry.push(
              filtered.reduce((sum, item) => sum + (item.Chemistry || 0), 0)
            );
            performanceData.Biology.push(
              filtered.reduce((sum, item) => sum + (item.Biology || 0), 0)
            );
          });
        } else if (selectedFilter === "This Month") {
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
          labels.forEach((week, index) => {
            const filtered = rawData.filter((item) => {
              const testDate = new Date(item.updatedAt);
              const weekNumber = Math.floor(testDate.getDate() / 7);
              return isSameMonth(item.updatedAt) && weekNumber === index;
            });
            performanceData.Physics.push(
              filtered.reduce((sum, item) => sum + (item.Physics || 0), 0)
            );
            performanceData.Chemistry.push(
              filtered.reduce((sum, item) => sum + (item.Chemistry || 0), 0)
            );
            performanceData.Biology.push(
              filtered.reduce((sum, item) => sum + (item.Biology || 0), 0)
            );
          });
        } else if (selectedFilter === "This Week") {
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          labels.forEach((day, index) => {
            const filtered = rawData.filter((item) => {
              const testDate = new Date(item.updatedAt);
              return isSameWeek(item.updatedAt) && testDate.getDay() === index;
            });
            performanceData.Physics.push(
              filtered.reduce((sum, item) => sum + (item.Physics || 0), 0)
            );
            performanceData.Chemistry.push(
              filtered.reduce((sum, item) => sum + (item.Chemistry || 0), 0)
            );
            performanceData.Biology.push(
              filtered.reduce((sum, item) => sum + (item.Biology || 0), 0)
            );
          });
        }

        setData({ ...performanceData, labels });
      } catch (err) {
        console.error("Error fetching performance data:", err);
      }
    };

    fetchData();
  }, [selectedFilter]);

  const chartData = {
    labels: data.labels,
    datasets: [
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
        label: "Biology",
        data: data.Biology,
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
        ticks: {
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
    <div className="pt-4 flex flex-col items-center justify-center gap-4 sm:w-full sm:h-auto mb-20 md:flex-row md:items-start md:justify-center ">
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
