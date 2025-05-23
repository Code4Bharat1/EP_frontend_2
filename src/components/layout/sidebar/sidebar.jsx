'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaTachometerAlt,
  FaBullseye,
  FaClipboardList,
  FaPoll,
  FaChartLine,
  FaUniversity,
  FaCookie,
} from 'react-icons/fa';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Sidebar = ({ isOpen }) => {
  const [colors, setColors] = useState({
    sidebarColor: '#0077B6', // default fallback sidebar color
    textColor: '#ffffff',     // default fallback text color
  });

  useEffect(() => {
    const fetchSidebarColors = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const decoded = jwtDecode(token);
        const studentId = decoded.id;

        const response = await axios.post(`${apiBaseUrl}/newadmin/studentcolors`, {
          studentId,
        });

        console.log(response.data.colors);

        if (response.data && response.data.colors) {
          const { sidebarColor, textColor } = response.data.colors;

          setColors({
            sidebarColor: sidebarColor || '#0077B6',
            textColor: textColor || '#ffffff',
          });
        }
      } catch (error) {
        console.error('Failed to fetch sidebar colors:', error);
      }
    };

    fetchSidebarColors();
  }, []);

  return (
    <div className="hidden md:block md:w-1/6">
      <div
        className={`fixed top-0 left-0 h-full transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative flex flex-col`}
        style={{
          backgroundColor: colors.sidebarColor,
          color: colors.textColor,
        }}
      >
        {/* Logo Section */}
        <div className="p-4 flex justify-center">
          <Image src="/nexcore-logo-pc.png" alt="Nexcore Logo" width={160} height={40} />
        </div>

        {/* Sidebar Menu */}
        <ul className="flex flex-col space-y-8 px-6 text-lg mt-10">
          {[
            { href: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
            { href: '/goalsetup', icon: FaBullseye, label: 'Exam Plan' },
            { href: '/testselection', icon: FaClipboardList, label: 'Test' },
            { href: '/pasttest', icon: FaPoll, label: 'Result' },
            { href: '/analytics', icon: FaChartLine, label: 'Analytics' },
            { href: '/colleges', icon: FaUniversity, label: 'Colleges' },
            { href: '/credits', icon: FaCookie, label: 'Credits' },
          ].map(({ href, icon: Icon, label }) => (
            <li key={href} className="hover:opacity-80 cursor-pointer">
              <Link href={href} className="flex items-center space-x-3" style={{ color: colors.textColor }}>
                <Icon className="text-lg" />
                <span className="text-md">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
