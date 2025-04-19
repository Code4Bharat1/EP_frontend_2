"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// College Data
const colleges = [
  { 
    id: 1, 
    name: "Anjuman Islam", 
    location: "Mumbai", 
    image: "/anjuman.png", 
    link: "https://aiaessk.org/" 
  },
  { 
    id: 2, 
    name: "Bunts", 
    location: "Kurla, Mumbai", 
    image: "/bunts.png", 
    link: "https://www.buntscollege.org" 
  },
  { 
    id: 3, 
    name: "Diamond Jubilee", 
    location: "Mumbai", 
    image: "/anjuman.png", 
    link: "https://www.agakhanschools.org/india/djhsm/index" 
  },
  { 
    id: 4, 
    name: "St. Mary", 
    location: "Mumbai", 
    image: "/bunts.png", 
    link: "https://stmarysssc.org/" 
  },
  { 
    id: 5, 
    name: "Don Bosco", 
    location: "Kurla, Mumbai", 
    image: "/donbosco.png", 
    link: "https://donboscomatunga.com/" 
  },
  { 
    id: 6, 
    name: "SNDT College", 
    location: "Mumbai", 
    image: "/sndt.png", 
    link: "https://sndt.ac.in/" 
  },
  { 
    id: 7, 
    name: "Kalsekar College", 
    location: "Mumbra", 
    image: "/donbosco.png", 
    link: "https://aiktc.ac.in/" 
  },
  { 
    id: 8, 
    name: "Saboo Siddik College", 
    location: "Mumbai", 
    image: "/sndt.png", 
    link: "https://www.mhssce.ac.in/" 
  },
];

const ExploreTopCollegeCards = () => {
  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex justify-between items-center my-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-black">
          Explore Top Colleges
        </h2>
        <Link href="/explorecolleges" className="text-[#4D8AF0] hover:underline text-lg">
          See More
        </Link>
      </div>

      {/* College Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {colleges.map((college) => (
          <a
            href={college.link}  // Make the whole card a clickable link
            target="_blank"
            rel="noopener noreferrer"
            key={college.id}
            className="relative bg-gradient-to-b from-[#0077B6] to-[#ADE8F4] p-6 rounded-lg shadow-lg text-left"
          >
            {/* "View More" Top Right */}
            <span className="absolute top-3 right-3 text-white text-sm">
              View More
            </span>

            {/* College Image */}
            <Image
              src={college.image}
              alt={college.name}
              width={180}
              height={150}
              className="mx-auto my-4 object-cover"
            />

            {/* College Name - Left Aligned */}
            <h3 className="text-lg font-semibold text-white">{college.name}</h3>

            {/* College Location - Left Aligned */}
            <p className="text-sm text-[#727272]">{college.location}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ExploreTopCollegeCards;
