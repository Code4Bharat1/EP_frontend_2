"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";

const MostVisitedPageCard = ({ selectedFilter }) => {
  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Filter the data based on the selected timeframe
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

        const filterByDate = (tests, filterFunc) => {
          return tests && tests.updatedAt && filterFunc(tests.updatedAt);
        };

        let filteredData = [];
        switch (selectedFilter) {
          case "This Year":
            filteredData = [
              rawData.fullTestResults,
              rawData.recommendedTests,
              rawData.meTests,
            ].filter((test) => filterByDate(test, isSameYear));
            break;
          case "This Month":
            filteredData = [
              rawData.fullTestResults,
              rawData.recommendedTests,
              rawData.meTests,
            ].filter((test) => filterByDate(test, isSameMonth));
            break;
          case "This Week":
            filteredData = [
              rawData.fullTestResults,
              rawData.recommendedTests,
              rawData.meTests,
            ].filter((test) => filterByDate(test, isSameWeek));
            break;
          default:
            filteredData = [
              rawData.fullTestResults,
              rawData.recommendedTests,
              rawData.meTests,
            ];
        }

        const totalTests = filteredData.reduce(
          (acc, test) => acc + test.totalTests,
          0
        );

        // Prepare the data for the graph and table
        const formattedData = filteredData.map((test) => ({
          name: test.tableName,
          value: ((test.totalTests / totalTests) * 100).toFixed(2), // Total Tests as percentage
          color:
            test.tableName === "FullTestResults"
              ? "#1E66F5"
              : test.tableName === "RecommendedTest"
              ? "#FFA500"
              : "#FF3B30",
        }));

        setData(formattedData);

        // Prepare the graph data (showing total attempted percentage)
        const graphFormattedData = filteredData.map((test) => ({
          name: test.tableName,
          value: test.totalTests,
          color:
            test.tableName === "FullTestResults"
              ? "#1E66F5"
              : test.tableName === "RecommendedTest"
              ? "#FFA500"
              : "#FF3B30",
        }));

        setGraphData(graphFormattedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to load test statistics");
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedFilter]);

  if (loading)
    return <div className="text-center text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Statistics</CardTitle>
        <CardDescription>
          Overview of test data based on selection
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Chart */}
        <PieChart width={200} height={200}>
          <Pie
            data={graphData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            paddingAngle={2}
          >
            {graphData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Data Table */}
        <div className="w-full mt-4">
          <div className="flex justify-between border-b pb-2 text-gray-500 text-sm">
            <span>TEST NAME</span>
            <span>TOTAL TESTS (%)</span>
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
