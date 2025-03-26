"use client";
import { FaCogs, FaBrain, FaPalette, FaLanguage, FaCalculator, FaFlask } from "react-icons/fa";

const AcademicOfferings = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 text-center">
      {/* Header Section */}
      <h2 className="text-3xl md:text-4xl font-bold text-[#49a6cf]">
        Explore Our Academic Offerings
      </h2>
      <h3 className="text-2xl md:text-3xl font-bold text-[#49a6cf] mt-1">
        Chart Your Path to Success
      </h3>
      <p className="text-gray-900 mt-4 max-w-2xl mx-auto">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at massa sit amet nisi blandit vehicula adipiscing elit.
      </p>

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <OfferingCard
          icon={<FaCogs size={60} />}
          title="Engineering"
          description="Discover the principles of innovation, problem-solving technology."
        />
        <OfferingCard
          icon={<FaBrain size={60} />}
          title="Psychology"
          description="Explore human behavior, cognitive processes, and emotional responses."
        />
        <OfferingCard
          icon={<FaPalette size={60} />}
          title="Fine Arts"
          description="Unleash your creativity with painting, sculpture, and digital."
        />
        <OfferingCard
          icon={<FaLanguage size={60} />}
          title="Language"
          description="Learn new languages and enhance communication skills to connect."
        />
        <OfferingCard
          icon={<FaCalculator size={60} />}
          title="Accountancy"
          description="Master financial management, taxation, and auditing to build."
        />
        <OfferingCard
          icon={<FaFlask size={60} />}
          title="Science"
          description="Investigate the wonders of the physical and natural."
        />
      </div>

      {/* View All Button */}
      <div className="mt-8">
        <button className="bg-[#49a6cf] text-white px-[4.5rem] py-2 rounded-full hover:bg-blue-600 transition">
          View All
        </button>
      </div>
    </section>
  );
};

// Offering Card Component (Updated Alignment)
const OfferingCard = ({ icon, title, description }) => {
  return (
    <div className="bg-[#49a6cf] text-white p-6 rounded-3xl flex items-center shadow-md">
      {/* Icon Section */}
      <div className="mr-4 text-white">{icon}</div>

      {/* Text Section */}
      <div className="text-left">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-white opacity-90 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AcademicOfferings;
