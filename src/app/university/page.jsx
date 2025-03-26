"use client";
import NavBar from '@/components/layout/navbar/navbar';
import Sidebar from '@/components/layout/sidebar/sidebar';
import ToggleBar from '@/components/layout/togglebar/togglebar';
import University from '@/components/desktopuniversity/university';
import React from 'react'
import UniversityMobile from '@/components/mobileuniversity/university';
import AcademicOfferings from '@/components/desktopacademicofferings/academicofferings';
import AcademicOfferingsMobile from '@/components/mobileacademicofferings/academicofferings';
import Whatour from '@/components/desktopwhat-our/what-our';
import PlacementChart from '@/components/desktopplacementrecords/placementrecords';
import CampusInsights from '@/components/desktopcampusinsights/campusinsights';
import CampusInsight from '@/components/mobilecampusinsights/campusinsights';
import StatsComponent from '@/components/desktopboxes/desktopboxes';
import BottomNavbar from '@/components/layout/bottomnav/bottomnav';

function page() {
  return (
   

<div className="md:flex min-h-screen relative">
      {/* Sidebar for md screens */}
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:w-5/6 flex flex-col min-h-screen">
        <ToggleBar />
        <NavBar />

       {/* Desktop View - University */}
       <div className="hidden md:block">
        < University />
        </div>

       {/* mobile View - University */}
       <div className="block md:hidden">
        < UniversityMobile />
        </div>


        {/* Desktop View - AcademicOfferings */}
       <div className="hidden md:block">
        < AcademicOfferings />
        </div>


        {/* mobile View - AcademicOfferingsMobile */}
       <div className="block md:hidden">
        < AcademicOfferingsMobile />
        </div>

         {/* Desktop View - Whatour */}
       <div className="hidden md:block">
         < Whatour />
        </div>

        {/* mobile View - Whatour */}
       <div className="block md:hidden">
        < Whatour />
        </div>

          {/* Desktop View - PlacementChart */}
       <div className="hidden md:block">
         < PlacementChart />
        </div>

        {/* mobile View - PlacementChart */}
       <div className="block md:hidden">
        < PlacementChart />
        </div>

         {/* Desktop View - campusinsights */}
       <div className="hidden md:block">
         < CampusInsights />
        </div>

        {/* mobile View - campusinsights */}
       <div className="block md:hidden">
        < CampusInsight />
        </div>

        {/* Desktop View - StatsComponent */}
       <div className="hidden md:block">
         <StatsComponent />
        </div>

         {/* mobile View - campusinsights */}
       <div className="block md:hidden">
         < BottomNavbar />
        </div>


    </div>
  </div>
  )
}

export default page