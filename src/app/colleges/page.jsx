"use client";

import Sidebar from "@/components/layout/sidebar/sidebar";
import NavBar from "@/components/layout/navbar/navbar";
import BottomNavbar from "@/components/layout/bottomnav/bottomnav";
import ToggleBar from "@/components/layout/togglebar/togglebar";
import GreetingCard from "@/components/colleges/GreetingCard";
import ExploreCategories from "@/components/colleges/ExploreCategories";
import PredictionCard from "@/components/colleges/PredictionCard";
import ExploreTopCollegeCards from "@/components/colleges/ExploreTopColleges";


const Page = () => {

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
          <GreetingCard/>
          <ExploreCategories/>
          <PredictionCard/>
          <ExploreTopCollegeCards/>
        </div>

        {/* Bottom Navbar for mobile screens */}
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Page;
