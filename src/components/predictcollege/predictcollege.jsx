"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios"; // ✅ Import Axios for API Requests

const PredictCollege = () => {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");
  const course = searchParams.get("course");
  const category = searchParams.get("category");
  const airRank = searchParams.get("airRank");

  const [predictedColleges, setPredictedColleges] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.post("http://localhost:3306/api/predict-college", {
          state,
          course,
          airRank,
          category,
        });

        setPredictedColleges(response.data.colleges);
        console.log(predictedColleges)
      } catch (error) {
        console.error("Error fetching predicted colleges:", error);
        setPredictedColleges([]);
      }
    };

    if (state && course && category && airRank) {
      fetchColleges();
    }
  }, [state, course, category, airRank]);

  return (
    <div className="min-h-screen bg-white px-4 shadow-md md:m-4 md:mt-7 border-gray-50">
      <h1 className="text-2xl font-bold my-5 mx-1">Predicted Colleges</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 md:ml-8 gap-4 p-4 pb-20">
        {predictedColleges.length > 0 ? (
          predictedColleges.map((college, index) => (
            <div key={index} className="md:h-[340px] md:w-[450px] bg-[#0077B6] rounded-lg overflow-hidden border border-black">
              <div className="p-4">
                <h3 className="text-lg font-bold text-white">{college.college_name}</h3>
                <p className="text-sm text-white mt-1">Type: {college.type}</p>
                <p className="text-sm text-white mt-1">Intake: {college.intake}</p>
                <p className="text-sm text-white mt-1">GEN Cutoff: {college.gen_cutoff}</p>
                <p className="text-sm text-white mt-1">OBC Cutoff: {college.obc_cutoff}</p>
                <p className="text-sm text-white mt-1">SC Cutoff: {college.sc_cutoff}</p>
                <p className="text-sm text-white mt-1">ST Cutoff: {college.st_cutoff}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg">No colleges found for your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default PredictCollege;
