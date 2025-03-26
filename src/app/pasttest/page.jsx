"use client";

import Sidebar from "@/components/layout/sidebar/sidebar";
import NavBar from "@/components/layout/navbar/navbar";
import BottomNavbar from "@/components/layout/bottomnav/bottomnav";
import ToggleBar from "@/components/layout/togglebar/togglebar";
import TestEnterHero from "@/components/entertest/TestEnterHero";
import TestEnterCards from "@/components/entertest/TestEnterCards";
import PastTest from "@/components/pasttest/pasttest";

const Page = () => {

  return (
    <div className="md:flex min-h-screen relative">
      {/* Sidebar for md screens */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:w-5/6 flex flex-col">
        <ToggleBar />
        <NavBar />

        <div className="mx-4 mt-6 md:mb-0 mb-28 md:mx-10">
          {/* Components */}
          <PastTest/>
        </div>

        {/* Bottom Navbar for mobile screens */}
        <BottomNavbar />
      </div>
    </div>
  );
};

export default Page;
