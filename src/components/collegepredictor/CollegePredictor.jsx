'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

const CollegePredictor = () => {
  const searchParams = useSearchParams();
  const airRankFromPreviousPage = searchParams.get("airRank");
  const router = useRouter();

  const [states, setStates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [airRank, setAirRank] = useState(airRankFromPreviousPage || "");

  useEffect(() => {
    if (airRankFromPreviousPage) setAirRank(airRankFromPreviousPage);
  }, [airRankFromPreviousPage]);

  useEffect(() => {
    // Load states and categories from backend
    const fetchStatesAndCategories = async () => {
      try {
        const [stateRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:3306/api/states"),
          axios.get("http://localhost:3306/api/categories")
        ]);
        setStates(stateRes.data.states || []);
        setCategories(categoryRes.data.categories || []);
      } catch (error) {
        console.error("❌ Error loading states/categories:", error);
      }
    };
    fetchStatesAndCategories();
  }, []);

  useEffect(() => {
    // Load courses dynamically for selected state
    const fetchCourses = async () => {
      if (!selectedState) return;
      try {
        const response = await axios.get(`http://localhost:3306/api/courses?state=${selectedState}`);
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error("❌ Error loading courses:", error);
        setCourses([]);
      }
    };
    fetchCourses();
  }, [selectedState]);

  const handlePredict = () => {
    if (!selectedState || !selectedCourse || !selectedCategory) {
      alert("Please fill in all fields!");
      return;
    }

    router.push(
      `/predictcollege?state=${selectedState}&course=${selectedCourse}&category=${selectedCategory}&airRank=${airRank}`
    );
  };

  return (
    <div className="bg-gradient-to-r from-[#ADE8F4] to-[#0077B6] shadow-lg p-8 md:h-[90vh]">
      <h2 className="text-xl md:text-3xl font-bold text-center mb-8 text-black">College Predictor</h2>
      <div className="bg-white shadow-lg p-6 mx-auto md:w-2/3 md:h-[60vh] lg:w-1/2">
        <form className="space-y-4">
          {/* State */}
          <Dropdown label="State" options={states} value={selectedState} onChange={setSelectedState} />
          {/* Course */}
          <Dropdown label="Course" options={courses} value={selectedCourse} onChange={setSelectedCourse} />
          {/* AIR Rank */}
          <div className="flex items-center space-x-4 md:pl-4 md:space-x-12 md:pb-5">
            <label className="text-gray-700 font-medium">AIR Rank:</label>
            <input
              type="number"
              placeholder="Predicted AIR Rank"
              value={airRank}
              readOnly
              className="flex-grow px-4 py-2 w-48 border rounded-md bg-gray-100 text-gray-700"
            />
          </div>
          {/* Category */}
          <Dropdown label="Category" options={categories} value={selectedCategory} onChange={setSelectedCategory} />
          {/* Submit */}
          <button
            type="button"
            className="w-full md:w-1/3 bg-blue-500 text-white font-bold py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mx-auto block"
            onClick={handlePredict}
          >
            Predict
          </button>
        </form>
      </div>
    </div>
  );
};

const Dropdown = ({ label, options, value, onChange }) => (
  <div className="flex items-center  space-x-4 md:space-x-20 md:pb-5">
    <label className="text-gray-700  font-medium">{label}:</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Select {label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default CollegePredictor;
