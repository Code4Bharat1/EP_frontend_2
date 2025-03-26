import React from "react";
import { useRouter } from "next/navigation";
import { FaThLarge, FaFileAlt, FaChartPie, FaUniversity } from "react-icons/fa";

const BottomNavbar = ({ activePage }) => {
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", icon: <FaThLarge />, path: "/dashboard" },
    { name: "Test", icon: <FaFileAlt />, path: "/testselection" },
    { name: "Results", icon: <FaChartPie />, path: "/analytics" },
    { name: "Colleges", icon: <FaUniversity />, path: "/explorecolleges" },
  ];

  return (
    <div className="block fixed bottom-0 left-0 w-full bg-white shadow-md z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center text-sm cursor-pointer transition-all ${
              activePage === item.name ? "text-[#007AFF] font-bold" : "text-[#8D8686]"
            }`}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                activePage === item.name ? "text-[#007AFF]" : "text-[#8D8686]"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
            </div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
