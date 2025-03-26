"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Dummy performance data for different timeframes
const performanceData = {
  "This Year": {
    physics: 85,
    chemistry: 90,
    biology: 87,
    prevPerformance: 88,
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  },
  "This Month": {
    physics: 80,
    chemistry: 85,
    biology: 83,
    prevPerformance: 84,
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  },
  "This Week": {
    physics: 100,
    chemistry: 100,
    biology: 78,
    prevPerformance: 79,
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
};

const OverallPerformanceCard = ({ selectedFilter = "This Year" }) => {
  const [data, setData] = useState(performanceData[selectedFilter] || {});
  const [avgPerformance, setAvgPerformance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (performanceData[selectedFilter]) {
      setLoading(true);
      setData(performanceData[selectedFilter]); // Update data dynamically
      setLoading(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
    if (data && data.physics !== undefined) {
      setAvgPerformance(
        Math.round((data.physics + data.chemistry + data.biology) / 3)
      );
    }
  }, [data]);

  if (loading) {
    return (
      <Card className="flex items-center justify-center h-48">
        <CardContent>
          <p className="text-center text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  // Check performance trend
  const isImproving = avgPerformance > (data?.prevPerformance || 0);
  const trendPercentage = (
    ((avgPerformance - (data?.prevPerformance || 1)) / (data?.prevPerformance || 1)) *
    100
  ).toFixed(1);

  // Convert data for Recharts
  const chartData =
    data?.labels?.map((label, index) => ({
      label,
      performance: avgPerformance + (index % 2 === 0 ? -2 : 3),
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Performance</CardTitle>
        <CardDescription>Performance trend over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ theme: "light", color: "blue" }}> 
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              config={{ theme: "light", color: "blue" }} 
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="performance"
              type="linear"
              stroke={isImproving ? "green" : "red"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div
          className={`flex gap-2 font-medium leading-none ${
            isImproving ? "text-green-500" : "text-red-500"
          }`}
        >
          {isImproving ? "Performance up" : "Performance down"} by {trendPercentage}%
          {isImproving ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing performance trend for <strong>{selectedFilter}</strong>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OverallPerformanceCard;
