"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Pie, PieChart, Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import axios from "axios";

// Chart Configuration for Physics, Chemistry, and Biology
const chartConfig = {
  physics: {
    label: "Physics",
    color: "#FF974A",
  },
  chemistry: {
    label: "Chemistry",
    color: "#3DD598",
  },
  biology: {
    label: "Biology",
    color: "#FFC542",
  },
};

const SubjectStatisticsCard = ({ selectedFilter }) => {
  const [subjectData, setSubjectData] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/success`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rawData = response.data;
        const currentDate = new Date();

        // Helper functions to check the same year, month, or week
        const isSameYear = (date) =>
          new Date(date).getFullYear() === currentDate.getFullYear();
        const isSameMonth = (date) =>
          isSameYear(date) &&
          new Date(date).getMonth() === currentDate.getMonth();
        const isSameWeek = (date) => {
          const testDate = new Date(date);
          const weekStart = new Date(currentDate);
          weekStart.setDate(currentDate.getDate() - currentDate.getDay());
          return testDate >= weekStart;
        };

        let filtered = [];
        let labels = [];

        if (selectedFilter === "This Year") {
          labels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          filtered = rawData.filter((item) => isSameYear(item.updatedAt));
        } else if (selectedFilter === "This Month") {
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
          filtered = rawData.filter((item) => isSameMonth(item.updatedAt));
        } else if (selectedFilter === "This Week") {
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          filtered = rawData.filter((item) => isSameWeek(item.updatedAt));
        }

        // Calculate total marks for each subject (Physics, Chemistry, Biology)
        const calculateTotalMarks = (filteredData) => {
          const total = { Physics: 0, Chemistry: 0, Biology: 0 };
          filteredData.forEach((item) => {
            total.Physics += item.Physics || 0;
            total.Chemistry += item.Chemistry || 0;
            total.Biology += item.Biology || 0;
          });
          return total;
        };

        const totalMarks = calculateTotalMarks(filtered);
        const total =
          totalMarks.Physics + totalMarks.Chemistry + totalMarks.Biology;
        setTotalScore(total);

        // Update chart data for Pie Chart
        const formattedData = [
          { subject: "Physics", score: totalMarks.Physics, fill: "#FF974A" },
          {
            subject: "Chemistry",
            score: totalMarks.Chemistry,
            fill: "#3DD598",
          },
          { subject: "Biology", score: totalMarks.Biology, fill: "#FFC542" },
        ];

        setSubjectData(formattedData);
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    fetchData();
  }, [selectedFilter]);

  // Calculate percentage for the total score
  const percentage = totalScore > 0 ? (totalScore / 1000) * 100 : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold text-[#333B69]">
          Subject-wise Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {/* ChartContainer with Pie Chart */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie
              data={subjectData}
              dataKey="score"
              nameKey="subject"
              innerRadius={84} // Adjusted for thin bars
              outerRadius={90} // Keeps bars thin
              strokeWidth={4} // Reduced stroke width
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {percentage.toFixed(2)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Score
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* Subject List */}
      <CardContent className="flex flex-col items-center text-sm font-semibold text-gray-700">
        {/* First Row: Physics and Chemistry */}
        <div className="flex justify-center gap-6 w-full">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF974A]"></span> Physics
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3DD598]"></span>{" "}
            Chemistry
          </div>
        </div>

        {/* Second Row: Biology */}
        <div className="flex justify-center gap-6 w-full mt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFC542]"></span> Biology
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectStatisticsCard;
