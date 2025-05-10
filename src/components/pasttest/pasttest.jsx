"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { PieChart, Pie, Cell, Label, Tooltip } from "recharts";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const COLORS = [
  "#356CF9",
  "#E84646",
  "#FF9500",
  "#356CF9",
  "#E84646",
  "#FF9500",
];

const PastTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastTests = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Assuming you store the JWT token in localStorage
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/test/pasttest`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTestResults(response.data.testAnalytics);
        console.log(response.data.testAnalytics);
      } catch (err) {
        setError("Failed to fetch past test results");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPastTests();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* Heading */}
      <div className="flex justify-center items-center">
        <div className="text-center w-52 bg-[#49A6CF] text-white py-3 rounded-lg text-xl font-semibold">
          Past Test
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="py-9">
        <div className="border-b-2 border-[#CACDD8] my-4 w-full "></div>
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testResults.length === 0 ? (
          <div>No past tests found.</div>
        ) : (
          testResults.map((test, index) => {
            // Dynamically calculate totalQuestions as the sum of correct, incorrect, and unattempted
            const totalQuestions =
              test.correct + test.incorrect + test.unattempted;
            const testQuestion =
              test.correctAnswersCount +
              test.wrongAnswersCount +
              test.notAttemptedCount;
            return (
              <motion.div
                key={`${test.testName}-${test.subjects.join(",")}-${index}`} // Unique key by combining relevant properties
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="flex flex-col p-5 shadow-md rounded-2xl border-t-0 border-l-4 border-r-4 border-b-[5px] border-[#B1CEFB]">
                  <form>
                    <CardHeader>
                      {/* Subject Name */}
                      <div className="relative z-0 w-full mb-4 group">
                        <input
                          type="text"
                          value={test.subjects ? test.subjects.join(", ") : ""} // Fallback to an empty string
                          readOnly
                          className="block py-2.5 px-0 w-full text-sm text-[#6C727F] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                        />
                        <label className="absolute text-md text-black font-semibold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                          Subject Name
                        </label>
                      </div>

                      {/* Test Name */}
                      <div className="relative z-0 w-full mb-4 group">
                        <input
                          type="text"
                          value={test.testName || ""} // Fallback to an empty string if testName is null or undefined
                          readOnly
                          className="block py-2.5 px-0 w-full text-sm text-[#6C727F] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                        />
                        <label className="absolute text-black font-semibold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                          Test Name
                        </label>
                      </div>
                    </CardHeader>

                    {/* Time & Difficulty */}
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="relative z-0 w-full mb-4 group">
                        <input
                          type="text"
                          value={test.testId || ""} // Fallback to an empty string
                          readOnly
                          className="block py-2.5 px-0 w-full text-sm text-[#6C727F] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                        />
                        <label className="absolute text-black font-semibold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                          Test ID
                        </label>
                      </div>
                      <div
                        className="relative z-0 w-full mb-4 group"
                        style={{ width: "110px" }}
                      >
                        <input
                          type="text"
                          value={test.difficultyLevel || ""} // Fallback to an empty string
                          readOnly
                          className="block py-2.5 px-0 w-full text-[13px] md:text-sm text-[#6C727F] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                        />
                        <label className="absolute text-black font-semibold text-[14px] md:text-[16px] duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                          Difficulty Level
                        </label>
                      </div>
                    </CardContent>

                    {/* Buttons and Graph Section */}
                    <div className="grid grid-cols-2 md:gap-6 text-[14px]">
                      {/* Left - Buttons */}
                      <div className="flex flex-col space-y-2">
                        <Link
                          href={`/review-mistake?test-id=${test.testId}`}  
                          className="bg-white text-[11px] md:text-[12px] text-[#6C727F] border border-[#6C727F] flex items-center justify-between px-4 py-3 rounded-lg"
                        >
                          Review Mistake <FaChevronDown />
                        </Link>
                        <Link
                          href="/analytics"
                          className="bg-white text-[11px] md:text-[12px] text-[#6C727F] border border-[#6C727F] flex items-center justify-between px-4 py-3 rounded-lg"
                        >
                          View Analytics <FaChevronDown />
                        </Link>
                      </div>

                      {/* Right - Graph */}
                      <PieChart width={150} height={150}>
                        <Pie
                          data={[ 
                            { name: "Correct", value: test.correct },
                            { name: "Wrong", value: test.incorrect },
                            { name: "Missed", value: test.unattempted },
                            { name: "Correct", value: test.correctAnswersCount },
                            { name: "Wrong", value: test.wrongAnswersCount },
                            { name: "Missed", value: test.notAttemptedCount },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill={COLORS[0]} />
                          <Cell fill={COLORS[1]} />
                          <Cell fill={COLORS[2]} />
                          <Cell fill={COLORS[3]} />
                          <Cell fill={COLORS[4]} />
                          <Cell fill={COLORS[5]} />
                          <Label
                            value={totalQuestions || testQuestion}
                            position="center"
                            className="text-lg font-bold fill-gray-900"
                            dy={-10}
                          />
                          <Label
                            value="Total Questions"
                            position="center"
                            className="text-[10px] fill-gray-500"
                            dy={10}
                          />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </div>
                  </form>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PastTest;
