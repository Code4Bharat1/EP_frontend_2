"use client";

import { useState } from "react"; // Removed unnecessary `useEffect` import
import { Suspense } from "react"; // Suspense is already imported, so no need for a duplicate import
import Sidebar from "@/components/layout/sidebar/sidebar";
import NavBar from "@/components/layout/navbar/navbar";
import BottomNavbar from "@/components/layout/bottomnav/bottomnav";
import ToggleBar from "@/components/layout/togglebar/togglebar";
import GreetingCard from "@/components/colleges/GreetingCard";
import CollegePredictor from "@/components/collegepredictor/CollegePredictor";
import SearchParamFetcher from "@/components/collegepredictor/SearchParamFetcher";

const Page = () => {
  const [predictedAir, setPredictedAir] = useState(""); // Default to empty string

  return (
    <div className="md:flex min-h-screen relative">
      {/* Sidebar for md screens */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:w-5/6 flex flex-col">
        <ToggleBar />
        <NavBar />

        <div className="mx-1 mt-6 md:mb-0 mb-28 md:mx-10 pb-9">
          <GreetingCard />
          <div className="mx-2 md:mx-12">
            {/* Suspense added to handle client-side rendering */}
            <Suspense fallback={<div>Loading...</div>}>
              <SearchParamFetcher setPredictedAir={setPredictedAir} /> {/* Fetch search param and update state */}
              <CollegePredictor predictedAir={predictedAir} />
            </Suspense>
          </div>
        </div>

        {/* Bottom Navbar for mobile screens */}
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Page;
