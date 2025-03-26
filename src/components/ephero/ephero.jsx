"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaChartBar } from "react-icons/fa"; // Icons

const Ephero = () => {
  return (
    <div className="w-full md:w-4/5 mx-auto mt-10 flex items-center justify-center bg-[#E3F2F1] p-6  rounded-2xl">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
        {/* Left Content Section */}
        <motion.div
          className="flex-1 text-center md:text-left px-4 md:px-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-600 text-sm">Never stop learning</p>
          <h1 className="text-2xl md:text-4xl font-bold text-[#005F56] leading-tight mt-2">
            Grow up your skills by <br /> online courses with <br />
            <span className="text-[#005F56]">Nexcore Alliance</span>
          </h1>

          {/* Student Data Box */}
          <motion.div
            className="mt-6 bg-white md:ml-64 rounded-xl px-4 py-2 flex items-center gap-3 inline-flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <FaCalendarAlt size={20} />
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-gray-800">250k</p>
              <p className="text-gray-500 text-sm">Assisted Student</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          className="relative flex-1 flex justify-center md:justify-end mt-6 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/boy.png"
            alt="Student"
            width={400}
            height={400}
            className="w-[280px] md:w-80 h-auto"
          />

          {/* Floating Icon */}
          <motion.div
            className="absolute top-10 md:top-16 right-2 md:right-5 bg-orange-500 p-3 rounded-xl shadow-lg mr-64"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
          >
            <FaChartBar className="text-white" size={24} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Ephero;
