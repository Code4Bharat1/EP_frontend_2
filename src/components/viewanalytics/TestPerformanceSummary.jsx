"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const TestPerformanceSummary = ({ selectedSection }) => {
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/fulltest/results`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const performance = JSON.parse(
          response.data.testResult.subjectWisePerformance || "[]"
        );
        const sectionPerformance = performance.find(
          (item) => item[0] === selectedSection
        );

        setTestData([
          { name: "Correct", score: sectionPerformance[1] },
          { name: "Incorrect", score: sectionPerformance[2] },
          { name: "Skipped", score: sectionPerformance[3] },
        ]);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    if (selectedSection) fetchResults();
  }, [selectedSection]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={testData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="score" fill="#0052B4" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TestPerformanceSummary;
