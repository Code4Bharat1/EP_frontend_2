"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, X, CheckCircle } from "lucide-react"; // npm install lucide-react

const ScheduledTestCard = () => {
  const [tests, setTests] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [timer, setTimer] = useState(60);
  const [selectedTestId, setSelectedTestId] = useState(null);
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
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const studentId = decodedToken.id;

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
            endDate.setHours(23, 59, 59, 999);

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

  useEffect(() => {
    if (showInstructions && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && selectedTestId) {
      router.push("/testinterfaceGT");
    }
  }, [showInstructions, timer, selectedTestId, router]);

  const handleStartTest = (testId) => {
    setSelectedTestId(testId);
    localStorage.setItem("testid", testId);
    setShowInstructions(true);
    setTimer(60);
  };

  const handleCancel = () => {
    setShowInstructions(false);
    setSelectedTestId(null);
    setTimer(60);
  };

  const handleProceedNow = () => {
    router.push("/testinterfaceGT");
  };

  return (
    <div className="space-y-4 p-4">
      {/* Instruction Modal */}
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
                <li>Once the test starts, do not exit full screen mode</li>
                <li>Do not switch tabs or windows — this may disqualify you</li>
                <li>Use only the on-screen options to navigate questions</li>
                <li>Answer all questions carefully; there's no going back</li>
              </ul>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-300 rounded-lg">
                  <Clock className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700 font-medium">Test will begin in</span>
                  <div className="text-xl font-bold text-white bg-red-500 px-3 py-1 rounded-lg">
                    {timer}
                  </div>
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
                    timer > 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  Start Test
                </button>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${((60 - timer) / 60) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-2 rounded-md bg-gray-50 text-gray-700 text-lg md:text-2xl font-bold text-center py-5">
        Teacher Generated Test
      </div>

      {tests.map((test, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center md:justify-between bg-white shadow-md rounded-lg p-4"
        >
          {/* Desktop Icon */}
          <div className={`hidden md:flex items-center justify-center w-12 h-12 rounded-md ${test.bgColor}`}>
            <FaClipboardList className="text-white text-lg" />
          </div>

          <div className="flex flex-col md:flex-row flex-1 md:items-center justify-between w-full md:pl-4 mt-2 md:mt-0">
            {/* Mobile Header */}
            <div className="flex flex-col flex-1 text-left">
              <div className="flex items-center justify-between space-x-2">
                <div
                  className={`flex items-center justify-center h-10 w-10 md:hidden rounded-md ${test.bgColor}`}
                >
                  <FaClipboardList className="text-white" />
                </div>
                <span className="text-[11px] md:text-lg font-semibold text-gray-800">
                  {test.name}
                </span>
                <div className="md:hidden h-6 border-l border-gray-300 mx-4" />
                <button
                  onClick={() => test.isActive && handleStartTest(test.id)}
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

            {/* Desktop Elements */}
            <div className="hidden md:block h-6 border-l border-gray-300 mx-4" />
            <div className="h-5 flex-1">
              <span className="ml-16 md:ml-10 text-gray-600 text-[10px] md:text-[15px] font-semibold text-left">
                {test.questions}
              </span>
            </div>
            <div className="hidden md:block h-6 border-l border-gray-300 mx-4" />
            <button
              onClick={() => test.isActive && handleStartTest(test.id)}
              className={`hidden md:block px-4 py-2 rounded-md text-center w-[250px] ${
                test.isActive ? "bg-red-500 text-white" : "bg-[#718EBF] text-white"
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
