"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const University = () => {
  // Step 1: State for Dynamic Data (Initially Holds Dummy Data)
  const [universityData, setUniversityData] = useState({
    name: "Anjuman Islam",
    images: {
      college1: "/college1.png",
      college2: "/college2.png",
    },
    studentsCount: "50K",
    studentAvatars: ["/student1.png", "/student2.png", "/student3.png"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tristique, tor nec consequat vulputate, lorem ar congue.",
    statistics: [
      { label: "Course", value: 35 },
      { label: "Startups", value: 56 },
      { label: "Language", value: 100 },
      { label: "Professors", value: 150 },
    ],
  });

  // Step 2: API Fetching Logic (Will Be Used Later)
  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await fetch("/api/university"); // Replace with actual API later
        const data = await response.json();
        setUniversityData(data);
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };

    // Uncomment this line when API is ready
    // fetchUniversityData();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      {/* Top Section - Title and Target College Divided */}
      <div className="flex justify-between gap-[3.5rem] items-center mb-8">
        {/* Left Side - University Name & Images */}
        <div className="flex flex-col space-y-4 pt-[5.5rem] pr-[0rem]">
          <h2 className="text-4xl font-bold">{universityData.name}</h2>

          {/* Images Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Image with Badge */}
            <div className="relative">
              <Image
                src={universityData.images.college1}
                width={500}
                height={400}
                alt="College Image"
                className="rounded-xl shadow-lg w-full h-auto"
              />
              {/* Student Count Badge */}
              <div className="absolute -right-[4.30rem] top-[34%] transform -translate-y-1/2 bg-white shadow-lg p-3 rounded-xl flex flex-col items-center w-24">
                <span className="text-blue-600 font-semibold text-lg">{universityData.studentsCount}+</span>
                <span className="text-gray-600 text-sm">Students</span>
                <div className="flex -space-x-1 mt-1">
                  {universityData.studentAvatars.map((avatar, index) => (
                    <Image
                      key={index}
                      src={avatar}
                      width={20}
                      height={20}
                      alt="Avatar"
                      className="rounded-full border border-white"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Image with Description */}
            <div>
              <Image
                src={universityData.images.college2}
                width={500}
                height={400}
                layout="intrinsic"
                alt="Campus Image"
                className="rounded-xl shadow-lg w-full h-auto"
              />
              <p className="mt-4 text-gray-600 text-sm">{universityData.description}</p>
              <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
                Read More
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Target College and Statistics */}
        <div className="flex flex-col items-end pr-[3rem] mt-[-8rem]">
          <span className="text-lg font-bold text-gray-900">Target College</span>
          <div className="flex flex-col space-y-6 text-right p-[2rem]">
            {universityData.statistics.map((stat, index) => (
              <div key={index}>
                <span className="text-3xl font-semibold text-blue-600">{stat.value}+</span>
                <p className="text-gray-900 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default University;
