"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar/sidebar";
import NavBar from "@/components/layout/navbar/navbar";
import BottomNavbar from "@/components/layout/bottomnav/bottomnav";
import ToggleBar from "@/components/layout/togglebar/togglebar";
import ViewAnalyticsHeader from "@/components/viewanalytics/ViewAnalyticsHeader";
import TestReportChart from "@/components/viewanalytics/TestReportCard";
import TestPerformanceSummary from "@/components/viewanalytics/TestPerformanceSummary";
import ChapterPerformanceChart from "@/components/viewanalytics/ChapterPerformanceChart";

// Dummy data for each section
const sectionData = {
  Physics: {
    chartData: [
      { name: "Done", value: 40, color: "#356CF9" },
      { name: "Overdue work", value: 9, color: "#E84646" },
      { name: "Work finished late", value: 15, color: "#FF9500" },
    ]
  },
  Chemistry: {
    chartData: [
      { name: "Done", value: 35, color: "#356CF9" },
      { name: "Overdue work", value: 10, color: "#E84646" },
      { name: "Work finished late", value: 20, color: "#FF9500" },
    ]
  },
  Biology: {
    chartData: [
      { name: "Done", value: 25, color: "#356CF9" },
      { name: "Overdue work", value: 10, color: "#E84646" },
      { name: "Work finished late", value: 30, color: "#FF9500" },
    ]
  },
  Botany: {
    chartData: [
      { name: "Done", value: 45, color: "#356CF9" },
      { name: "Overdue work", value: 5, color: "#E84646" },
      { name: "Work finished late", value: 10, color: "#FF9500" },
    ]
  }
};

const Page = () => {
  const [selectedSection, setSelectedSection] = useState("Physics");

  return (
    <div className="md:flex min-h-screen relative">
      {/* Sidebar for md screens */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:w-5/6 flex flex-col">
        <ToggleBar />
        <NavBar />

        <div className="mx-4 mt-6 md:mb-0 mb-2">
          {/* Components */}
          <ViewAnalyticsHeader selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
        </div>

        {/* Recent Cards - Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mx-7 md:mx-56 my-14">
          <TestReportChart chartData={sectionData[selectedSection].chartData} />
          <TestPerformanceSummary selectedSection={selectedSection} />
        </div>

        {/* Chapter Wise Performance */}
        <div className="md:w-full md:m-0 mx-4 pb-20">
          <ChapterPerformanceChart selectedSection={selectedSection} />
        </div>

        {/* Bottom Navbar for mobile screens */}
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Page;
