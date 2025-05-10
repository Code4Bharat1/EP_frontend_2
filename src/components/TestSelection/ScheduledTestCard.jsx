"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ScheduledTestCard = () => {
  const [tests, setTests] = useState([]);
  const router = useRouter();

  const bgColors = [
    "bg-pink-200",
    "bg-teal-400",
    "bg-gray-800",
    "bg-yellow-400",
    "bg-purple-500",
    "bg-orange-400",
  ];

  useEffect(() => {
    const fetchTests = async () => {
      try {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.error('No token found');
          return;
        }
  
        // Decode the JWT to get student ID
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const studentId = decodedToken.id;
  
        // Send request with studentId in the body
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/newadmin/test-data`,
          { studentId }
        );
  
        const rawTests = res.data.tests;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        const upcomingTests = rawTests
          .map((test, index) => {
            const startDate = new Date(test.exam_start_date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(test.exam_end_date);
            endDate.setHours(23, 59, 59, 999); // End of the day
            
            // Skip tests that have already ended
            if (today > endDate) return null;
            
            return {
              id: test.id,
              name: test.testname,
              questions: `${test.no_of_questions} QUESTIONS`,
              date: startDate.toLocaleDateString("en-GB"),
              rawStartDate: startDate,
              rawEndDate: endDate,
              isActive: today >= startDate && today <= endDate,
              bgColor: bgColors[index % bgColors.length],
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.rawStartDate - b.rawStartDate);
  
        setTests(upcomingTests);
      } catch (error) {
        console.error("Failed to fetch test data:", error);
      }
    };
  
    fetchTests();
  }, []);

  const handleStartTest = (testname) => {
    localStorage.setItem("testid", testname);
    console.log(`Set testid in localStorage: ${testname}`);
    router.push('/testinterfaceGT');
  };

  return (
    <div className="space-y-4 p-4">
      {tests.map((test, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center md:justify-between bg-white shadow-md rounded-lg p-4"
        >
          {/* DESKTOP ICON */}
          <div
            className={`hidden md:flex items-center justify-center w-12 h-12 rounded-md ${test.bgColor}`}
          >
            <FaClipboardList className="text-white text-lg" />
          </div>

          <div className="flex flex-col md:flex-row flex-1 md:items-center justify-between w-full md:pl-4 mt-2 md:mt-0">
            {/* TEST NAME + DATE (Mobile) */}
            <div className="flex flex-col flex-1 text-left">
              <div className="flex items-center justify-between space-x-2">
                <div
                  className={`flex items-center justify-center h-10 w-10 md:w-12 md:h-12 rounded-md md:hidden ${test.bgColor}`}
                >
                  <FaClipboardList className="text-white md:text-lg" />
                </div>

                <span className="text-[11px] md:text-lg font-semibold text-gray-800">
                  {test.name}
                </span>

                <div className="md:hidden h-6 border-l border-gray-300 mx-4"></div>

                <button
                  onClick={() => test.isActive && handleStartTest(test.name)}
                  className={`text-[9px] px-1 py-2 rounded-md text-center md:hidden mt-1 w-[120px] ${
                    test.isActive
                      ? "bg-red-500 text-white"
                      : "bg-[#718EBF] text-white"
                  }`}
                >
                  {test.isActive ? "Start Test" : `Scheduled on ${test.date}`}
                </button>
              </div>
            </div>

            {/* DESKTOP DIVIDER */}
            <div className="hidden md:block h-6 border-l border-gray-300 mx-4"></div>

            {/* QUESTION COUNT */}
            <div className="h-5 flex-1">
              <span className="ml-16 pb-20 md:ml-10 md:pb-10 text-gray-600 text-[10px] md:text-[15px] md:font-semibold md:text-left">
                {test.questions}
              </span>
            </div>

            {/* DESKTOP DIVIDER */}
            <div className="hidden md:block h-6 border-l border-gray-300 mx-4"></div>

            {/* DESKTOP DATE / START TEST */}
            <button
              onClick={() => test.isActive && handleStartTest(test.id)}
              className={`hidden md:block px-4 py-2 rounded-md text-center w-[250px] ${
                test.isActive
                  ? "bg-red-500 text-white"
                  : "bg-[#718EBF] text-white"
              }`}
            >
              {test.isActive ? "Start Test" : `Scheduled on ${test.date}`}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduledTestCard;