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

const ChapterPerformanceChart = ({ selectedSection }) => {
  const [chapterData, setChapterData] = useState([]);

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

        const chapters = JSON.parse(
          response.data.testResult.chapterWisePerformance || "[]"
        );
        const sectionChapters = chapters.filter((item) =>
          item[0].toLowerCase().includes(selectedSection.toLowerCase())
        );

        setChapterData(
          sectionChapters.map((chapter) => ({
            name: chapter[0],
            correct: chapter[1],
            incorrect: chapter[2],
            skipped: chapter[3],
          }))
        );
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      }
    };

    if (selectedSection) fetchResults();
  }, [selectedSection]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chapterData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="correct" stackId="a" fill="#356CF9" />
        <Bar dataKey="incorrect" stackId="a" fill="#F93535" />
        <Bar dataKey="skipped" stackId="a" fill="#FF9500" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChapterPerformanceChart;
