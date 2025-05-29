
import React, { useState, useEffect } from "react";
import { Pie, PieChart, Label, Cell, ResponsiveContainer } from "recharts";
import { FiTrendingUp, FiAlertCircle, FiCalendar, FiClock, FiBookOpen } from "react-icons/fi";

// Chart Configuration for Physics, Chemistry, and Biology
const chartConfig = {
  physics: {
    label: "Physics",
    color: "#FF6B6B",
  },
  chemistry: {
    label: "Chemistry",
    color: "#4ECDC4",
  },
  biology: {
    label: "Biology",
    color: "#45B7D1",
  },
};

const SubjectStatisticsCard = ({ selectedFilter = "This Week" }) => {
  const [subjectData, setSubjectData] = useState([
    { subject: "Physics", score: 85, fill: "#FF6B6B" },
    { subject: "Chemistry", score: 92, fill: "#4ECDC4" },
    { subject: "Biology", score: 78, fill: "#45B7D1" },
  ]);
  const [totalScore, setTotalScore] = useState(255);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate percentage for the total score
  const percentage = totalScore > 0 ? (totalScore / 300) * 100 : 0;

  // Loading state
  if (loading) {
    return (
      <div className="relative border-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl p-6 shadow-xl  border-white/20 backdrop-blur-sm h-[450px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <FiTrendingUp className="text-white text-xl" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Subject-wise Statistics
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center mt-12">
            <div className="animate-pulse">
              <div className="rounded-full bg-gradient-to-r from-gray-200 to-gray-300 h-[200px] w-[200px] mb-6"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-32 mx-auto"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative border-4 bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-2xl p-6 shadow-xl border-white/20 backdrop-blur-sm h-[450px]">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-600/5 rounded-2xl"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          <div className="p-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-4">
            <FiAlertCircle size={32} className="text-white" />
          </div>
          <p className="text-gray-700 mb-4 font-medium">{error}</p>
          <button 
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );

  const hasData = subjectData.length > 0;

  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-xl border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 h-[450px]">
      {/* Gradient Overlay */}
      <div className="absolute inset-0  rounded-2xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
            <FiTrendingUp className="text-white text-xl" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Subject-wise Statistics
          </h3>
        </div>

        {hasData ? (
          <div className="flex flex-col items-center">
            {/* Pie Chart */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    dataKey="score"
                    nameKey="subject"
                    innerRadius={75}
                    outerRadius={95}
                    strokeWidth={3}
                    stroke="#fff"
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
                                className="fill-gray-800 text-3xl font-bold"
                              >
                                {percentage.toFixed(1)}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-gray-500 text-sm font-medium"
                              >
                                Overall Score
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              {subjectData.map((subject, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: subject.fill }}
                  ></div>
                  <span className="text-gray-700 font-medium text-sm">{subject.subject}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8">
              {subjectData.map((subject, index) => (
                <div key={index} className="text-center">
                  <p className="text-xs text-gray-500 font-medium mb-1">{subject.subject}</p>
                  <p className="text-2xl font-bold" style={{ color: subject.fill }}>
                    {subject.score}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center mb-4 shadow-inner">
              <FiTrendingUp size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold mb-2">No data for this period</p>
            <p className="text-sm text-gray-500">Complete tests to see subject-wise statistics</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SubjectStatisticsCard;