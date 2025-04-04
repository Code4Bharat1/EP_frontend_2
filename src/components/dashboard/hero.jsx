"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const Hero = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get JWT token from localStorage

        if (!token) {
          setError("No token found. Please login.");
          setLoading(false);
          return;
        }

        // Make the API request to fetch the student's first name and last name
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/name`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in the Authorization header
            },
          }
        );

        // Set the fetched student data to the state
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Error fetching student data.");
        setLoading(false);
      }
    };

    fetchStudentName();
  }, []);

  // Show loading message while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if there's an error
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex items-end justify-center w-full">
      <div className="w-full h-[120px] md:h-[262px] mx-4 bg-gradient-to-r from-[#0077B6] to-[#ADE8F4] text-white rounded-lg p-6 md:p-8 flex flex-row items-center justify-between my-5 shadow-lg">
        {/* Text Content */}
        <div className="flex-1 text-left mb-4 md:mb-0">
          <h3 className="text-sm md:text-4xl font-bold mb-2 md:mb-6">
            Welcome Back, {firstName} {lastName}!
          </h3>
          <p className="text-[10px] md:text-lg md:font-thin">
            You have <strong>8+ pending tests</strong>, gear up and start
            preparing now!
          </p>
        </div>

        {/* Image Div */}
        <div className="flex-shrink-0 w-[150px] md:w-[390px] flex justify-end">
          <Image
            src="/hero.png" // Replace with actual image path
            alt="Teacher and Students"
            width={390}
            height={190}
            className="w-auto md:w-[390px] h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
