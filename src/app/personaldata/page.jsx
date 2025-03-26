"use client";
import React from "react";
import Sidebar from "@/components/layout/sidebar/sidebar";
import PersonalData from "@/components/personaldata/personaldata";
import NavBar from "@/components/layout/navbar/navbar";
import BottomNavbar from "@/components/layout/bottomnav/bottomnav";

const Page = () => {
  return (
    <div className="md:flex min-h-screen relative">
      {/* Sidebar for md screens */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:w-5/6 flex flex-col">
        <NavBar />
        
        {/* Main Scrollable Content */}
        <div className="flex-grow overflow-y-auto pb-16">  
          {/* pb-16 ensures space for BottomNavbar */}
          <PersonalData />
        </div>

        {/* Bottom Navbar for mobile screens */}
        <BottomNavbar/>
      </div>
    </div>
  );
};

export default Page;
