"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const UniversityMobile = () => {
  // Step 1: State for Dynamic Data (Initially Dummy)
  const [universityData, setUniversityData] = useState({
    name: "Anjuman Islam",
    images: {
      college1: "/college1.png",
      college2: "/college2.png",
    },
    studentsCount: "50K",
    studentAvatars: ["/student1.png", "/student2.png", "/student3.png"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tristique, tortor nec consequat vulputate, lorem arcu congue.",
    statistics: [
      { label: "Course", value: 35 },
      { label: "Startups", value: 56 },
      { label: "Language", value: 100 },
      { label: "Professors", value: 150 },
    ],
  });

  // Step 2: Fetch Dynamic Data
  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await fetch("/api/university");
        const data = await response.json();
        setUniversityData(data);
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };
    // Uncomment when API is ready
    // fetchUniversityData();
  }, []);

  return (
    <section className="grid grid-cols-2 gap-0 pl-[2rem] pr-[1rem] py-8 items-center">
      {/* Left Side - Images Section */}
      <div className="flex flex-col items-center">
        {/* First Image with Badge */}
        <div className="relative w-[13rem]">
          <Image
            src={universityData.images.college1}
            width={320}
            height={260}
            alt="College Image"
            className="rounded-2xl shadow-lg w-full"
          />
          {/* Student Count Badge */}
          <div className="absolute -bottom-[3.5rem] left-1/2 transform -translate-x-1/2 bg-white shadow-lg px-4 py-2 rounded-3xl flex flex-col items-center w-28">
            <span className="text-blue-600 font-semibold text-lg">{universityData.studentsCount}+</span>
            <span className="text-gray-600 text-sm">Students</span>
            <div className="flex -space-x-1 mt-1">
              {universityData.studentAvatars.map((avatar, index) => (
                <Image
                  key={index}
                  src={avatar}
                  width={22}
                  height={22}
                  alt="Avatar"
                  className="rounded-full border border-white"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Second Image */}
        <div className="mt-[1rem] w-[98%] max-w-xs">
          <Image
            src={universityData.images.college2}
            width={320}
            height={260}
            alt="Campus Image"
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
      </div>

      {/* Right Side - Statistics Section */}
      <div className="flex flex-col justify-start items-end space-y-4">
        {/* Header */}
        <span className="text-lg font-bold text-blue-600 pr-4">Target College</span>

        {/* Statistics */}
        {universityData.statistics.map((stat, idx) => (
          <div key={idx} className="w-32 bg-white drop-shadow-lg rounded-3xl p-4 flex flex-col items-center text-center">
            <span className="text-blue-600 text-2xl font-bold">{stat.value}+</span>
            <p className="text-gray-900 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UniversityMobile;
