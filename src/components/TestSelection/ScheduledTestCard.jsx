"use client";

import { FaClipboardList } from "react-icons/fa";

const ScheduledTestCard = () => {
  const tests = [
    { name: "PRACTICE TEST 1", questions: "25 QUESTIONS", date: "02/05/2025", bgColor: "bg-pink-200" },
    { name: "PRACTICE TEST 2", questions: "30 QUESTIONS", date: "03/05/2025", bgColor: "bg-teal-400" },
    { name: "PRACTICE TEST 3", questions: "15 QUESTIONS", date: "04/05/2025", bgColor: "bg-gray-800" },
    { name: "PRACTICE TEST 4", questions: "20 QUESTIONS", date: "05/05/2025", bgColor: "bg-yellow-400" },
    { name: "PRACTICE TEST 5", questions: "35 QUESTIONS", date: "06/05/2025", bgColor: "bg-purple-500" },
    { name: "PRACTICE TEST 6", questions: "40 QUESTIONS", date: "07/05/2025", bgColor: "bg-orange-400" },
  ];

  return (
    <div className="space-y-4 p-4">
      {tests.map((test, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center md:justify-between bg-white shadow-md rounded-lg p-4"
        >
          
          {/* 🔹 DESKTOP ICON SECTION - Hidden on Mobile, Visible on Desktop */}
          <div className={`hidden md:flex items-center justify-center w-12 h-12 rounded-md ${test.bgColor}`}>
            <FaClipboardList className="text-white text-lg" />
          </div>

          {/* 🔹 TEST DETAILS SECTION - Common for both Mobile & Desktop */}
          <div className="flex flex-col md:flex-row flex-1 md:items-center justify-between w-full md:pl-4 mt-2 md:mt-0">

            {/* 🔹 MOBILE TEST NAME & DATE SECTION */}
            <div className="flex flex-col flex-1 text-left">
              
              <div className="flex items-center justify-between space-x-2">
                
                {/* 🔹 MOBILE ICON SECTION - Visible only on Mobile */}
                <div className={`flex items-center justify-center h-10 w-10 md:w-12 md:h-12 rounded-md md:hidden ${test.bgColor}`}>
                  <FaClipboardList className="text-white md:text-lg" />
                </div>

                {/* 🔹 TEST NAME - Responsive for both Mobile & Desktop */}
                <span className="text-[11px] md:text-lg font-semibold text-gray-800">{test.name}</span>

                {/* 🔹 MOBILE DIVIDER - Only Visible on Mobile */}
                <div className="md:hidden h-6 border-l border-gray-300 mx-4"></div>

                {/* 🔹 MOBILE DATE SECTION - Only Visible on Mobile */}
                <span className="text-[9px] bg-[#718EBF] text-white px-1 py-2 rounded-md text-center md:hidden mt-1">
                  Scheduled on {test.date}
                </span>
              </div>
            </div>

            {/* 🔹 DESKTOP DIVIDER - Only Visible on Desktop */}
            <div className="hidden md:block h-6 border-l border-gray-300 mx-4"></div>

            {/* 🔹 QUESTIONS COUNT SECTION */}
            <div className="h-5 flex-1">
              <span className="ml-16 pb-20 md:ml-10 md:pb-10 text-gray-600 text-[10px] md:text-[15px] md:font-semibold md:text-left">
                {test.questions}
              </span>
            </div>

            {/* 🔹 DESKTOP DIVIDER - Only Visible on Desktop */}
            <div className="hidden md:block h-6 border-l border-gray-300 mx-4"></div>

            {/* 🔹 DESKTOP DATE SECTION - Only Visible on Desktop */}
            <span className="hidden md:block bg-[#718EBF] text-white px-4 py-2 rounded-md text-center">
              Scheduled on {test.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduledTestCard;
