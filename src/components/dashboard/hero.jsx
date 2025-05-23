"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Hero = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingData, setPendingData] = useState(0);

  const [colors, setColors] = useState({
    sidebarColor: "#0077B6", // fallback sidebar color
    textColor: "#ffffff", // fallback text color
  });

  useEffect(() => {
    const fetchSidebarColors = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const decoded = jwtDecode(token);
        const studentId = decoded.id;

        const response = await axios.post(`${apiBaseUrl}/newadmin/studentcolors`, {
          studentId,
        });

        if (response.data && response.data.colors) {
          const { sidebarColor, textColor } = response.data.colors;

          setColors({
            sidebarColor: sidebarColor || "#0077B6",
            textColor: textColor || "#ffffff",
          });
        }
      } catch (error) {
        console.error("Failed to fetch colors:", error);
      }
    };

    fetchSidebarColors();
  }, []);

  useEffect(() => {
    const fetchPendingTests = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get the token from localStorage
        const response = await axios.get(`${apiBaseUrl}/dashboard/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter the pending tests
        const pendingTestsData = response.data.filter(
          (test) => test.status === "pending"
        );

        setPendingData(pendingTestsData.length);
      } catch (error) {
        console.error("Error Fetching pending test ", error);
      }
    };

    fetchPendingTests();
  }, []);

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("No token found. Please login.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${apiBaseUrl}/dashboard/name`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex items-end justify-center w-full">
      <div
        className="w-full h-[120px] md:h-[262px] mx-4 rounded-lg p-6 md:p-8 flex flex-row items-center justify-between my-5 shadow-lg"
        style={{
          background: `linear-gradient(to right, ${colors.sidebarColor}, ${shadeColor(
            colors.sidebarColor,
            30
          )})`,
          color: colors.textColor,
        }}
      >
        {/* Text Content */}
        <div className="flex-1 text-left mb-4 md:mb-0">
          <h3 className="text-sm md:text-4xl font-bold mb-2 md:mb-6">
            Welcome Back, {firstName} {lastName}!
          </h3>
          <p className="text-[10px] md:text-lg md:font-thin">
            You have{" "}
            <strong className="font-bold">
              {pendingData}+ pending tests
            </strong>
            , gear up and start preparing now!
          </p>
        </div>

        {/* Image Div */}
        <div className="flex-shrink-0 w-[150px] md:w-[390px] flex justify-end">
          <Image
            src="/hero.png"
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

// Helper function to darken a hex color by percentage
function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 - percent)) / 100);
  G = parseInt((G * (100 - percent)) / 100);
  B = parseInt((B * (100 - percent)) / 100);

  R = R < 0 ? 0 : R;
  G = G < 0 ? 0 : G;
  B = B < 0 ? 0 : B;

  const RR = R.toString(16).padStart(2, "0");
  const GG = G.toString(16).padStart(2, "0");
  const BB = B.toString(16).padStart(2, "0");

  return `#${RR}${GG}${BB}`;
}

export default Hero;
