"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample Data for Different Timeframes
const targetData = {
  "This Year": [
    { title: "Goal", date: "02 February 2025", score: 6 },
    { title: "Weekly Goal", date: "02 February 2025", score: 3 },
    { title: "Today's Goal", date: "02 February 2025", score: 8 },
  ],
  "This Month": [
    { title: "Goal", date: "02 February 2025", score: 5 },
    { title: "Weekly Goal", date: "02 February 2025", score: 7 },
    { title: "Today's Goal", date: "02 February 2025", score: 4 },
  ],
  "This Week": [
    { title: "Goal", date: "02 February 2025", score: 4 },
    { title: "Weekly Goal", date: "02 February 2025", score: 6 },
    { title: "Today's Goal", date: "02 February 2025", score: 5 },
  ],
};

const TargetTrackerCard = ({ selectedFilter }) => {
  const [data, setData] = useState(targetData[selectedFilter]);

  useEffect(() => {
    setData(targetData[selectedFilter]);
  }, [selectedFilter]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-black">Target Tracker</CardTitle>
          <span className="text-[#344BFD] text-sm font-medium">Score</span>
        </div>
        <p className="text-gray-500 text-sm">Daily Average</p>
      </CardHeader>
      <CardContent>
        {data.map((item, index) => {
          const isLow = item.score <= 5;
          const graphImage = isLow ? "/redgraph.png" : "/greengraph.png";

          return (
            <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
              {/* Left Side: Title & Date */}
              <div>
                <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>

              {/* Middle: Graph */}
              <div>
                <Image src={graphImage} alt="Loading Graph..." width={50} height={30} />
              </div>

              {/* Right Side: Score & Arrow */}
              <div className="flex items-center gap-1">
                <span className={`text-md font-semibold ${isLow ? "text-red-500" : "text-green-500"}`}>
                  {item.score}/10
                </span>
                {isLow ? (
                  <ArrowDown className="text-red-500 w-4 h-4" />
                ) : (
                  <ArrowUp className="text-green-500 w-4 h-4" />
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TargetTrackerCard;
