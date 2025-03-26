'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaTachometerAlt,
  FaBullseye,
  FaClipboardList,
  FaPoll,       // ✅ New Icon for Result
  FaChartLine,  // ✅ New Icon for Analytics
  FaMedal,      // ✅ New Icon for Leaderboard
  FaUniversity,
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  return (
    <div className='hidden md:block md:w-1/6'>
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#0077B6] to-[#ADE8F4] text-white transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-4 flex justify-center">
          <Image src="/nexcore-logo-pc.png" alt="Nexcore Logo" width={160} height={40} />
        </div>

        {/* Sidebar Menu */}
        <ul className="flex flex-col space-y-8 px-6 text-lg mt-10">
          <li className="hover:text-gray-200">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <FaTachometerAlt className="text-lg" />
              <span className="text-md">Dashboard</span>
            </Link>
          </li>
          <li className="hover:text-gray-200">
            <Link href="/goalsetup" className="flex items-center space-x-3">
              <FaBullseye className="text-lg" />
              <span className="text-md">Goal Set up</span>
            </Link>
          </li>
          <li className="hover:text-gray-200">
            <Link href="/testselection" className="flex items-center space-x-3">
              <FaClipboardList className="text-lg" />
              <span className="text-md">Test</span>
            </Link>
          </li>
          <li className="hover:text-gray-200">
            <Link href="/pasttest" className="flex items-center space-x-3">
              <FaPoll className="text-lg" /> {/* ✅ Updated for Result */}
              <span className="text-md">Result</span>
            </Link>
          </li>
          <li className="hover:text-gray-200">
            <Link href="/analytics" className="flex items-center space-x-3">
              <FaChartLine className="text-lg" /> {/* ✅ Updated for Analytics */}
              <span className="text-md">Analytics</span>
            </Link>
          </li>
          <li className="hover:text-gray-200">
            <Link href="/result" className="flex items-center space-x-3">
              <FaMedal className="text-lg" /> {/* ✅ Updated for Leaderboard */}
              <span className="text-md">Leaderboard</span>
            </Link>
          </li>
          <li className="hover:text-gray-200">
            <Link href="/colleges" className="flex items-center space-x-3">
              <FaUniversity className="text-lg" />
              <span className="text-md">Colleges</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
