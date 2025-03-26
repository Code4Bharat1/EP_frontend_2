"use client";

import React, { useState } from "react";
import { FiSliders } from "react-icons/fi";

const FilterCard = () => {
  const states = [
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Andhra Pradesh",
    "Gujarat",
    "Rajasthan",
    "Kerala",
    "Punjab",
    "Haryana",
  ]; // Hardcoded top 10 states

  const [selectedState, setSelectedState] = useState("Maharashtra"); // Default state
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [specializationDropdownOpen, setSpecializationDropdownOpen] = useState(false);
  const [instituteDropdownOpen, setInstituteDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const specializations = ["MBBS", "BAMS", "BDS"];
  const instituteTypes = ["Government", "Deemed", "Private"];
  const sortingOptions = [
    "No. of seats (Low)",
    "No. of seats (High)",
    "Rank (Low)",
    "Rank (High)",
    "YOE (Old to New)",
    "YOE (New to Old)",
  ];

  const handleClearAll = () => {
    setSelectedState(null);
    setStateDropdownOpen(false);
    setSpecializationDropdownOpen(false);
    setInstituteDropdownOpen(false);
    setSortDropdownOpen(false);
  };

  return (
    <div className="hidden md:block md:min-h-screen md:w-[80%] m-4 p-4 bg-white shadow-lg border border-gray-200">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FiSliders className="text-black text-xl" />
          <p className="text-black text-lg font-semibold">Filters</p>
        </div>
        <button
          onClick={handleClearAll}
          className="text-red-500 text-sm font-medium hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Selected State */}
      {selectedState && (
        <div className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 mb-4 shadow-sm flex justify-between items-center">
          {selectedState}
          <button
            onClick={() => setSelectedState(null)}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* State Dropdown */}
      <div className="mb-6">
        <button
          onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
          className="w-full text-left bg-gray-50 text-black py-2 px-3 shadow-sm border border-gray-300 flex justify-between items-center"
        >
          State
          <span>{stateDropdownOpen ? "▲" : "▼"}</span>
        </button>
        {stateDropdownOpen && (
          <div className="mt-2 bg-white shadow-lg border border-gray-300 max-h-48 overflow-y-auto">
            {states.map((state, index) => (
              <React.Fragment key={state}>
                <div
                  onClick={() => {
                    setSelectedState(state);
                    setStateDropdownOpen(false);
                  }}
                  className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                >
                  {state}
                </div>
                {index < states.length - 1 && <hr className="border-gray-200" />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Specialization Dropdown */}
      <div className="mb-6">
        <button
          onClick={() => setSpecializationDropdownOpen(!specializationDropdownOpen)}
          className="w-full text-left bg-gray-50 text-black py-2 px-3 shadow-sm border border-gray-300 flex justify-between items-center"
        >
          Specialization
          <span>{specializationDropdownOpen ? "▲" : "▼"}</span>
        </button>
        {specializationDropdownOpen && (
          <div className="mt-2 bg-white shadow-lg border border-gray-300">
            {specializations.map((specialization, index) => (
              <React.Fragment key={specialization}>
                <div
                  className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                >
                  {specialization}
                </div>
                {index < specializations.length - 1 && <hr className="border-gray-200" />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Institute Type Dropdown */}
      <div className="mb-6">
        <button
          onClick={() => setInstituteDropdownOpen(!instituteDropdownOpen)}
          className="w-full text-left bg-gray-50 text-black py-2 px-3 shadow-sm border border-gray-300 flex justify-between items-center"
        >
          Institute Type
          <span>{instituteDropdownOpen ? "▲" : "▼"}</span>
        </button>
        {instituteDropdownOpen && (
          <div className="mt-2 bg-white shadow-lg border border-gray-300">
            {instituteTypes.map((type, index) => (
              <React.Fragment key={type}>
                <div
                  className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                >
                  {type}
                </div>
                {index < instituteTypes.length - 1 && <hr className="border-gray-200" />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Sorting Options Dropdown */}
      <div className="mb-6">
        <button
          onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          className="w-full text-left bg-gray-50 text-black py-2 px-3 shadow-sm border border-gray-300 flex justify-between items-center"
        >
          Sort by
          <span>{sortDropdownOpen ? "▲" : "▼"}</span>
        </button>
        {sortDropdownOpen && (
          <div className="mt-2 bg-white shadow-lg border border-gray-300">
            {sortingOptions.map((option, index) => (
              <React.Fragment key={option}>
                <div
                  className="py-2 px-3 hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </div>
                {index < sortingOptions.length - 1 && <hr className="border-gray-200" />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterCard;
