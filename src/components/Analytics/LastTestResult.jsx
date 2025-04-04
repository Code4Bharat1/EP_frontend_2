"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUserCircle } from "react-icons/fa"; // Fallback icon
import { ArrowUp, ArrowDown } from "lucide-react"; // Arrows for percentage change

const LastTestResultCard = () => {
  const [users, setUsers] = useState([]);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
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
          .filter((user) => user.firstName && user.profileImage) // Only include users with names and profile images
          .map((user) => {
            const totalQuestions = user.testResults.reduce((acc, test) => {
              return (
                acc +
                test.correctAnswers.length +
                test.wrongAnswers.length +
                test.notAttempted.length
              );
            }, 0);

            const totalCorrectAnswers = user.testResults.reduce((acc, test) => {
              return acc + test.correctAnswers.length;
            }, 0);

            const successRate =
              totalQuestions > 0
                ? (totalCorrectAnswers / totalQuestions) * 100
                : 0;

            return { ...user, successRate };
          });

        setUsers(usersWithTestResults);
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response || error.message
        );
      }
    };

    fetchUserData();
  }, []);

  return (
    <Card className="w-full max-w-md h-96 overflow-hidden">
      <CardHeader className="text-center md:text-left">
        <CardTitle className="text-lg font-semibold text-[#333B69]">
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-80 space-y-4">
        {users.map((user, index) => {
          const isPositive = user.successRate >= 50; // Assuming success rate above 50% is positive
          return (
            <div
              key={index}
              className="flex items-center p-4 rounded-2xl bg-white shadow-lg shadow-gray-300 border"
            >
              {/* Profile Image */}
              <div className="relative">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-200">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-500 w-full h-full" />
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="ml-5 flex-1">
                <h3 className="text-md font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </h3>
              </div>

              {/* Success Rate */}
              <div
                className={`flex items-center gap-1 font-semibold ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {user.successRate.toFixed(2)}%
                {isPositive ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LastTestResultCard;
