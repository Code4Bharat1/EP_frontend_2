"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, X } from "lucide-react";

const PreviousYearList = () => {
  const [years, setYears] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [timer, setTimer] = useState(30);
  const [selectedYear, setSelectedYear] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/years`);
        setYears(response.data.years);
      } catch (error) {
        console.error("Failed to fetch years:", error);
      }
    };

    fetchYears();
  }, []);

  useEffect(() => {
    let countdown;
    if (showInstructions && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      handleProceedNow();
    }
    return () => clearInterval(countdown);
  }, [showInstructions, timer]);

  const handleStartTest = (year) => {
    setSelectedYear(year);
    setShowInstructions(true);
    setTimer(30); // Reset timer to 10 seconds
  };

  const handleCancel = () => {
    setShowInstructions(false);
    setTimer(10);
  };

  const handleProceedNow = () => {
    localStorage.setItem("selectedYear", selectedYear);
    router.push("/testinterfacePYQ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Previous Year Question Papers
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Test your knowledge with carefully curated question papers from previous years.
              Choose a year and start your practice session.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {years.map((year, index) => (
              <div
                key={year}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: "fadeInUp 0.6s ease-out forwards"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Year {year}
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {year} Question Paper
                    </h3>
                  </div>
                  <button
                    onClick={() => handleStartTest(year)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Start Test
                  </button>
                </div>
              </div>
            ))}
          </div>

          {years.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Question Papers Available</h3>
              <p className="text-gray-500">Question papers will appear here once they're loaded.</p>
            </div>
          )}
        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-xl font-semibold">Test Instructions</h2>
              </div>
              <button onClick={handleCancel}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                <li>Do not exit full screen once test starts</li>
                <li>Switching tabs may result in disqualification</li>
                <li>Use only on-screen buttons to navigate</li>
                <li>Read all questions carefully</li>
              </ul>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-300 rounded-lg">
                  <Clock className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700 font-medium">Test begins in</span>
                  <div className="text-xl font-bold text-white bg-red-500 px-3 py-1 rounded-lg">{timer}</div>
                  <span className="text-gray-700 font-medium">seconds</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleCancel}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedNow}
                  disabled={timer > 0}
                  className={`w-1/2 px-4 py-2 rounded-lg font-semibold text-white ${
                    timer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  Start Test
                </button>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${((10 - timer) / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PreviousYearList;
