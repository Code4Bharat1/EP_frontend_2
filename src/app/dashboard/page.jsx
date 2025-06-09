"use client";
import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import Sidebar from "@/components/layout/sidebar/sidebar";
import NavBar from "@/components/layout/navbar/navbar";
import BottomNavbar from "@/components/layout/bottomnav/bottomnav";
import Hero from "@/components/dashboard/hero";
import ToggleBar from "@/components/layout/togglebar/togglebar";
import Overview from "@/components/overview/overview";
import SpeedCard from "@/components/dashboard/SpeedCard";
import AccuracyCard from "@/components/dashboard/AccuracyCard";
import SuccessRateCard from "@/components/dashboard/SuccessRateCard";
import OverallPerformanceCard from "@/components/dashboard/OverallPerformanceCard";
import MostVisitedPageCard from "@/components/dashboard/MostVisitedCard";
import PerformanceSummaryCard from "@/components/dashboard/PerformanceSummaryCard";
import jsPDF from "jspdf";
import Chatbot from "@/components/chatbot/chatbot";

const Page = () => {
  const [selectedFilter, setSelectedFilter] = useState("This Year");

  // Reference for capturing only the required section
  const captureRef = useRef(null);

  // Function to capture only the dashboard content (excluding Sidebar, Hero, Navbar, etc.)
  const handleDownload = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // Download as Image
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "dashboard_report.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optionally, download as PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("Dashboard_Report.pdf");
    }
  };

  return (  
    <div className="md:flex min-h-screen relative bg-white">
      {/* Sidebar for md screens (Excluded from Snapshot) */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:w-5/6 flex flex-col">
        {/* Excluded Components */}
          <Chatbot/>
        <ToggleBar />
        <NavBar />
        <Hero selectedFilter={selectedFilter} />

        {/* Overview Section (Pass Download Function) */}

        <div className="md:mx-4">
          <Overview
            setSelectedFilter={setSelectedFilter}
            handleDownload={handleDownload}
          />
        </div>
        {/* Snapshot Area Starts Here */}
        <div ref={captureRef} className="bg-white w-full">
          {/* Updated Grid Layout: 3 Columns in Medium Screens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4  mt-6">
            <SpeedCard changeDate={selectedFilter} />
            <AccuracyCard selectedFilter={selectedFilter} />
            <SuccessRateCard selectedFilter={selectedFilter} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4 mt-6">
            <OverallPerformanceCard selectedFilter={selectedFilter} />
            <MostVisitedPageCard selectedFilter={selectedFilter} />
            <PerformanceSummaryCard selectedFilter={selectedFilter} />
          </div>
        </div>
        {/* Snapshot Area Ends Here */}

        {/* Bottom Navbar for mobile screens (Excluded from Snapshot) */}
        <BottomNavbar selectedFilter={selectedFilter} />
      </div>
    </div>
  );
};

export default Page;
