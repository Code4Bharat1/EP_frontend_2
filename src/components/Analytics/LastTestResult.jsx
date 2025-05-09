"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUserCircle, FaTrophy, FaMedal } from "react-icons/fa";
import { FiUsers, FiAlertCircle, FiAward } from "react-icons/fi";
import { ArrowUp, ArrowDown, Award } from "lucide-react";

const LastTestResultCard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Process the user data
        const usersWithTestResults = response.data
          .filter((user) => user.firstName && user.testResults && user.testResults.length > 0)
          .map((user) => {
            const totalQuestions = user.testResults.reduce((acc, test) => {
              return (
                acc +
                (test.correctAnswers?.length || 0) +
                (test.wrongAnswers?.length || 0) +
                (test.notAttempted?.length || 0)
              );
            }, 0);

            const totalCorrectAnswers = user.testResults.reduce((acc, test) => {
              return acc + (test.correctAnswers?.length || 0);
            }, 0);

            const successRate =
              totalQuestions > 0
                ? (totalCorrectAnswers / totalQuestions) * 100
                : 0;

            return { 
              ...user, 
              successRate,
              totalCorrectAnswers,
              totalQuestions
            };
          })
          // Sort by success rate (highest first)
          .sort((a, b) => b.successRate - a.successRate)
          // Take top 5 performers
          .slice(0, 5);

        setUsers(usersWithTestResults);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response || error.message
        );
        setError("We couldn't load the top performers data at the moment.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Card className="w-full max-w-md h-96 overflow-hidden bg-white border border-gray-200 shadow-sm">
        <CardHeader className="text-center md:text-left pb-2">
          <CardTitle className="text-lg font-semibold text-[#333B69] flex items-center gap-2">
            <FiUsers className="text-blue-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center p-4 rounded-xl bg-gray-50 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 w-24 mb-2 rounded"></div>
                <div className="h-3 bg-gray-200 w-16 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full max-w-md h-96 overflow-hidden bg-white border border-gray-200 shadow-sm">
        <CardHeader className="text-center md:text-left pb-2">
          <CardTitle className="text-lg font-semibold text-[#333B69] flex items-center gap-2">
            <FiUsers className="text-blue-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-72 text-center">
          <FiAlertCircle className="text-amber-500 text-4xl mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Data Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!users || users.length === 0) {
    return (
      <Card className="w-full max-w-md h-96 overflow-hidden bg-white border border-gray-200 shadow-sm">
        <CardHeader className="text-center md:text-left pb-2">
          <CardTitle className="text-lg font-semibold text-[#333B69] flex items-center gap-2">
            <FiUsers className="text-blue-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-72 text-center">
          <FiAward className="text-blue-400 text-4xl mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No Results Yet</h3>
          <p className="text-gray-600">Once students complete tests, top performers will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  // Medal colors for top 3
  const medalColors = [
    "text-yellow-500", // Gold
    "text-gray-400",   // Silver
    "text-amber-600"   // Bronze
  ];

  return (
    <Card className="w-full max-w-md h-96 overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="text-center md:text-left pb-2">
        <CardTitle className="text-lg font-semibold text-[#333B69] flex items-center gap-2">
          <FiUsers className="text-blue-500" />
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-80 space-y-3 pr-1">
        {users.map((user, index) => {
          const isPositive = user.successRate >= 50;
          
          return (
            <div
              key={index}
              className="flex items-center p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              {/* Rank Medal/Number */}
              {index < 3 ? (
                <div className="relative mr-3">
                  {index === 0 && <FaTrophy className={`${medalColors[0]} text-xl`} />}
                  {index === 1 && <FaMedal className={`${medalColors[1]} text-xl`} />}
                  {index === 2 && <FaMedal className={`${medalColors[2]} text-xl`} />}
                </div>
              ) : (
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 text-xs font-medium mr-3">
                  {index + 1}
                </div>
              )}
              
              {/* Profile Image */}
              <div className="relative">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-400 w-10 h-10" />
                  )}
                </div>
              </div>

              {/* Name and Stats */}
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs text-gray-500">
                  {user.totalCorrectAnswers} correct of {user.totalQuestions} questions
                </p>
              </div>

              {/* Success Rate */}
              <div
                className={`flex items-center gap-1 font-semibold px-3 py-1.5 rounded-lg ${
                  isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                }`}
              >
                {user.successRate.toFixed(1)}%
                {isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
              </div>
            </div>
          );
        })}
        
        {users.length > 0 && (
          <div className="pt-2 text-center">
            <button className="text-blue-600 text-sm font-medium hover:underline">
              View All Students
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LastTestResultCard;