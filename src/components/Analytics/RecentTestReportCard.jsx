"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiClock, FiHelpCircle } from "react-icons/fi"; // Icons for Bottom Cards

const RecentTestReportCard = () => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* ✅ Main Report Card */}
      <Card className="w-full max-w-md bg-white border border-gray-300 rounded-2xl p-1 md:p-2">
        <CardHeader className="flex items-center justify-between">
          <div className="flex">
            {/* Left Side: Number & Title */}
            <div className="flex items-start gap-5">
              <div className="bg-[#0062FF] text-white w-12 h-12 flex items-center justify-center rounded-lg text-lg font-bold">
                32
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-md font-semibold">
                  Recent Test Report
                </CardTitle>
                <p className="text-gray-600 text-sm">NEET • 02 February 2025</p>
              </div>
            </div>

            {/* Right Side: Mid Risk Badge */}
            <div className="md:ml-[18px] flex items-center text-center w-[85px] justify-center border border-[#FF974A] text-[#FF974A] px-4 py-1 rounded-xl text-[9px] md:text-[10px] font-medium h-8">
              Mid Risk
            </div>
          </div>
        </CardHeader>
        {/* ✅ Horizontal Divider */}
        <div className="border-t border-gray-300 my-3"></div>

        {/* ✅ Test Statistics */}
        <div className="grid grid-cols-4 text-center text-[12px] font-semibold text-gray-700">
          {/* First Row */}
          <div className="border-r border-gray-300 pr-2">
            <p>Mock Test</p>
            <p className="text-[#FC5A5A]">-1.5%</p>
          </div>
          <div className="border-r border-gray-300 px-2">
            <p>Practice Test</p>
            <p className="text-[#3DD598]">+12.0%</p>
          </div>
          <div className="border-r border-gray-300 px-2">
            <p>Mock Test</p>
            <p className="text-[#3DD598]">+15.3%</p>
          </div>
          <div className="pl-2">
            <p>Practice Test</p>
            <p className="text-[#3DD598]">+15.3%</p>
          </div>
        </div>
      </Card>

      {/* ✅ Bottom Two Cards (Side by Side) */}
      <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-md">
        {/* Left Card */}
        <Card className="flex items-center p-4 rounded-3xl shadow-lg bg-white">
          <div className="w-12 h-12 bg-pink-100 flex items-center justify-center rounded-full">
            <FiClock className="text-pink-500 text-xl" />
          </div>
          <div className="ml-3">
            <p className="text-[10px] text-gray-600">Total Time Spent</p>
            <p className="text-lg font-semibold text-gray-800">1,250</p>
          </div>
        </Card>

        {/* Right Card */}
        <Card className="flex items-center p-4 rounded-3xl shadow-lg bg-white">
          <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-full">
            <FiHelpCircle className="text-blue-500 text-xl" />
          </div>
          <div className="ml-3">
            <p className="text-[10px] text-gray-600">Question Attempted</p>
            <p className="text-lg font-semibold">+5.80%</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecentTestReportCard;
