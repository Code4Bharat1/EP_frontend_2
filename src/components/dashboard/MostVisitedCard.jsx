"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample Data for Different Timeframes
const performanceData = {
  "This Year": [
    { name: "Practice Test Taken", value: 81.94, color: "#1E66F5" }, // Blue
    { name: "Speed", value: 81.94, color: "#FFA500" }, // Orange
    { name: "Pending Task", value: 81.94, color: "#FF3B30" }, // Red
  ],
  "This Month": [
    { name: "Practice Test Taken", value: 70.5, color: "#1E66F5" },
    { name: "Speed", value: 45.3, color: "#FFA500" },
    { name: "Pending Task", value: 30.2, color: "#FF3B30" },
  ],
  "This Week": [
    { name: "Practice Test Taken", value: 85.1, color: "#1E66F5" },
    { name: "Speed", value: 60.7, color: "#FFA500" },
    { name: "Pending Task", value: 40.8, color: "#FF3B30" },
  ],
};

const MostVisitedPageCard = ({ selectedFilter }) => {
  const [data, setData] = useState(performanceData[selectedFilter]);

  useEffect(() => {
    setData(performanceData[selectedFilter]);
  }, [selectedFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Visited Page</CardTitle>
        <CardDescription>Overview of most visited sections</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Chart */}
        <PieChart width={200} height={200}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Data Table */}
        <div className="w-full mt-4">
          <div className="flex justify-between border-b pb-2 text-gray-500 text-sm">
            <span>PAGE NAME</span>
            <span>RATE</span>
          </div>
          {data.map((item, index) => (
            <div key={index} className="flex justify-between py-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-gray-700 text-sm">{item.name}</span>
              </div>
              <span
                className={`text-sm font-semibold ${
                  item.value < 50 ? "text-red-500" : "text-green-500"
                }`}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MostVisitedPageCard;
