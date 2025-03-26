"use client";

import React from "react";
import Link from "next/link";

const ExploreCategories = () => {
  return (
    <div className="w-full p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Explore categories</h2>
        <Link href="#" className="text-[#4D8AF0] text-lg font-medium">
          See all
        </Link>
      </div>

      {/* Category Grid (Only one card for NEET) */}
      <div className="flex justify-start mt-6">
        <div className="bg-white shadow-md rounded-xl w-32 md:w-40 h-32 md:h-40 flex items-center justify-center text-lg font-semibold">
          NEET
        </div>
      </div>
    </div>
  );
};

export default ExploreCategories;
