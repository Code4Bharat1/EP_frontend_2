"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios"; // Axios to fetch the data from the backend

const RecentTestReportCard = ({ filterType }) => {
  const [testData, setTestData] = useState([]);
  const [overallMarks, setOverallMarks] = useState(0);
  const [overallTotalQuestions, setOverallTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // State to track if we are on the client-side

  const [studentId, setStudentId] = useState(null);

  // Check if we are on the client side before accessing localStorage
  useEffect(() => {
    setIsClient(true); // Set to true once the component has mounted
    const storedStudentId = localStorage.getItem("studentId");
    if (storedStudentId) {
      setStudentId(storedStudentId);
    } else {
      console.error("Student ID is missing in localStorage");
    }
  }, []); // Empty dependency array ensures this runs only once after mounting

  useEffect(() => {
    if (!studentId) {
      return; // If studentId is not set, do nothing
    }

    const fetchTestData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/recent`, // Backend API endpoint
          {
            studentId,
            filterType, // Pass filterType (weekly, monthly, yearly)
          }
        );
        setTestData(response.data.results); // Assuming the response structure contains a "results" field
        setOverallMarks(response.data.lastOverallMark); // Set the overall marks
        setOverallTotalQuestions(response.data.overallTotalQuestions); // Set the overall questions
      } catch (error) {
        console.error("Error fetching test data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [studentId, filterType]); // Re-fetch data when `studentId` or `filterType` changes

  // Render a loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate percentage for each test
  const calculatePercentage = (marks, totalMarks) => {
    return totalMarks > 0 ? ((marks / totalMarks) * 100).toFixed(2) : 0;
  };

  // Ensure rendering only on the client side after studentId has been loaded
  if (!isClient) {
    return null; // Don't render anything until we have client-side access
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Main Report Card */}
      <Card className="w-full max-w-md bg-white border border-gray-300 rounded-2xl p-1 md:p-2">
        <CardHeader className="flex items-center justify-between">
          <div className="flex">
            <div className="flex items-start gap-5">
              <div className="bg-[#0062FF] text-white w-12 h-12 flex items-center justify-center rounded-lg text-lg font-bold">
                {overallMarks} {/* Show the overall marks */}
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-md font-semibold">
                  Recent Test Report
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  {testData[0]?.testName} •{" "}
                  {new Date(testData[0]?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {/* Right Side: Mid Risk Badge (Optional) */}
            <div className="md:ml-[18px] flex items-center text-center w-[85px] justify-center border border-[#FF974A] text-[#FF974A] px-4 py-1 rounded-xl text-[9px] md:text-[10px] font-medium h-8">
              Mid Risk
            </div>
          </div>
        </CardHeader>

        {/* Horizontal Divider */}
        <div className="border-t border-gray-300 my-3"></div>

        {/* Test Statistics - Showing Test Type, Marks, and Percentage */}
        <div className="grid grid-cols-3 text-center text-[12px] font-semibold text-gray-700">
          {testData.map((test, index) => (
            <div key={index} className="border-r border-gray-300 px-2 py-2">
              <p>{test.testType}</p>
              <p className="font-semibold text-md text-red">
                {calculatePercentage(test.marks, test.totalMarks)}%
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom Two Cards (Side by Side) */}
      <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-md">
        {/* Left Card for Overall Questions */}
        <Card className="flex items-center p-4 rounded-3xl shadow-lg bg-white">
          <div className="w-12 h-12 bg-pink-100 flex items-center justify-center rounded-full">
            {/* Icon for overall questions */}
          </div>
          <div className="ml-3">
            <p className="text-[10px] text-gray-600">Total Questions</p>
            <p className="text-lg font-semibold text-gray-800">
              {overallTotalQuestions}
            </p>
          </div>
        </Card>

        {/* Right Card for Overall Marks */}
        <Card className="flex items-center p-4 rounded-3xl shadow-lg bg-white">
          <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-full">
            {/* Icon for overall marks */}
          </div>
          <div className="ml-3">
            <p className="text-[10px] text-gray-600">Overall Marks</p>
            <p className="text-lg font-semibold">{overallMarks}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecentTestReportCard;
