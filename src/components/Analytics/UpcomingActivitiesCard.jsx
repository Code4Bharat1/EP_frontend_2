"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const UpcomingActivitiesCard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/newadmin/test-data`);
        const allTests = response.data.tests;

        const currentDate = new Date();
        const filteredTests = allTests.filter((test) => {
          const examStartDate = new Date(test.exam_start_date);
          return examStartDate >= currentDate;
        });

        const labeledTests = filteredTests.map((test) => {
          const examStartDate = new Date(test.exam_start_date);
          const daysDifference = Math.floor((examStartDate - currentDate) / (1000 * 3600 * 24));

          let status = "Upcoming Test";
          if (daysDifference <= 10) {
            status = "Due Soon";
          }

          return {
            ...test,
            status,
            statusColor: status === "Due Soon" ? "text-[#FF1515]" : "text-[#FF9924]",
            exam_start_date: examStartDate.toLocaleDateString(),
          };
        });

        setActivities(labeledTests);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities");
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div>Loading activities...</div>;
  }

  return (
    <div className="pt- flex flex-col items-center justify-center sm:w-full sm:h-auto md:flex-row md:items-start md:justify-center">
      <div className="bg-white rounded-2xl p-4 shadow-lg sm:w-full sm:mb-4 md:w-[450px] h-96 overflow-hidden">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-center md:text-left">
            Upcoming Activities
          </h2>
          <a href="#" className="text-blue-500 text-sm font-medium">
            See all
          </a>
        </div>

        {/* Activities List */}
        <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 scrollbar-thumb-rounded-full">
          {error || activities.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No upcoming tests</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#F0F7FF] p-4 rounded-lg shadow hover:bg-gray-100 cursor-pointer"
              >
                {/* Date Section */}
                <div className="flex-shrink-0 bg-[#0052B4] text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
                  {activity.id}
                </div>

                {/* Activity Info */}
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-bold mb-1">{activity.testname}</h3>
                  <p className="text-xs text-blue-500 font-semibold">
                    {activity.subject || "No subject specified"}
                  </p>
                </div>

                {/* Time and Status */}
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-semibold">
                    {activity.exam_start_date}
                  </p>
                  <p className={`text-xs font-medium ${activity.statusColor}`}>
                    {activity.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingActivitiesCard;