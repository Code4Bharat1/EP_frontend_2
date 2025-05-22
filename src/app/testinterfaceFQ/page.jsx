"use client";
import React from "react";
import TestInterface_FQ from "@/components/testinterface/testinterface_FQ";

const Page = () => {
  return (
    <div>
      {/* Desktop View (TestInterface will be visible) */}
      <div className="hidden md:block">
        <TestInterface_FQ />
      </div>
    </div>
  );
};

export default Page;
