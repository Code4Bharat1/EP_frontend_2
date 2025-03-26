"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

// Register required ChartJS components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PlacementChart = () => {
  const [chartOptions, setChartOptions] = useState({});

  // Set responsive chart options dynamically
  useEffect(() => {
    const updateChartOptions = () => {
      const isMobile = window.innerWidth < 640; // Mobile screen check

      setChartOptions({
        responsive: true,
        maintainAspectRatio: false, // Ensures the chart scales properly
        plugins: {
          legend: { display: false }, // Hide default legend
        },
        scales: {
          y: { beginAtZero: true, max: 500 }, // Match max value to image
          x: {
            categoryPercentage: isMobile ? 0.6 : 0.5, // ✅ More spacing on mobile
            barPercentage: isMobile ? 0.25 : 0.3, // ✅ Reduce bar width for mobile
            stacked: false, // ✅ Keep bars separate
          },
        },
      });
    };

    updateChartOptions();
    window.addEventListener("resize", updateChartOptions);

    return () => window.removeEventListener("resize", updateChartOptions);
  }, []);

  const [chartData, setChartData] = useState({
    labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "JEE",
        data: [450, 300, 300, 450, 150, 400, 380],
        backgroundColor: "rgba(54, 162, 235, 0.9)", // More visible blue
        borderRadius: 10, // Rounded bars
        borderSkipped: false, // Round both top & bottom
        barThickness: 12, // ✅ Controls bar width (desktop)
      },
      {
        label: "NEET",
        data: [200, 100, 250, 320, 180, 220, 290],
        backgroundColor: "rgba(255, 99, 132, 0.9)", // More visible pink
        borderRadius: 10, // Rounded bars
        borderSkipped: false, // Round both top & bottom
        barThickness: 12, // ✅ Controls bar width (desktop)
      },
    ],
  });

  // Simulating dynamic data fetch
  useEffect(() => {
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg w-full">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Placement records and statistics
      </h2>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mb-4">
        <div className="flex items-center">
          <span className="w-4 h-4 bg-pink-500 rounded-full mr-2"></span>
          <span className="text-gray-700">NEET</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-gray-700">JEE</span>
        </div>
      </div>

      {/* Bar Chart (Make it full-width & responsive) */}
      <div className="w-full h-[300px] sm:h-[400px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PlacementChart;
