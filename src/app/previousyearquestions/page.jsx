"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const PreviousYearList = () => {
  const [years, setYears] = useState([]);

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

  const handleStartTest = (year) => {
    localStorage.setItem("selectedYear", year);
    router.push("/testinterfacePYQ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
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

          {/* Years Grid */}
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
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Card Content */}
                <div className="relative p-6">
                  {/* Year Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Year {year}
                  </div>

                  {/* Main Content */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {year} Question Paper
                    </h3>
                    
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleStartTest(year)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2z"></path>
                      </svg>
                      Start Test
                    </span>
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-400/10 to-blue-400/10 rounded-full translate-y-8 -translate-x-8 group-hover:scale-125 transition-transform duration-500"></div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {years.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Question Papers Available</h3>
              <p className="text-gray-500">Question papers will appear here once they're loaded.</p>
            </div>
          )}
        </div>
      </div>

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