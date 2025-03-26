"use client";
import React, { useState } from "react";
import Sidebar from "@/components/layout/sidebar/sidebar";
import NavBar from "@/components/layout/navbar/navbar";
import BottomNavbar from "@/components/layout/bottomnav/bottomnav";
import Hero from "@/components/dashboard/hero";
import ToggleBar from "@/components/layout/togglebar/togglebar";
import Overview from "@/components/overview/overview";
import TargetTrackerCard from "@/components/Analytics/TargetTracker";
import PendingTestCard from "@/components/Analytics/PendingTestCard";
import SubjectStatisticsCard from "@/components/Analytics/SubjectStatisticsCard";
import LastTestResultCard from "@/components/Analytics/LastTestResult";
import UpcomingActivitiesCard from "@/components/Analytics/UpcomingActivitiesCard";
import RecentTestReportCard from "@/components/Analytics/RecentTestReportCard";
import TestCards from "@/components/TestSelection/TestCards";
import ScheduledTestCard from "@/components/TestSelection/ScheduledTestCard";

const Page = () => {
  const [selectedFilter, setSelectedFilter] = useState("This Year");

  return (
    <div className="md:flex min-h-screen relative">
      {/* Sidebar for md screens */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:w-5/6 flex flex-col">
        <ToggleBar />
        <NavBar />

        <Hero selectedFilter={selectedFilter} />

        {/* Updated Grid Layout: 3 Columns in Medium Screens */}
        <div className="mx-4 md:mt-6">
          <TestCards/>
        </div>
        <div className="mx-4 md:mt-6">
          <ScheduledTestCard/>
        </div>

        {/* Bottom Navbar for mobile screens */}
        <BottomNavbar selectedFilter={selectedFilter} />
      </div>
    </div>
  );
};

export default Page;

 