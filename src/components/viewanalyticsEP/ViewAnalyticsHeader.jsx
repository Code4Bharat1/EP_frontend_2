"use client";

import { useState, useEffect } from "react";

// Dummy data for each section (remove this as data will be dynamic)
const sectionData = {
  Physics: {
    chartData: [
      { name: "Correct", value: 40, color: "#356CF9" },
      { name: "Not Submitted", value: 9, color: "#E84646" },
      { name: "Incorrect", value: 15, color: "#FF9500" },
    ],
  },
  Chemistry: {
    chartData: [
      { name: "Correct", value: 35, color: "#356CF9" },
      { name: "Not Submitted", value: 10, color: "#E84646" },
      { name: "Incorrect", value: 20, color: "#FF9500" },
    ],
  },
  Biology: {
    chartData: [
      { name: "Correct", value: 25, color: "#356CF9" },
      { name: "Not Submitted", value: 10, color: "#E84646" },
      { name: "Incorrect", value: 30, color: "#FF9500" },
    ],
  },
};

const ViewAnalyticsHeader = ({ selectedSection, setSelectedSection }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const storedSections =
      JSON.parse(localStorage.getItem("selectedSubjects")) || [];
    setSections(storedSections);
  }, []);

  return (
    <div className="w-full flex flex-col items-center p-4 md:p-6">
      {/* Header */}
      <div className="bg-[#49A6CF] text-white text-center text-lg md:text-xl font-semibold p-3 rounded-lg shadow-md md:w-[200px] max-w-md">
        View Analytics
      </div>

      {/* Horizontal Line Below Buttons */}
      <hr className="border-[#CACDD8] border-[1px] w-full mt-4 md:mt-6" />
    </div>
  );
};

export default ViewAnalyticsHeader;
