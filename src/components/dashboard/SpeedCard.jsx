import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SpeedCard = ({ changeDate }) => {
  console.log(changeDate); // Logging to check the prop value
  const [marks, setMarks] = useState({
    Physics: 0,
    Chemistry: 0,
    Biology: 0,
    overallAverage: 0,
    testCount: 0,
  });
  const [prevAvg, setPrevAvg] = useState(40);

  useEffect(() => {
    const fetchAverageMarks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.warn("No token found in localStorage");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/average`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const chartData = response.data;
        const currentDate = new Date();

        // Time comparison functions
        const isSameYear = (date) =>
          new Date(date).getFullYear() === currentDate.getFullYear();
        const isSameMonth = (date) =>
          isSameYear(date) && new Date(date).getMonth() === currentDate.getMonth();
        const isSameWeek = (date) => {
          const testDate = new Date(date);
          const weekStart = new Date(currentDate);
          weekStart.setDate(currentDate.getDate() - currentDate.getDay());
          return testDate >= weekStart;
        };

        // Apply date filter based on the changeDate prop
        const filtered = chartData.filter((test) => {
          if (!test.updatedAt) return false;
          if (changeDate === "This Year") return isSameYear(test.updatedAt);
          if (changeDate === "This Month") return isSameMonth(test.updatedAt);
          if (changeDate === "This Week") return isSameWeek(test.updatedAt);
          return true;
        });

        // Calculate averages
        const totals = { Physics: 0, Chemistry: 0, Biology: 0 };
        filtered.forEach((item) => {
          totals.Physics += item.Physics || 0;
          totals.Chemistry += item.Chemistry || 0;
          totals.Biology += item.Biology || 0;
        });

        const count = filtered.length;
        const avg = {
          Physics: count ? +(totals.Physics / count).toFixed(2) : 0,
          Chemistry: count ? +(totals.Chemistry / count).toFixed(2) : 0,
          Biology: count ? +(totals.Biology / count).toFixed(2) : 0,
        };

        const overall =
          count !== 0
            ? +(
                (avg.Physics + avg.Chemistry + avg.Biology) / 3
              ).toFixed(2)
            : 0;

        setMarks({ ...avg, overallAverage: overall, testCount: count });
      } catch (error) {
        console.error("Error fetching average marks:", error);
      }
    };

    fetchAverageMarks();
  }, [changeDate]); // Now it depends on the `changeDate` prop

  const currentAvg = marks.overallAverage.toFixed(2);
  const isImproving = currentAvg > prevAvg;
  const trendColor = isImproving ? "text-green-500" : "text-red-500";
  const TrendIcon = isImproving ? FaArrowUp : FaArrowDown;

  const chartData = {
    labels: ["Physics", "Chemistry", "Biology"],
    datasets: [
      {
        label: "Average Marks",
        data: [marks.Physics, marks.Chemistry, marks.Biology],
        backgroundColor: ["#16DBCC", "#FFBB38", "#FE5C73"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="w-full max-w-sm p-5 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-500">
          AVERAGE MARKS  {/* Using changeDate directly */}
        </h3>
        
        <span className={`flex items-center text-sm font-medium ${trendColor}`}>
          <TrendIcon className="mr-1" />
          {isImproving ? "Improved" : "Dropped"}
        </span>
      </div>

      {/* Avg display */}
      <h2 className="text-2xl font-bold mt-2">{currentAvg}%</h2>

      {/* Chart */}
      <div className="w-full h-32 mt-4">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, max: 100 },
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
