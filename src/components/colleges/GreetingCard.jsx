"use client";

import { useEffect, useState } from "react";
import { FaBell, FaSlidersH, FaMicrophone } from "react-icons/fa";

const GreetingCard = () => {
  const [name] = useState("Basim Thakur!");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    setGreeting(
      hours < 12
        ? "Hello Good Morning,"
        : hours < 16
        ? "Hello Good Afternoon,"
        : "Hello Good Evening,"
    );
  }, []);

  return (
    <div className="flex flex-col space-y-8 p-4 pb-10">
      {/* Greeting Section */}
      <div className="relative bg-gradient-to-b from-[#0077B6] to-[#ADE8F4] text-white rounded-xl shadow-lg p-6 md:h-64 flex flex-col justify-between">
        
        {/* Bell Icon */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md">
          <FaBell className="text-[#0077B6] text-lg" />
        </div>

        {/* Greeting Text */}
        <h1 className="text-2xl md:text-4xl font-bold">
          {greeting}
          <br />
          {name}
        </h1>

        {/* Search Bar Section - desktop */}

        <div className="hidden md:block w-full mt-6 md:mt-8">
          <div className="flex items-center bg-[#2B93C5] rounded-md shadow-md w-[310px] md:w-full py-3 px-4 space-x-2">
            {/* Left Icon */}
            <div className="flex items-center justify-center">
              <FaSlidersH className="text-white text-lg" />
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search"
              className="flex-grow px-4 py-2 rounded-md bg-white text-gray-700 focus:outline-none"
            />

            {/* Voice Search Button */}
            <button className="bg-white p-2 rounded-full shadow flex items-center justify-center">
              <FaMicrophone className="text-[#007AFF] text-lg" />
            </button>
          </div>
        </div>

        {/* Searchbar section for Mobile */}

        <div className=" flex justify-center mt-6 md:mt-8 md:hidden">
          <div className="flex items-center bg-[#2B93C5] rounded-md shadow-md w-[330px] max-w-lg py-3 px-5 space-x-2">
            {/* Left Icon */}
            <div className="flex items-center justify-center">
              <FaSlidersH className="text-white text-lg" />
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search"
              className="flex-grow px-1 py-2 rounded-md bg-white text-gray-700 focus:outline-none"
            />

            {/* Voice Search Button */}
            <button className="bg-white p-2 rounded-full shadow flex items-center justify-center">
              <FaMicrophone className="text-[#007AFF] text-lg" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GreetingCard;