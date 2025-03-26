'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiMenu,
  FiSearch,
  FiChevronLeft,
  FiHome,
  FiTarget,
  FiEdit,
  FiBarChart,
  FiTrendingUp,
  FiAward,
  FiBook,
  FiLogOut,
} from "react-icons/fi";
import { MdLeaderboard, MdAnalytics } from "react-icons/md"; // New Icons for Leaderboard & Analytics

const ToggleBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div>
      {/* Top Bar */}
      <div className="sm:flex md:hidden w-full p-4 h-[110px]">
        <div className="flex items-center justify-between w-full">
          {/* Toggle Button */}
          <button className="text-gray-600" onClick={() => setMenuOpen(true)}>
            <FiMenu size={24} />
          </button>

          {/* Center Text */}
          <h1 className="text-lg font-semibold text-gray-700">Overview</h1>

          {/* Profile Picture */}
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src="/profile.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full flex justify-center p-1 mt-3">
          <div className="w-full max-w-screen-lg flex items-center h-[50px] mx-3">
            {/* Search Input */}
            <div className="flex items-center bg-gray-200 h-9 rounded-full flex-grow">
              <button className="pl-5 text-gray-400">
                <FiSearch size={20} />
              </button>
              <input
                type="text"
                placeholder="Search for something"
                className="flex-grow p-2 text-sm bg-transparent focus:outline-none rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Menu with Animation */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-50 transition-all duration-300 ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          ref={menuRef}
          className={`bg-white w-[75%] max-w-sm p-4 h-full flex flex-col transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Profile Section */}
          <div className="flex flex-col items-center py-4 border-b">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
              <img
                src="/profile.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold">Basim Thakur</h2>
            <p className="text-sm text-gray-500">basimthakur@gmail.com</p>
          </div>

          {/* Menu Items */}
          <div className="mt-10 space-y-6">
            {[
              { name: "Home", path: "/", icon: <FiHome /> },
              { name: "Goal Set Up", path: "/goalsetup", icon: <FiTarget /> },
             
              { name: "Result", path: "/result", icon: <FiBarChart /> },
              { name: "Analytics", path: "/analytics", icon: <MdAnalytics /> }, // New Analytics Entry
              { name: "Leaderboard", path: "/leaderboard", icon: <MdLeaderboard /> },
              { name: "Colleges", path: "/colleges", icon: <FiBook /> },
              { name: "Logout", path: "/login", icon: <FiLogOut /> },
            ].map((item) => (
              <button
                key={item.name}
                className="w-full text-left flex items-center gap-3 text-gray-700 font-bold hover:text-blue-600 text-base"
                onClick={() => {
                  router.push(item.path);
                  setMenuOpen(false);
                }}
              >
                <span className="text-xl text-gray-500">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleBar;
