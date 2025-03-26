"use client";

import * as React from "react";
import { Pie, PieChart, Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

// Static yearly performance data
const subjectData = [
  { subject: "Zoology", score: 2.53, fill: "#0062FF" },
  { subject: "Physics", score: 8.45, fill: "#FF974A" },
  { subject: "Chemistry", score: 5.78, fill: "#3DD598" },
  { subject: "Botany", score: 9.34, fill: "#FFC542" },
];

// Total yearly score calculation
const totalScore = subjectData.reduce((acc, curr) => acc + curr.score, 0);

// ✅ Chart Configuration (Fix for Unhandled Runtime Error)
const chartConfig = {
  zoology: {
    label: "Zoology",
    color: "#0062FF",
  },
  physics: {
    label: "Physics",
    color: "#FF974A",
  },
  chemistry: {
    label: "Chemistry",
    color: "#3DD598",
  },
  botany: {
    label: "Botany",
    color: "#FFC542",
  },
};

const SubjectStatisticsCard = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold text-[#333B69]">Subject-wise Statistics</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {/* ✅ Now passing chartConfig to fix error */}
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
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
                          {totalScore.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Score this year
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

      {/* ✅ Subjects in Two Rows */}
      <CardContent className="flex flex-col items-center text-sm font-semibold text-gray-700">
        {/* First Row: Zoology & Physics */}
        <div className="flex justify-center gap-6 w-full">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#0062FF]"></span> Zoology
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF974A]"></span> Physics
          </div>
        </div>

        {/* Second Row: Chemistry & Botany */}
        <div className="flex justify-center gap-6 w-full mt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3DD598]"></span> Chemistry
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFC542]"></span> Botany
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectStatisticsCard;
