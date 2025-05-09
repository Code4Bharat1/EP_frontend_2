"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { FiBookOpen, FiTrendingUp, FiAlertCircle, FiClock } from "react-icons/fi";

const RecentTestReportCard = ({ filterType }) => {
  const [testData, setTestData] = useState([]);
  const [overallMarks, setOverallMarks] = useState(0);
  const [overallTotalQuestions, setOverallTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [studentId, setStudentId] = useState(null);

  // Check if we are on the client side before accessing localStorage
  useEffect(() => {
    setIsClient(true);
    const authToken = localStorage.getItem("authToken");
  
    if (authToken) {
      try {
        const base64Payload = authToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        const extractedId = decodedPayload.id;
  
        if (extractedId) {
          setStudentId(extractedId);
        } else {
          console.error("Student ID not found in token.");
          setError("Authentication issue. Please try logging in again.");
        }
      } catch (err) {
        console.error("Error decoding authToken:", err);
        setError("Authentication issue. Please try logging in again.");
      }
    } else {
      console.error("authToken missing in localStorage");
      setError("Authentication issue. Please try logging in again.");
    }
  }, []);
  
  useEffect(() => {
    if (!studentId) {
      return;
    }

    const fetchTestData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/recent`,
          {
            studentId,
            filterType,
          }
        );
        
        if (response.data && response.data.results && response.data.results.length > 0) {
          setTestData(response.data.results);
          setOverallMarks(response.data.lastOverallMark || 0);
          setOverallTotalQuestions(response.data.overallTotalQuestions || 0);
        } else {
          // No test data available, but not an error
          setTestData([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching test data:", error);
        setError("We couldn't load your recent test data.");
        setLoading(false);
      }
    };

    fetchTestData();
  }, [studentId, filterType]);

  // Calculate percentage for each test
  const calculatePercentage = (marks, totalMarks) => {
    return totalMarks > 0 ? ((marks / totalMarks) * 100).toFixed(1) : 0;
  };

  // Get risk level and color based on percentage
  const getRiskLevel = (percentage) => {
    if (percentage >= 75) return { level: "Low Risk", color: "border-green-500 text-green-500" };
    if (percentage >= 50) return { level: "Mid Risk", color: "border-amber-500 text-amber-500" };
    return { level: "High Risk", color: "border-red-500 text-red-500" };
  };

  // Loading state component
  if (loading) {
    return (
      <div className="flex flex-col items-center w-full">
        <Card className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-start gap-5">
              <div className="bg-gray-200 w-12 h-12 rounded-lg"></div>
              <div className="flex flex-col">
                <div className="h-5 bg-gray-200 w-36 mb-2 rounded"></div>
                <div className="h-3 bg-gray-200 w-24 rounded"></div>
              </div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="border-t border-gray-200 my-3"></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  // Error state component
  if (error) {
    return (
      <div className="flex flex-col items-center w-full">
        <Card className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <FiAlertCircle className="text-amber-500 text-4xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Test Report Unavailable</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // No data state component
  if (!testData.length) {
    return (
      <div className="flex flex-col items-center w-full">
        <Card className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-4">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <FiBookOpen className="text-blue-500 text-4xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No Test Data Yet</h3>
            <p className="text-gray-600 mb-2">You haven't taken any tests during this period.</p>
            <p className="text-sm text-gray-500">Complete tests to see your performance report.</p>
          </div>
        </Card>
      </div>
    );
  }

  // Get risk level for the latest test
  const latestTestPercentage = calculatePercentage(
    testData[0]?.marks || 0, 
    testData[0]?.totalMarks || 1
  );
  const riskInfo = getRiskLevel(parseFloat(latestTestPercentage));

  return (
    <div className="flex flex-col items-center w-full">
      {/* Main Report Card */}
      <Card className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex items-center justify-between p-0 mb-4">
          <div className="flex">
            <div className="flex items-start gap-5">
              <div className="bg-blue-600 text-white w-14 h-14 flex items-center justify-center rounded-lg text-lg font-bold shadow-sm">
                {overallMarks}
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-md font-semibold text-gray-800">
                  Recent Test Report
                </CardTitle>
                <p className="text-gray-600 text-sm flex items-center gap-1">
                  <FiClock className="text-gray-400" size={12} />
                  {testData[0]?.testName || "Test"} •{" "}
                  {new Date(testData[0]?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {/* Risk Badge */}
            <div className={`ml-6 flex items-center text-center h-8 px-4 border rounded-xl text-xs font-medium ${riskInfo.color}`}>
              {riskInfo.level}
            </div>
          </div>
        </CardHeader>

        {/* Horizontal Divider */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Test Statistics */}
        <div className="grid grid-cols-3 text-center text-sm font-semibold text-gray-700">
          {testData.slice(0, 3).map((test, index) => {
            const percent = calculatePercentage(test.marks, test.totalMarks);
            const color = 
              percent >= 75 ? "text-green-600" : 
              percent >= 50 ? "text-amber-600" : 
              "text-red-600";
              
            return (
              <div 
                key={index} 
                className={`px-2 py-3 ${index < 2 ? "border-r border-gray-200" : ""}`}
              >
                <p className="text-xs text-gray-500 mb-1">{test.testType || `Test ${index + 1}`}</p>
                <p className={`font-bold text-base ${color}`}>
                  {percent}%
                </p>
                <p className="text-xs text-gray-400 mt-1">{test.marks}/{test.totalMarks}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Bottom Two Cards (Side by Side) */}
      <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-md">
        {/* Left Card for Overall Questions */}
        <Card className="flex items-center p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
          <div className="w-12 h-12 bg-purple-100 flex items-center justify-center rounded-full text-purple-600">
            <FiBookOpen size={20} />
          </div>
          <div className="ml-3">
            <p className="text-xs text-gray-500">Total Questions</p>
            <p className="text-lg font-semibold text-gray-800">
              {overallTotalQuestions}
            </p>
          </div>
        </Card>

        {/* Right Card for Overall Marks */}
        <Card className="flex items-center p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white">
          <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-full text-blue-600">
            <FiTrendingUp size={20} />
          </div>
          <div className="ml-3">
            <p className="text-xs text-gray-500">Overall Marks</p>
            <p className="text-lg font-semibold text-blue-600">{overallMarks}</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecentTestReportCard;