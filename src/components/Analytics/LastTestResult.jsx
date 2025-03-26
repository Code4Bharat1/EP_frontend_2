"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUserCircle } from "react-icons/fa"; // Person Icon
import { ArrowUp, ArrowDown } from "lucide-react"; // Arrows for percentage change

// Dummy Test Result Data with Unique Icons & Background Colors
const testResultsData = [
  { name: "Sandesh Dagade", date: "02 February 2025", change: "+16%"},
  { name: "Harsh Koli", date: "02 February 2025", change: "-4%"},
  { name: "Pallavi Patkar", date: "02 February 2025", change: "+25%"},
  { name: "Ishaan Sharma", date: "03 February 2025", change: "+12%"},
  { name: "Riya Mehta", date: "05 February 2025", change: "-7%" },
  { name: "Sara Khan", date: "07 February 2025", change: "+5%" },
];

const LastTestResultCard = () => {
  const [data, setData] = useState(testResultsData);

  return (
    <Card className="w-full max-w-md h-96 overflow-hidden">
      <CardHeader className="text-center md:text-left">
        <CardTitle className="text-lg font-semibold text-[#333B69]">Last Test Result</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-80 space-y-4">
        {data.map((item, index) => {
          const isPositive = item.change.includes("+");
          return (
            <div
              key={index}
              className="flex items-center p-4 rounded-2xl bg-white shadow-lg shadow-gray-300 border"
            >
              {/* Profile Icon & Background */}
              <div className="relative">
                <div className={`w-14 h-14 flex items-center justify-center rounded-full ${item.bgColor}`}>
                  {item.icon}
                </div>
                {/* Profile Icon on top */}
                <FaUserCircle className="absolute top-3 right-2 text-gray-500" size={35} />
              </div>

              {/* Name & Date */}
              <div className="ml-5 flex-1">
                <h3 className="text-md font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>

              {/* Percentage Change */}
              <div className={`flex items-center gap-1 font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {item.change}
                {isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default LastTestResultCard;
