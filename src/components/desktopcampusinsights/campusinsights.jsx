"use client";
import Image from "next/image";

// Constants for insights data
const INSIGHTS_DATA = [
  {
    id: 1,
    image: "/CampusInsights1.svg",
    category: "Insight",
    date: "12 Aug 2023",
    title: "Many Univerz university graduates immediately work",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    bgColor: "bg-[#49A6CF]",
  },
  {
    id: 2,
    image: "/CampusInsights2.svg",
    category: "Tips",
    date: "12 Dec 2023",
    title: "Tips so you don't get lazy in college",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    highlight: true,
    bgColor: "bg-[#49A6CF]",
  },
  {
    id: 3,
    image: "/CampusInsights3.svg",
    category: "Recommend",
    date: "12 Nov 2023",
    title: "10 recommendations for good college places",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    bgColor: "bg-[#49A6CF]",
  },
];

const CampusInsights = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-bold text-black">
            Check out our Latest <br /> Articles and Knowledge
          </h2>
          </div>
          <div className="flex flex-col items-end">
          <p className="text-gray-900 mt-2 max-w-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at
            massa sit amet nisi blandit.
          </p>
        <button className="bg-[#49A6CF] text-white px-[2.5rem] py-2 rounded-full font-medium hover:bg-[#007AFF] transition">
          View All
        </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex justify-center gap-6 ]">
        {INSIGHTS_DATA.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl flex flex-col overflow-hidden items-start text-start "
            style={{ width: "300px", height: "420px" }} // 🔹 Adjusted for Desktop
          >
            {/* Image */}
            <Image
              src={item.image}
              width={300}
              height={180}
              alt={item.category}
              className=" w-full h-[180px] object-cover"
            />

            {/* Category Tag - Correct Positioning */}
            <div className="flex justify-center w-full mt-8 flex-col items-start pl-[2rem]">
              <span className={`${item.bgColor} text-white text-xs font-medium px-[2rem] py-1 rounded-full `}>
                {item.category}
              </span>
            </div>

            {/* Date & Title */}
            <div className="flex flex-row items-start mt-4 pl-[2rem]">
            <p className="text-sm text-[#000] font-bold mt-3">{item.date}</p>
            </div>
            <p className="text-[#007AFF] font-semibold text-md mt-1 leading-tight max-w-[80%] pl-[2rem] ">
              {item.title}
            </p>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-2 max-w-[85%] pl-[2rem]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CampusInsights;
