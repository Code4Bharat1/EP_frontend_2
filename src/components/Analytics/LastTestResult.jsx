"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUserCircle, FaTrophy, FaMedal } from "react-icons/fa";
import { FiUsers, FiAlertCircle, FiAward } from "react-icons/fi";
import { ArrowUp, Crown } from "lucide-react";

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
          // Take top 10 performers
          .slice(0, 10);

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
      <Card className="w-full max-w-lg min-h-[500px] bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader className="text-center pb-4 border-b border-blue-100">
          <CardTitle className="text-xl font-bold text-[#333B69] flex items-center justify-center gap-3">
            <Crown className="text-yellow-500 w-6 h-6" />
            Top 10 Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center p-4 rounded-xl bg-white/70 animate-pulse border border-blue-100">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 w-24 mb-2 rounded"></div>
                <div className="h-3 bg-gray-200 w-16 rounded"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full max-w-lg min-h-[500px] bg-gradient-to-br from-red-50 to-pink-50 border-0 shadow-lg">
        <CardHeader className="text-center pb-4 border-b border-red-100">
          <CardTitle className="text-xl font-bold text-[#333B69] flex items-center justify-center gap-3">
            <Crown className="text-yellow-500 w-6 h-6" />
            Top 10 Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-96 text-center p-6">
          <FiAlertCircle className="text-red-500 text-5xl mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Data Unavailable</h3>
          <p className="text-gray-600 mb-6 max-w-xs">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg"
          >
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!users || users.length === 0) {
    return (
      <Card className="w-full max-w-lg min-h-[500px] bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader className="text-center pb-4 border-b border-blue-100">
          <CardTitle className="text-xl font-bold text-[#333B69] flex items-center justify-center gap-3">
            <Crown className="text-yellow-500 w-6 h-6" />
            Top 10 Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-96 text-center p-6">
          <FiAward className="text-blue-400 text-5xl mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Results Yet</h3>
          <p className="text-gray-600 max-w-xs">Once students complete tests, top performers will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  // Medal/Trophy icons for rankings
  const getRankIcon = (index) => {
    if (index === 0) return <FaTrophy className="text-yellow-500 text-xl" />;
    if (index === 1) return <FaMedal className="text-gray-400 text-xl" />;
    if (index === 2) return <FaMedal className="text-amber-600 text-xl" />;
    return (
      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold">
        {index + 1}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-lg min-h-[500px] bg-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="text-center pb-4 border-b border-blue-100">
        <CardTitle className="text-xl font-bold text-[#333B69] flex items-center justify-center gap-3">
          <Crown className="text-yellow-500 w-6 h-6" />
          Top 10 Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 overflow-y-auto transparent-scrollbar max-h-[420px] space-y-3">
        {users.map((user, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 border-l-4 ${
              index === 0 
                ? 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white' 
                : index === 1 
                ? 'border-l-gray-400 bg-gradient-to-r from-gray-50 to-white'
                : index === 2
                ? 'border-l-amber-600 bg-gradient-to-r from-orange-50 to-white'
                : 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-white'
            }`}
          >
            {/* Rank Icon */}
            <div className="mr-4">
              {getRankIcon(index)}
            </div>
            
            {/* Profile Image */}
            <div className="relative">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden ring-2 ring-white shadow-md">
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
            <div className="ml-3 flex space-y-2 flex-col items-center ">
              <div className="flex-1 w-full ">
              <h3 className="text-sm font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {user.totalCorrectAnswers} correct of <br/> {user.totalQuestions} questions
              </p>
            </div>

            {/* Success Rate - Always Green with Up Arrow */}
            <div className="flex w-fit items-center  gap-2 font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
              <span className="text-sm">{user.successRate.toFixed(1)}%</span>
              <ArrowUp className="h-4 w-4" />
            </div>
            </div>
          </div>
        ))}
        
        {/* Footer message */}
        {users.length > 0 && (
          <div className="pt-4 text-center">
            <p className="text-xs text-gray-500 font-medium whitespace-nowrap">
              🏆 Showing top {users.length} performers based on performance
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LastTestResultCard;