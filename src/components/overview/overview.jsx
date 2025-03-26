import React, { useState } from "react";
import { AiOutlineDownload } from "react-icons/ai"; // Import Download Icon

const Overview = ({ setSelectedFilter, handleDownload }) => {
  const [selectedOption, setSelectedOption] = useState("This Year");
  const [isDownloading, setIsDownloading] = useState(false); // State to track download status

  // Function to handle dropdown selection
  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    setSelectedFilter(e.target.value);
  };

  // Function to handle button click and prevent multiple downloads
  const handleClickDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDownloading) {
      setIsDownloading(true); // Disable button
      await handleDownload(); // Call the download function

      // Re-enable button after a short delay (avoid multiple triggers)
      setTimeout(() => {
        setIsDownloading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4">
      <h2 className="text-xl font-semibold text-gray-800">Overview</h2>

      <div className="flex items-center gap-4">
        {/* Dropdown */}
        <select
          value={selectedOption}
          onChange={handleSelectChange}
          className="bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-sm focus:outline-none"
        >
          <option value="This Year">This Year</option>
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
        </select>

        {/* Download Button with React Icon (Disabled while downloading) */}
        <button
          onClick={handleClickDownload}
          disabled={isDownloading}
          className={`p-3 rounded-md shadow-md flex items-center justify-center transition ${
            isDownloading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#002D62] hover:bg-[#001F4E] text-white"
          }`}
        >
          <AiOutlineDownload size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Overview;
