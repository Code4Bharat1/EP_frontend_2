"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoMdNotifications } from "react-icons/io";
import {
  IoSettingsOutline,
  IoMoonOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import { MdAccountCircle, MdLogout } from "react-icons/md";
import axios from "axios";
import Link from "next/link";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const NavBar = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  const [profileImage, setProfileImage] = useState("/profile.jpg");
  const [notifications, setNotifications] = useState([]);

  // Fetch profile image from the backend API
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${apiBaseUrl}/students/getdata`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200 && response.data.profileImage) {
          setProfileImage(response.data.profileImage); // Set the profile image from backend
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, [router]);

  // Fetch notifications dynamically based on test start and end dates
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
         const token = localStorage.getItem("authToken");

        if (!token) {
          router.push("/login");
          return;
        }
        console.log(token);
        // Send POST request with decoded token in body
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/newadmin/upcomingtest-data`, // Send decoded info here
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Optional if backend uses auth header
            },
          }
        );
        const tests = response.data.tests;
        const currentDate = new Date();

        const newNotifications = [];

        tests.forEach((test) => {
          const examStartDate = new Date(test.exam_start_date);
          const examEndDate = new Date(test.exam_end_date);

          // Check if the exam_start_date matches today
          if (examStartDate.toDateString() === currentDate.toDateString()) {
            newNotifications.push(`New test - ${test.testname}`);
          }

          // Check if the exam_end_date matches today (Last day notification)
          if (examEndDate.toDateString() === currentDate.toDateString()) {
            newNotifications.push(`Last day for the test - ${test.testname}`);
          }
        });

        setNotifications(newNotifications); // Set the notifications state
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Toggle Profile Dropdown
  const toggleProfileMenu = () => {
    setProfileMenu(!profileMenu);
    setNotificationsOpen(false); // Close notifications if profile is opened
  };

  // Toggle Notifications Popup
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setProfileMenu(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="hidden md:flex w-full bg-gradient-to-r from-[#27759C] to-[#0E2936] px-8 py-4 items-center justify-between relative">
      {/* Left Section - Search Bar */}
      <div className="flex items-center flex-grow max-w-md">
        {/* Your previous search bar logic can be added here */}
      </div>

      {/* Right Section - Icons */}
      <div className="flex items-center space-x-5">
        {/* Light/Dark Mode Toggle */}
        {/* <div className="flex items-center space-x-2">
          <IoSunnyOutline className="text-white text-2xl" />
          <label className="relative flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              onClick={toggleDarkMode}
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition duration-300 flex items-center">
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                  darkMode ? "translate-x-5" : "translate-x-1"
                }`}
              ></div>
            </div>
          </label>
          <IoMoonOutline className="text-white text-2xl" />
        </div> */}

        {/* Notifications */}
        <div className="relative cursor-pointer" ref={notificationsRef}>
          <IoMdNotifications
            className="text-3xl text-white"
            onClick={toggleNotifications}
          />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>

          {/* Notifications Popup */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 text-gray-700 font-semibold border-b">
                Notifications
              </div>
              <ul className="text-sm text-gray-600">
                {notifications.length === 0 ? (
                  <li className="px-4 py-2 text-center text-gray-500">
                    No new notifications
                  </li>
                ) : (
                  notifications.map((notification, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <Link href="/testselection">{notification}</Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Settings */}
        {/* <IoSettingsOutline
          className="text-3xl text-white cursor-pointer"
          onClick={() => router.push("/settings")}
        /> */}

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <img
            src={profileImage} // Profile image fetched from the backend
            alt="Profile"
            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
            onClick={toggleProfileMenu}
          />

          {/* Dropdown Menu */}
          {profileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={() => router.push("/personaldata")}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
              >
                <MdAccountCircle className="mr-2 text-xl" />
                Personal Data
              </button>
              <button
                onClick={() => router.push("/login")}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
              >
                <MdLogout className="mr-2 text-xl" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
