"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoMdNotifications } from "react-icons/io";
import { MdAccountCircle, MdLogout } from "react-icons/md";
import axios from "axios";
import Link from "next/link";
import { FaMedal } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const NavBar = () => {
  const router = useRouter();
  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const [profileImage, setProfileImage] = useState("/profile.jpg");
  const [notifications, setNotifications] = useState([]);
  const [result, setResults] = useState(null);

  const [colors, setColors] = useState({
    navbarColor: "#27759C",
    sidebarColor: "#0E2936",
    textColor: "#ffffff",
  });

  // Fetch admin-defined colors
  useEffect(() => {
    const fetchAdminColors = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const id = decoded.id;

        const response = await axios.post(`${apiBaseUrl}/newadmin/studentcolors`, {
          studentId: id,
        });

        const { navbarColor, sidebarColor, textColor } = response.data.colors;
        setColors({ navbarColor, sidebarColor, textColor });
      } catch (error) {
        console.error("Error fetching admin colors:", error);
      }
    };

    fetchAdminColors();
  }, []);

  // Fetch student points
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");

        const decoded = jwtDecode(token);
        const id = decoded.id;

        const response = await axios.post(`${apiBaseUrl}/review/credits`, {
          studentId: id,
        });
        setResults(response.data.totals.overallTotal);
      } catch (error) {
        console.error(error);
      }
    };
    fetchResults();
  }, []);

  // Fetch profile image
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
          setProfileImage(response.data.profileImage);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, [router]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${apiBaseUrl}/newadmin/upcomingtest-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const tests = response.data.tests;
        const currentDate = new Date();

        const newNotifications = [];

        tests.forEach((test) => {
          const start = new Date(test.exam_start_date);
          const end = new Date(test.exam_end_date);

          if (start.toDateString() === currentDate.toDateString()) {
            newNotifications.push(`New test - ${test.testname}`);
          }

          if (end.toDateString() === currentDate.toDateString()) {
            newNotifications.push(`Last day for the test - ${test.testname}`);
          }
        });

        setNotifications(newNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle dropdowns
  const toggleProfileMenu = () => {
    setProfileMenu(!profileMenu);
    setNotificationsOpen(false);
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="hidden md:flex w-full px-8 py-4 items-center justify-between relative"
      style={{
        background: `linear-gradient(to right, ${colors.navbarColor}, ${colors.sidebarColor})`,
        color: colors.textColor,
      }}
    >
      <div className="flex items-center flex-grow max-w-md">
        {/* Placeholder for left section */}
      </div>

      <div className="flex items-center space-x-5">
        {/* Credits Section */}
        <div
          className="flex items-center bg-gray-600 px-3 space-x-2 py-1 rounded-sm"
          title="Cookies"
        >
          <FaMedal className="text-xl text-yellow-400" />
          <p className="text-lg text-white">{result}</p>
        </div>

        {/* Notifications */}
        <div className="relative cursor-pointer" ref={notificationsRef}>
          <IoMdNotifications
            className="text-3xl text-white"
            onClick={toggleNotifications}
          />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>

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

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
            onClick={toggleProfileMenu}
          />

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
