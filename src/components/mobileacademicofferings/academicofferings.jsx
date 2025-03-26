"use client";
import { FaCogs, FaBrain, FaPalette, FaLanguage, FaCalculator, FaFlask } from "react-icons/fa";

const AcademicOfferingsMobile = () => {
  return (
    <section className="max-w-md mx-auto px-4 py-8 text-center">
      {/* Header Section */}
      <h2 className="text-2xl font-bold text-[#49a6cf]">
        Explore Our Academic Offerings
      </h2>
      <h3 className="text-xl font-bold text-[#49a6cf] mt-1">
        Chart Your Path to Success
      </h3>
      <p className="text-gray-900 mt-3 text-sm max-w-xs mx-auto">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at massa sit amet nisi blandit vehicula adipiscing elit.
      </p>

      {/* Offerings Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6"> 
        <OfferingCard
          icon={<FaCogs size={40} />}
          title="Engineering"
          description="Discover problem-solving technology."
        />
        <OfferingCard
          icon={<FaBrain size={40} />}
          title="Psychology"
          description="Explore human behavior & emotions."
        />
        <OfferingCard
          icon={<FaPalette size={40} />}
          title="Fine Arts"
          description="Unleash creativity in digital art."
        />
        <OfferingCard
          icon={<FaLanguage size={40} />}
          title="Language"
          description="Enhance global communication."
        />
        <OfferingCard
          icon={<FaCalculator size={40} />}
          title="Accountancy"
          description="Master financial management."
        />
        <OfferingCard
          icon={<FaFlask size={40} />}
          title="Science"
          description="Explore natural world experiments."
        />
      </div>

      {/* View All Button */}
      <div className="mt-6">
        <button className="bg-[#49a6cf] text-white px-5 py-2 rounded-full hover:bg-blue-600 transition">
          View All
        </button>
      </div>
    </section>
  );
};

// Offering Card Component (Mobile Optimized)
const OfferingCard = ({ icon, title, description }) => {
  return (
    <div className="bg-[#49a6cf] text-white p-[10px] rounded-[1.5rem] flex items-center shadow-md">
      {/* Icon Section */}
      <div className="text-white">{icon}</div>

      {/* Text Section */}
      <div className="text-center mt-2">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-xs text-white opacity-90 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AcademicOfferingsMobile;
