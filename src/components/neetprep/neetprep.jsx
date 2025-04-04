"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const NeetPrep = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [subjectUnits, setSubjectUnits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const subjects = ["Biology", "Physics", "Chemistry"];
  const chapters = {
    Biology: "Diversity in Living World",
    Physics: "Laws of Motion",
    Chemistry: "Chemical Bonding",
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/recommendtest/getbyid`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        if (response.data && response.data.data?.length > 0) {
          const data = response.data.data[0];
          setStudentData(data);
          setSubjectUnits(data.subjectWisePlan || {});
        } else {
          setError("No data found for this student.");
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to fetch preparation plan.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  const handleSubjectToggle = (subject) => {
    if (selectedSubjects.includes(subject)) {
      const updatedSubjects = selectedSubjects.filter(
        (item) => item !== subject
      );
      setSelectedSubjects(updatedSubjects);
      if (updatedSubjects.length === 0) {
        setSelectedChapter("");
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
      setSelectedChapter(chapters[subject]);
    }
  };

  const progress = Math.min(
    (selectedSubjects.length / subjects.length) * 100,
    100
  );

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleStartTest = (subject, chapter) => {
    // Calculate the number of allocated questions for the chapter
    const allocatedQuestions = subjectUnits?.[subject]?.find(
      (unit) => unit.chapter === chapter
    )?.expected_questions;
    if (allocatedQuestions) {
      router.push(
        `/testinterfaceplan?chapter=${encodeURIComponent(
          chapter
        )}&allocatedQuestions=${allocatedQuestions}&subject=${subject}`
      );
    } else {
      setError("No data found for the selected chapter.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading your plan...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen md:-mt-16 p-4">
      <motion.div
        className="w-full max-w-6xl bg-white rounded-3xl shadow-lg shadow-blue-400 p-8 relative"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.2 }}
      >
        {/* Header */}
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          variants={fadeIn}
        >
          Your NEET Preparation Plan
        </motion.h1>

        {/* Subject Wise Selection */}
        <motion.div className="mt-8" variants={fadeIn}>
          <label className="block text-sm font-medium text-center">
            Subject Wise <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {Object.keys(subjectUnits || {}).map((subject) => (
              <motion.div
                key={subject}
                className={`px-6 py-2 rounded-lg border text-center cursor-pointer ${
                  selectedSubjects.includes(subject)
                    ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                    : "border-gray-300 text-gray-700"
                }`}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSubjectToggle(subject)}
              >
                {subject}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Chapter Section */}
        {selectedSubjects.length === 0 ? (
          <motion.div
            className="bg-white p-4 mt-8 rounded-lg border w-11/12 mx-auto text-center text-gray-500"
            variants={fadeIn}
          >
            Select a subject to see chapters
          </motion.div>
        ) : (
          selectedSubjects.map((subject, i) => (
            <motion.div
              key={i}
              className="bg-white p-4 mt-8 rounded-lg border w-11/12 mx-auto"
              variants={fadeIn}
            >
              <h2 className="text-lg font-semibold mb-4">
                {subject} Chapters <span className="text-red-500">*</span>
              </h2>
              <div className="space-y-4">
                {(subjectUnits?.[subject] || []).map((unit, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-3"
                  >
                    <div className="text-sm text-gray-800">
                      <strong>{unit.chapter}</strong> — {unit.allocated_time}{" "}
                      days, {unit.expected_questions} questions
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">25%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `25%` }} // Static for now
                        ></div>
                      </div>
                      <button
                        className="px-4 py-1.5 text-sm rounded-md bg-[#49A6CF] text-white hover:bg-[#3c91b3] transition"
                        onClick={() => handleStartTest(subject, unit.chapter)}
                      >
                        Start Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}

        {/* Girl Image */}
        <motion.div
          className="absolute left-0 bottom-8 md:bottom-36 w-40 md:w-60 ml-32"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/girl.png"
            alt="Girl studying"
            width={600}
            height={600}
            className="w-full h-auto"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NeetPrep;