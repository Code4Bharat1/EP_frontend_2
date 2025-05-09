"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

function GoalSetup() {
  const [targetScore, setTargetScore] = useState("");
  const [targetYear, setTargetYear] = useState("");
  const [weakSubject, setWeakSubject] = useState("");
  const [strongSubject, setStrongSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataExists, setDataExists] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkStudentData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const decoded = JSON.parse(atob(authToken.split(".")[1]));
        const studentId = decoded.id;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/recommendtest/alldatahere`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        const studentSpecificData = response.data.filter(
          (item) => item.studentId === studentId.toString()
        );

        if (studentSpecificData.length > 0) {
          router.push("/examplan");
        } else {
          setDataExists(false);
        }
      } catch (err) {
        console.error("Error checking student data:", err);
        setError("Failed to fetch student data.");
      } finally {
        setLoading(false);
      }
    };

    checkStudentData();
  }, []);


  // Handle input changes for target score and year
  const handleScoreChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    if (Number(value) > 720) value = "720";
    setTargetScore(value);
  };

  const handleYearChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    setTargetYear(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetScore || !targetYear || !weakSubject || !strongSubject) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/recommendtest/give_test`,
        {
          target_marks: targetScore,
          weak_subject: weakSubject,
          strong_subject: strongSubject,
          available_time: targetYear,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      router.push("/examplan");
    } catch (err) {
      console.error("Error submitting exam plan:", err);
      setError(err.response?.data?.message || "Failed to submit exam plan.");
    } finally {
      setLoading(false);
    }
  };

  // If the data exists (it was checked by API call above), the form is skipped
  if (dataExists === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // If no data found, show Goal Setup page
  if (dataExists === false) {
    return (
      <div className="flex justify-center items-start min-h-screen px-4 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-10 md:gap-14 items-center">
          <div className="flex justify-center items-center">
            <Image
              src="/goalsetup.png"
              alt="Goal Setup"
              width={400}
              height={400}
              className="object-contain md:h-[690px] md:w-[500px]"
            />
          </div>
          <div className="bg-white p-8 md:p-8 md:h-[660px] rounded-3xl shadow-md border-r-4 border-b-8 border-l-4 border-[#B1CEFB]">
            <h2 className="text-center text-2xl md:text-3xl font-bold mb-8">
              Goal Setup
            </h2>
            <p className="hidden md:block text-center text-[16px] mb-8 text-gray-600">
              Set your target score and track your progress effectively.
            </p>
            <p className="md:hidden text-center text-[14px] text-gray-600">
              Set your target score and track <br /> your progress effectively.
            </p>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative z-0 group mb-3 md:mb-12">
                  <input
                    type="text"
                    name="target_score"
                    id="target_score"
                    value={targetScore}
                    onChange={handleScoreChange}
                    maxLength="3"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="block py-2.5 px-0 w-full text-sm md:text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="target_score"
                    className="absolute text-sm md:text-lg text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
                  >
                    Target Score *
                  </label>
                </div>

                <div className="relative z-0 group mb-6 md:mb-12">
                  <input
                    type="text"
                    name="target_year"
                    id="target_year"
                    value={targetYear}
                    onChange={handleYearChange}
                    maxLength="4"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="block py-2.5 px-0 w-full text-sm md:text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="target_year"
                    className="absolute text-sm md:text-lg text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] start-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
                  >
                    Target Year *
                  </label>
                </div>
              </div>
              <div className="relative z-0 group mb-6 md:mb-12">
            <select
              name="weak_subject"
              id="weak_subject"
              value={weakSubject}
              onChange={(e) => setWeakSubject(e.target.value)}
              className="block w-full py-2.5 px-0 text-sm md:text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option value="" disabled>
                Select Weak Subject *
              </option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
            <label
              htmlFor="weak_subject"
              className="absolute text-sm md:text-lg text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
            >
              Weak Subject *
            </label>
          </div>

          <div className="relative z-0 group mb-4 md:mb-12">
            <select
              name="strong_subject"
              id="strong_subject"
              value={strongSubject}
              onChange={(e) => setStrongSubject(e.target.value)}
              className="block w-full py-2.5 px-0 text-sm md:text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            >
              <option value="" disabled>
                Select Strong Subject
              </option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
            <label
              htmlFor="strong_subject"
              className="absolute text-sm md:text-lg text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
            >
              Strong Subject
            </label>
          </div>

              <div className="flex justify-center items-center mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-[90%] bg-[#E12828] text-white font-medium text-lg md:text-xl py-3 md:py-5 rounded-sm hover:bg-red-700 transition"
                >
                  {loading ? "Generating Plan..." : "View Exam Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default GoalSetup;
