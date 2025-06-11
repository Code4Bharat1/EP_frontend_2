"use client";
import React from "react";
import TestInterface_CT from "@/components/testinterface/testinterface_CT";
import TestInterfaceMobile from "@/components/testinterfacemobile/testinterfacemobile_CT";
import TestInterface from '@/components/testInterfaceMobileView/testInterface_CT'

const Page = () => {
  return (
    <div>
      {/* Desktop View (TestInterface will be visible) */}
      <div className="hidden md:block">
        <TestInterface_CT />
      </div>

      {/* Mobile View (TestInterfaceMobile will be visible) */}
      <div className="block md:hidden">
        <TestInterface/>
      </div>
    </div>
  );
};

export default Page;
