"use client";

import { useSearchParams } from "next/navigation"; // Import for retrieving AIR Rank from URL
import { useState, useEffect } from "react";

import Sidebar from "@/components/layout/sidebar/sidebar";
import NavBar from "@/components/layout/navbar/navbar";
import BottomNavbar from "@/components/layout/bottomnav/bottomnav";
import ToggleBar from "@/components/layout/togglebar/togglebar";
import GreetingCard from "@/components/colleges/GreetingCard";
import CollegePredictor from "@/components/collegepredictor/CollegePredictor";


const Page = () => {
  const searchParams = useSearchParams();
  const airRankFromPreviousPage = searchParams.get("airRank"); // Retrieve predicted AIR from URL
  const [predictedAir, setPredictedAir] = useState(airRankFromPreviousPage || ""); // Store AIR Rank state

  useEffect(() => {
    if (airRankFromPreviousPage) {
      setPredictedAir(airRankFromPreviousPage); // Update state when navigating
    }
  }, [airRankFromPreviousPage]);

  return (
    <div className="md:flex min-h-screen relative">
      {/* Sidebar for md screens */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:w-5/6 flex flex-col">
        <ToggleBar />
        <NavBar />

        <div className="mx-1 mt-6 md:mb-0 mb-28 md:mx-10 pb-9">
          {/* Components */}
          <GreetingCard />
          <div className="mx-2 md:mx-12">
            {/* Pass predictedAir as a prop to CollegePredictor */}
            <CollegePredictor predictedAir={predictedAir} />
          </div>
        </div>

        {/* Bottom Navbar for mobile screens */}
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Page;
