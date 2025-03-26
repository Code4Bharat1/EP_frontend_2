"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaClipboardList, FaCheckCircle } from "react-icons/fa"; // Updated Icons

// Sample Data for Different Timeframes
const pendingTestsData = {
  "This Year": [
    { type: "Mock Test", date: "01 February 2025", icon: <FaClipboardList />, bgColor: "bg-yellow-100" },
    { type: "Practice Test", date: "02 February 2025", icon: <FaCheckCircle />, bgColor: "bg-blue-100" },
    { type: "Mock Test", date: "05 February 2025", icon: <FaClipboardList />, bgColor: "bg-pink-100" },
    { type: "Practice Test", date: "08 February 2025", icon: <FaCheckCircle />, bgColor: "bg-teal-100" },
    { type: "Mock Test", date: "12 February 2025", icon: <FaClipboardList />, bgColor: "bg-teal-100" },
    { type: "Practice Test", date: "15 February 2025", icon: <FaCheckCircle />, bgColor: "bg-blue-100" },
    { type: "Mock Test", date: "18 February 2025", icon: <FaClipboardList />, bgColor: "bg-yellow-100" },
    { type: "Practice Test", date: "22 February 2025", icon: <FaCheckCircle />, bgColor: "bg-teal-100" },
  ],
  "This Month": [
    { type: "Practice Test", date: "01 March 2025", icon: <FaCheckCircle />, bgColor: "bg-blue-100" },
    { type: "Mock Test", date: "04 March 2025", icon: <FaClipboardList />, bgColor: "bg-yellow-100" },
    { type: "Mock Test", date: "07 March 2025", icon: <FaClipboardList />, bgColor: "bg-pink-100" },
    { type: "Practice Test", date: "10 March 2025", icon: <FaCheckCircle />, bgColor: "bg-teal-100" },
    { type: "Mock Test", date: "14 March 2025", icon: <FaClipboardList />, bgColor: "bg-teal-100" },
    { type: "Practice Test", date: "18 March 2025", icon: <FaCheckCircle />, bgColor: "bg-blue-100" },
    { type: "Mock Test", date: "22 March 2025", icon: <FaClipboardList />, bgColor: "bg-yellow-100" },
    { type: "Practice Test", date: "25 March 2025", icon: <FaCheckCircle />, bgColor: "bg-teal-100" },
  ],
  "This Week": [
    { type: "Mock Test", date: "Monday, 3 April 2025", icon: <FaClipboardList />, bgColor: "bg-yellow-100" },
    { type: "Practice Test", date: "Tuesday, 4 April 2025", icon: <FaCheckCircle />, bgColor: "bg-blue-100" },
    { type: "Mock Test", date: "Wednesday, 5 April 2025", icon: <FaClipboardList />, bgColor: "bg-pink-100" },
    { type: "Practice Test", date: "Thursday, 6 April 2025", icon: <FaCheckCircle />, bgColor: "bg-teal-100" },
    { type: "Mock Test", date: "Friday, 7 April 2025", icon: <FaClipboardList />, bgColor: "bg-teal-100" },
    { type: "Practice Test", date: "Saturday, 8 April 2025", icon: <FaCheckCircle />, bgColor: "bg-blue-100" },
    { type: "Mock Test", date: "Sunday, 9 April 2025", icon: <FaClipboardList />, bgColor: "bg-yellow-100" },
    { type: "Practice Test", date: "Monday, 10 April 2025", icon: <FaCheckCircle />, bgColor: "bg-teal-100" },
  ],
};

const PendingTestCard = ({ selectedFilter }) => {
  const [data, setData] = useState(pendingTestsData[selectedFilter]);

  useEffect(() => {
    setData(pendingTestsData[selectedFilter]);
  }, [selectedFilter]);

  return (
    <Card className="w-full max-w-md h-96 overflow-hidden">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold text-[#333B69]">Pending Test</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-80">
        {data.map((item, index) => (
          <div key={index} className="flex items-center py-3">
            {/* Icon with Background */}
            <div className={`w-14 h-14 flex items-center justify-center ${item.bgColor} rounded-xl`}>
              {item.icon}
            </div>

            {/* Test Type & Date */}
            <div className="ml-6"> {/* Increased spacing */}
              <h3 className="text-md font-semibold text-gray-800">{item.type}</h3>
              <p className="text-sm text-gray-500">{item.date}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PendingTestCard;
