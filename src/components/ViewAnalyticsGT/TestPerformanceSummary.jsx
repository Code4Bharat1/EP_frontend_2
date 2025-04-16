"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const TestPerformanceSummary = () => {
  const [selectedSection, setSelectedSection] = useState("Physics"); // To track the selected subject
  const [selectedData, setSelectedData] = useState([]); // To store the data to be shown on the chart
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const studentId = localStorage.getItem("authToken"); // Fetch studentId from localStorage

  // Fetch test data dynamically from the backend
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/createtest/viewanalytics`,
          {
            headers: { Authorization: `Bearer ${studentId}` },
          }
        );
        const data = response.data.testAnalytics;

        if (data.length > 0) {
          const firstTestSubjects = Object.keys(data[0].subjectWiseMarks); // Get the subjects from the first test
          setSubjects(firstTestSubjects); // Set the subjects for the dropdown

          // Format the data for the selected subject
          const formattedData = data.map((test) => ({
            name: test.testName,
            score: test.subjectWiseMarks[selectedSection] || 0, // Use the score of the selected subject
            avg: test.subjectWiseMarks[selectedSection] || 0, // You can calculate the average if you want
          }));

          setSelectedData(formattedData);
        }
      } catch (err) {
        setError("Error fetching test data");
        console.error(err);
      }
    };

    if (studentId) {
      fetchTestData();
    } else {
      setError("Unauthorized: No student ID found");
    }
  }, [studentId, selectedSection]); // Re-fetch data when selectedSection changes

  // Handle subject change from the dropdown
  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  // Check if there's data to display
  if (!selectedData.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm flex flex-col mx-auto">
        <p>No data available for the selected subject</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full flex flex-col mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold text-[#2E3A59]">
          Performance Summary
        </h2>

        {/* Dropdown for selecting subject */}
        <select
          value={selectedSection}
          onChange={handleSectionChange}
          className="border outline-none border-gray-300 rounded px-3 py-1 text-black"
        >
          {subjects.length > 0 &&
            subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
        </select>
      </div>

      {/* Chart */}
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={selectedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }} // Reduced font size for better fit
              angle={0} // Rotates labels for visibility
              dy={6} // Moves labels down
              interval={0} // Ensures no labels are skipped
            />
            <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="score"
              fill="#0052B4"
              barSize={40}
              radius={[50, 50, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#008080"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TestPerformanceSummary;
