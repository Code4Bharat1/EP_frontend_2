"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Pie, PieChart, Label, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import axios from "axios";
import { FiTrendingUp, FiAlertCircle } from "react-icons/fi";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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
          { subject: "Chemistry", score: totalMarks.Chemistry, fill: "#3DD598" },
          { subject: "Biology", score: totalMarks.Biology, fill: "#FFC542" },
        ];

        setSubjectData(formattedData.filter(item => item.score > 0));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subject data:", error);
        setError("We couldn't load your subject statistics at the moment.");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilter]);

  // Calculate percentage for the total score
  const percentage = totalScore > 0 ? (totalScore / 1000) * 100 : 0;

  // Loading and error states
  if (loading) {
    return (
      <Card className="flex flex-col h-[350px] border border-gray-200 shadow-sm bg-white">
        <CardHeader className="items-center pb-2">
          <CardTitle className="text-lg font-semibold text-[#333B69]">
            Subject-wise Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-[180px] w-[180px] mb-4"></div>
            <div className="h-2 bg-gray-200 rounded w-24 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col h-[350px] border border-gray-200 shadow-sm bg-white">
        <CardHeader className="items-center pb-2">
          <CardTitle className="text-lg font-semibold text-[#333B69]">
            Subject-wise Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
          <FiAlertCircle size={40} className="text-amber-500 mb-4" />
          <p className="text-gray-600 mb-2">{error}</p>
          <button 
            className="text-blue-600 font-medium mt-2 hover:underline"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </CardContent>
      </Card>
    );
  }

  // Check if we have data to display
  const hasData = subjectData.length > 0;

  return (
    <Card className="flex flex-col h-[350px] border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold text-[#333B69] flex items-center gap-2">
          <FiTrendingUp className="text-blue-500" />
          Subject-wise Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {hasData ? (
          /* ChartContainer with Pie Chart */
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[220px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectData}
                  dataKey="score"
                  nameKey="subject"
                  innerRadius={84}
                  outerRadius={90}
                  strokeWidth={4}
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
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
                              {percentage.toFixed(1)}%
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
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[220px] text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FiTrendingUp size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No data for this period</p>
            <p className="text-sm text-gray-400 mt-1">Complete tests to see subject-wise statistics</p>
          </div>
        )}
      </CardContent>

      {/* Subject Legend */}
      <CardContent className="pt-3">
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF974A]"></span>
            <span className="text-gray-700">Physics</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3DD598]"></span>
            <span className="text-gray-700">Chemistry</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFC542]"></span>
            <span className="text-gray-700">Biology</span>
          </div>
        </div>

        {/* Stats in a line */}
        {hasData && (
          <div className="flex justify-evenly mt-4">
            {subjectData.map((subject, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-500">{subject.subject}</p>
                <p className="font-bold" style={{ color: subject.fill }}>
                  {subject.score}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubjectStatisticsCard;