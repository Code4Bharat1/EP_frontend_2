"use client";
import React from "react";
import TestInterface_plan from "@/components/testinterface/testinterface_plan";
import TestInterfaceMobile from "@/components/testinterfacemobile/testinterfacemobile";

const Page = () => {
  return (
    <div>
      {/* Desktop View (TestInterface will be visible) */}
      <div className="hidden md:block">
        <TestInterface_plan />
      </div>

      {/* Mobile View (TestInterfaceMobile will be visible) */}
      <div className="block md:hidden">
        <TestInterfaceMobile />
      </div>
    </div>
  );
};

export default Page;
