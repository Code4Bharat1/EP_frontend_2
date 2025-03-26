"use client";

import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Next.js Image component
import { FaPlus, FaPencilAlt, FaClock, FaHistory } from "react-icons/fa";
import { Users } from "lucide-react";


const testCards = [
  {
    title: "CREATE TEST",
    description: "You can create tests according to your preparation",
    route: "/createtest",
    icon: <FaPencilAlt className="text-white text-xl md:text-2xl" />,
  },
  {
    title:( 
      <>
    ALREADY <br/>
    CREATED TEST
    </>
    ),
    description:
      "Time's running! Solve your already created tests to increase your stats",
      route: "/alreadycreatedtest",
      icon: <FaClock className="text-white text-xl md:text-2xl" />,
    },
  {
    title: "PAST TEST",
    description:
      "You can examine your past test errors and scores to avoid future mistakes",
    route: "/pasttest",
    icon: <FaHistory className="text-white text-xl md:text-2xl" />,
  },
];


const TestSection = () => {
  const router = useRouter();

  return (
    <div className="w-full space-y-4">
      {/* Create Test Button */}
      <button
        className="bg-[#45A4CE] text-white flex items-center justify-start gap-2 md:px-9 md:py-3 px-4 py-2 mb-10 rounded-md shadow-md hover:opacity-90 transition"
        onClick={() => router.push("/createtest")}
      >
        <FaPlus className="text-white text-lg" />
        <span className="font-semibold">Create Test</span>
      </button>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:mx-0 mx-3">
        {testCards.map((card, index) => (
          <div
            key={index}
            onClick={() => router.push(card.route)} // Clickable Whole Card
            className="flex flex-col h-48 md:h-48 w-full rounded-2xl shadow-lg cursor-pointer hover:opacity-90 transition"
          >
            {/* First Div (70% Height) */}
            <div className="bg-[#1E7BA2] text-white rounded-t-2xl p-4 flex items-center justify-between h-[70%]">
              {/* Left Icon */}
              <div className="flex items-center">
                <Users size={28} className="mr-3" />
              </div>

              {/* Text Content */}
              <div className="flex flex-col text-center flex-grow mx-2">
                <h3 className="text-md font-semibold">{card.title}</h3>
                <p className="text-[10px] text-center md:text-sm">
                  {card.description}
                </p>
              </div>

              {/* Right Icon */}
              <div className="text-lg md:text-xl">{card.icon}</div>
            </div>

            {/* Second Div (30% Height) */}
            <div className="bg-gradient-to-b from-[#5293b0] to-[#1E7BA2] rounded-b-2xl flex items-center justify-end p-3 h-[30%]">
              <Image
                src="/entertest(circles).png" // Ensure the image is in the public folder or use an external URL
                alt="Illustration"
                width={80} // Adjust width as needed
                height={80} // Adjust height as needed
                priority // Ensures faster loading
                className="h-full object-contain"
                unoptimized // Use this if the image is external
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestSection;
