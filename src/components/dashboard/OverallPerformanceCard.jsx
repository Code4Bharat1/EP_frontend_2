"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

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

const OverallPerformanceCard = ({ selectedFilter = "This Year" }) => {
  const [data, setData] = useState([]);
  const [avgPerformance, setAvgPerformance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/testcount`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rawData = response.data;
        const currentDate = new Date();

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

        let labels = [];
        let performanceData = [];

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
          performanceData = labels.map((month, index) => {
            const count = Object.values(rawData).reduce((total, test) => {
              const testDate = new Date(test.updatedAt);
              return (
                total +
                (isSameYear(test.updatedAt) && testDate.getMonth() === index
                  ? 1
                  : 0)
              );
            }, 0);
            return { label: month, performance: count };
          });
        } else if (selectedFilter === "This Month") {
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
          performanceData = labels.map((week, index) => {
            const count = Object.values(rawData).reduce((total, test) => {
              const testDate = new Date(test.updatedAt);
              const weekNumber = Math.floor(testDate.getDate() / 7);
              return (
                total +
                (isSameMonth(test.updatedAt) && weekNumber === index ? 1 : 0)
              );
            }, 0);
            return { label: week, performance: count };
          });
        } else if (selectedFilter === "This Week") {
          labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          performanceData = labels.map((day, index) => {
            const count = Object.values(rawData).reduce((total, test) => {
              const testDate = new Date(test.updatedAt);
              return (
                total +
                (isSameWeek(test.updatedAt) && testDate.getDay() === index
                  ? 1
                  : 0)
              );
            }, 0);
            return { label: day, performance: count };
          });
        }

        // Calculate average performance
        const totalPerformance = performanceData.reduce(
          (sum, item) => sum + item.performance,
          0
        );
        const avgPerformance = totalPerformance / performanceData.length || 0;
        setAvgPerformance(avgPerformance);
        setData(performanceData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load performance data");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilter]);

  if (loading) {
    return (
      <Card className="flex items-center justify-center h-48">
        <CardContent>
          <p className="text-center text-gray-500">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const isImproving = avgPerformance > 50; // Change logic as needed
  const trendPercentage = ((avgPerformance / 100) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Performance</CardTitle>
        <CardDescription>Performance trend over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="performance"
              stroke={isImproving ? "green" : "red"}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div
          className={`flex gap-2 font-medium leading-none ${
            isImproving ? "text-green-500" : "text-red-500"
          }`}
        >
          {isImproving ? "Performance up" : "Performance down"} by{" "}
          {trendPercentage}%
          {isImproving ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing performance trend for <strong>{selectedFilter}</strong>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OverallPerformanceCard;
