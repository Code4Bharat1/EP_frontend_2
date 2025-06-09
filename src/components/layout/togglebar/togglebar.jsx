"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiMenu,
} from "react-icons/fi";
import {
  FaTachometerAlt,
  FaBullseye,
  FaClipboardList,
  FaPoll,
  FaChartLine,
  FaUniversity,
  FaCookie,
  FaBook,
  FaTablets,
} from "react-icons/fa";
import axios from "axios";

const sidebarLinks = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Exam Plan", path: "/goalsetup", icon: <FaBullseye /> },
  { name: "Test", path: "/testselection", icon: <FaClipboardList /> },
  { name: "Result", path: "/pasttest", icon: <FaPoll /> },
  { name: "Analytics", path: "/analytics", icon: <FaChartLine /> },
  { name: "Colleges", path: "/colleges", icon: <FaUniversity /> },
  { name: "Credits", path: "/credits", icon: <FaCookie /> },
  { name: "PYQs", path: "/previousyearquestions", icon: <FaTablets /> },
  { name: "View Notice", path: "/notice", icon: <FaBook /> },
];

const ToggleBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/profile.png");
  const [profileMenu, setProfileMenu] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenu(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, profileMenu]);

  // Fetch profile image from the backend API
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/students/getdata`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200 && response.data.profileImage && response.data.firstName && response.data.emailAddress) {
          setProfileImage(response.data.profileImage); // Set the profile image from backend
          setFirstName(response.data.firstName);
          setEmail(response.data.emailAddress);
        }
      } catch (error) {
        // fallback
      }
    };

    fetchProfileImage();
  }, [router]);

  // Toggle Profile Dropdown
  const toggleProfileMenu = () => {
    setProfileMenu(!profileMenu);
  };

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
          <h1 className="text-lg font-semibold text-gray-700">Menu</h1>

          {/* Profile Picture */}
          <div className="w-8 h-8 rounded-full overflow-hidden" ref={profileRef} onClick={toggleProfileMenu}>
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {/* Profile Dropdown */}
            {profileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={() => router.push("/personaldata")}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  Personal Data
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  Log Out
                </button>
              </div>
            )}
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
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold">{firstName}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>

          {/* Sidebar Navigation (Same as Desktop) */}
          <div className="mt-10 space-y-6">
            {sidebarLinks.map((item) => (
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
