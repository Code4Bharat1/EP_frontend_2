"use client";

const sections = ["Physics", "Chemistry", "Biology"];

const ViewAnalyticsHeader = ({ selectedSection, setSelectedSection }) => {
  return (
    <div className="w-full flex flex-col items-center p-4 md:p-6">
      {/* Header */}
      <div className="bg-[#49A6CF] text-white text-center text-lg md:text-xl font-semibold p-6 rounded-lg shadow-md w-full max-w-md">
        View Analytics
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
        {sections.map((section) => (
          <button
            key={section}
            className={`px-4 md:px-12 py-3 rounded-lg font-medium transition-all w-full
              ${
                selectedSection === section
                  ? "bg-[#49A6CF] text-white"
                  : "bg-white text-[#8A8A8A] border border-[#0052B4]"
              }`}
            onClick={() => setSelectedSection(section)}
          >
            {section} Section
          </button>
        ))}
      </div>

      {/* Horizontal Divider */}
      <hr className="border-[#CACDD8] border-[1px] w-full mt-4 md:mt-6" />
    </div>
  );
};

export default ViewAnalyticsHeader;
