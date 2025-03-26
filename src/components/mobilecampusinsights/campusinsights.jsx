"use client";
import Image from "next/image";

// Constants for insights data
const INSIGHTS_DATA = [
  {
    id: 1,
    image: "/CampusInsights1.svg",
    category: "Insight",
    date: "12 Aug 2023",
    description: "Many Univerz university graduates immediately work",
  },
  {
    id: 2,
    image: "/CampusInsights2.svg",
    category: "Tips",
    date: "12 Dec 2023",
    description: "Tips so you don't get lazy in college",
  },
  {
    id: 3,
    image: "/CampusInsights3.svg",
    category: "Recommend",
    date: "12 Nov 2023",
    description: "10 recommendations for good college places",
  },
];

const CampusInsight = () => {
  return (
    <section className="max-w-5xl mx-auto text-start px-4 py-10">
      {/* Header */}
      <h2 className="text-2xl font-bold text-[#343C6A] mb-6">Campus Insights</h2>

      {/* Cards Section */}
      <div className="flex justify-center gap-6">
        {INSIGHTS_DATA.map((item) => (
          <div key={item.id} className="bg-white shadow-lg rounded-3xl w-[235px] h-[336px] flex flex-col overflow-hidden">
            {/* Image */}
            <div className="relative w-full">
              <Image src={item.image} width={250} height={150} alt={item.category} className="w-full h-40 object-cover rounded-t-3xl" />
              <span className="absolute bottom-[-12px] left-0 bg-[#007AFF] text-white text-[12px] font-medium px-[0.75rem] py-1 rounded-full mb-[-1.5rem] ">
                {item.category}
              </span>
            </div>

            {/* Date & Description */}
            <div className="p-5 text-start">
              <p className="text-[13px] text-black font-bold mt-4">{item.date}</p>
              <p className="text-[#007AFF] font-semibold text-[10px] mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="flex justify-center gap-6 mt-10 mb-[5rem]">
        {/* Box 1 */}
        <div className="bg-white shadow-md p-6 rounded-3xl flex flex-col items-center w-[150px] h-[100px]">
          <span className="text-[#007AFF] font-bold text-xl">35+</span>
          <span className="text-gray-700 text-sm">Rankings</span>
        </div>

        {/* Center Box */}
        <div className="text-white shadow-md bg-[#49A6CF] p-6 rounded-3xl flex flex-col items-center w-[150px] h-[100px]">
          <span className="font-bold text-xl">56+</span>
          <span className="text-sm">fees</span>
        </div>

        {/* Box 3 */}
        <div className="bg-white shadow-md p-6 rounded-3xl flex flex-col items-center w-[150px] h-[100px]">
          <span className="text-[#007AFF] font-bold text-xl">100+</span>
          <span className="text-gray-700 text-sm">top recruiters</span>
        </div>
      </div>
    </section>
  );
};

export default CampusInsight;
