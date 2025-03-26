"use client";

import Sidebar from "@/components/layout/sidebar/sidebar";
import NavBar from "@/components/layout/navbar/navbar";
import BottomNavbar from "@/components/layout/bottomnav/bottomnav";
import ToggleBar from "@/components/layout/togglebar/togglebar";
import PredictAIR from "@/components/airprediction/AirPrediction";



const Page = () => {

    return (
      <div className="md:flex min-h-screen relative">
        {/* Sidebar for md screens */}
        <Sidebar />
  
        {/* Main Content */}
        <div className="w-full flex flex-col" >
          <ToggleBar />
          <NavBar />
  
          <div className="w-full  mx-4 mt-16 md:mb-0 mb-28">
            {/* Components */}
            <PredictAIR/>
          </div>
  
          {/* Bottom Navbar for mobile screens */}
          <BottomNavbar />
        </div>
      </div>
    );
  };
  
  export default Page;