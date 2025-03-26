"use client";

import React, { useState, useEffect } from "react";
import { FaSlidersH, FaMicrophone } from "react-icons/fa";

const GreetingCard = () => {
  const [name, setName] = useState("Ayan Raje!");
  
  // Greeting logic inside a const
  const greeting = (() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Hello Good Morning,";
    } else if (hours < 16) {
      return "Hello Good Afternoon,";
    } else {
      return "Hello Good Evening,";
    }
  })();

  return (
    <div className="flex flex-col md:w-[170vh] h-full space-y-8 p-0 pb-5 md:hidden">
      {/* Greeting Section */}
      <div className="bg-blue-500 text-white rounded-xl shadow-lg p-6 md:h-64">
        {/* Greeting Text */}
        <div className="text-3xl md:text-4xl font-bold">
          {greeting}
          <br />
          {name}
        </div>

        {/* Search Input Section */}
        <div className="flex items-center justify-between bg-gradient-to-b from-[#007AFF] to-[#0F469A] rounded-md mt-8 pl-1 w-[310px] md:w-full py-4 md:mt-8 md:p-3 shadow-md">
          <FaSlidersH className="text-white flex-none md:mr-2 " />
          <input
            type="text"
            placeholder="Search"
            className="flex-grow px-6 py-2 rounded-md bg-white text-gray-700 focus:outline-none"
          />
          <button className="flex-none">
            <FaMicrophone className="text-white mr-2 pl-[2px] md:ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingCard;
