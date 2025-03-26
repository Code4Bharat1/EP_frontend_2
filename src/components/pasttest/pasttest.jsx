"use client";

import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { PieChart, Pie, Cell, Label, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const pastTests = [
  {
    id: 1,
    testName: "Ayaan Raje",
    subjectName: "Physics, Biology",
    time: "30 Min",
    difficulty: "Hard",
    totalQuestions: 64,
    correct: 30,
    wrong: 20,
    missed: 14,
  },
  {
    id: 2,
    testName: "Sample Test",
    subjectName: "Math, Chemistry",
    time: "45 Min",
    difficulty: "Medium",
    totalQuestions: 50,
    correct: 25,
    wrong: 15,
    missed: 10,
  },
  {
    id: 3,
    testName: "Mock Test",
    subjectName: "Biology",
    time: "60 Min",
    difficulty: "Easy",
    totalQuestions: 75,
    correct: 40,
    wrong: 20,
    missed: 15,
  },
  {
    id: 4,
    testName: "Practice Test 1",
    subjectName: "Math, Physics",
    time: "40 Min",
    difficulty: "Medium",
    totalQuestions: 55,
    correct: 28,
    wrong: 17,
    missed: 10,
  },
  {
    id: 5,
    testName: "Mock Exam 2",
    subjectName: "Chemistry, Biology",
    time: "50 Min",
    difficulty: "Hard",
    totalQuestions: 70,
    correct: 35,
    wrong: 25,
    missed: 10,
  },
  {
    id: 6,
    testName: "Final Prep Test",
    subjectName: "Physics, Chemistry",
    time: "35 Min",
    difficulty: "Easy",
    totalQuestions: 60,
    correct: 32,
    wrong: 18,
    missed: 10,
  },
];

const COLORS = ["#356CF9", "#E84646", "#FF9500"];

const PastTest = () => {
  return (
    <div className=" p-6">
      {/* Heading */}
      <div className="flex justify-center items-center">
        {/* Heading */}
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
        {pastTests.map((test, index) => (
          <motion.div
            key={test.id}
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
                      value={test.subjectName}
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
                      value={test.testName}
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
                      value={test.time}
                      readOnly
                      className="block py-2.5 px-0 w-full text-sm text-[#6C727F] bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label className="absolute text-black font-semibold duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600">
                      Time
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-4 group">
                    <input
                      type="text"
                      value={test.difficulty}
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
                <div className="grid grid-cols-2 md:gap-6  text-[14px]">
                  {/* Left - Buttons */}
                  <div className="flex flex-col space-y-2">
                    <Link
                      href="#"
                      className="bg-white text-[11px] md:text-[12px] text-[#6C727F] border border-[#6C727F] flex items-center justify-between px-4 py-3 rounded-lg"
                    >
                      Review Mistake <FaChevronDown />
                    </Link>
                    <Link
                      href="#"
                      className="bg-white text-[11px] md:text-[12px] text-[#6C727F] border border-[#6C727F] flex items-center justify-between px-4 py-3 rounded-lg"
                    >
                      Retake Test <FaChevronDown />
                    </Link>
                    <Link
                      href="#"
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
                        { name: "Wrong", value: test.wrong },
                        { name: "Missed", value: test.missed },
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
                      <Label
                        value={test.totalQuestions}
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
        ))}
      </div>
    </div>
  );
};

export default PastTest;
