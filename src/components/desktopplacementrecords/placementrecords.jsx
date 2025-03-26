"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

// Register required ChartJS components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PlacementChart = () => {
  // Dynamic data state
  const [chartData, setChartData] = useState({
    labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "JEE",
        data: [450, 300, 300, 450, 150, 400, 380],
        backgroundColor: "rgba(24, 20, 243, 0.8)",
        borderRadius: 10, // Rounded bars
        borderSkipped: false, // Round both top & bottom
        barThickness: 12, // ✅ Controls bar width (smaller width)
      },
      {
        label: "NEET",
        data: [200, 100, 250, 320, 180, 220, 290],
        backgroundColor: "rgba(254, 92, 155, 0.8)",
        borderRadius: 10, // Rounded bars
        borderSkipped: false, // Round both top & bottom
        barThickness: 12, // ✅ Controls bar width (smaller width)
      },
    ],
  });

  // Simulating dynamic data fetch
  useEffect(() => {
    // Assume this comes from an API
    const fetchData = async () => {
      const newData = {
        neet: [460, 310, 310, 460, 160, 410, 390],
        jee: [210, 120, 260, 330, 190, 230, 300],
      };

      setChartData((prevData) => ({
        ...prevData,
        datasets: [
          { ...prevData.datasets[0], data: newData.neet },
          { ...prevData.datasets[1], data: newData.jee },
        ],
      }));
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Placement records and statistics
      </h2>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mb-4">
        <div className="flex items-center">
          <span className="w-4 h-4 bg-[#FE5C73] rounded-full mr-2"></span>
          <span className="text-gray-700">NEET</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-[#1814F3] rounded-full mr-2"></span>
          <span className="text-gray-700">JEE</span>
        </div>
      </div>

      {/* Bar Chart */}
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false }, // Hide default legend
          },
          
          scales: {
            y: {
              beginAtZero: true,
              max: 500, // Match max value to image
            },
            x: {
              categoryPercentage: 0.6, // ✅ Increased spacing between grouped bars
              barPercentage: 0.4, // ✅ Reduced bar width to create visible gaps
              stacked: false, // ✅ Keeps bars separate
            },
            
          },
        }}
      />
    </div>
  );
};

export default PlacementChart;
