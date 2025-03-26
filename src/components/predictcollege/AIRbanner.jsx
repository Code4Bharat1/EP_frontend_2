"use client";

import React from "react";

const AIRBanner = () => {
  // Define constants for name and rank
  const name = "Basim"; // Replace with your desired name
  const rank = 1458; // Replace with your desired rank

  return (
    <div className="hidden md:flex w-full items-center justify-center bg-gradient-to-b from-[#ADE8F4] to-[#0077B6] rounded-lg p-4 border border-gray-300 shadow-sm my-2">
      {/* Medal Image Section */}
      <div className="flex-shrink-0 mr-4">
        <img
          src="/medal.png" // Replace with the path to your image
          alt="Medal"
          className="w-20 h-20"
        />
      </div>

      {/* Text Section */}
      <div className="text-center text-[20px] font-extrabold">
        <p className="text-white font-semibold ">
          Hi <span className="font-bold">{name}</span>, your target AIR is <span className="font-bold">{rank}</span>
        </p>
        <p className="text-white font-medium">
          & <br /> Colleges Predicted for AIR in 2024 is
        </p>
      </div>
    </div>
  );
};

export default AIRBanner;
