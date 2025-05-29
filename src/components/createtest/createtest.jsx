"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaAtom, FaFlask, FaLeaf } from "react-icons/fa"; // Removed GiAnimalHide
import Chapters from "../chapters/chapters";
import Preview from "../preview/preview";

const Createtest = () => {
  const router = useRouter(); // Initialize router

  const [activeStep, setActiveStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [testName, setTestName] = useState("");

  const steps = ["Subjects", "Chapters", "Preview"];

  //useEffect to control the escape screen
    useEffect (() => {
      const handleFullScreenChange = () =>{
        if(!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement && !document.mozFullscreenElement) {
          //push the page 
          router.push("/testselection")
        }
      }
  
      document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);
  
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
    },[])
  
  // Load selected subjects from local storage on mount
  useEffect(() => {
    const savedSubjects = JSON.parse(
      localStorage.getItem("selectedSubjects") || "[]"
    );
    setSelectedSubjects(savedSubjects);
  }, []);

  // Function to handle subject selection
  const handleSubjectSelection = (subject) => {
    setSelectedSubjects((prevSelectedSubjects) => {
      let updatedSubjects;
      if (prevSelectedSubjects.includes(subject)) {
        updatedSubjects = prevSelectedSubjects.filter(
          (item) => item !== subject
        );
      } else {
        updatedSubjects = [...prevSelectedSubjects, subject];
      }

      // Update local storage
      localStorage.setItem("selectedSubjects", JSON.stringify(updatedSubjects));
      return updatedSubjects;
    });
  };

  // Show Popup if going from Step 2 to Step 3
  const handleNext = () => {
    if (activeStep === 2) {
      setShowPopup(true);
    } else {
      setActiveStep((prev) => Math.min(2, prev + 1));
    }
  };

  // Handle Generate Test redirecting to TestInterface.jsx
  const handleGenerateTest = () => {
    if (selectedSubjects.length > 0) {
      router.push("/testinterfaceCT");
      localStorage.removeItem("testAnswers");
    }
  };

  // Handle test name submission
  const handleSubmitTestName = () => {
    if (testName.trim() !== "") {
      localStorage.setItem("testName", testName); // Save test name to local storage
      setShowPopup(false);
      setActiveStep(3); // Move to preview page
    }
  };

  return (
    <div className="w-full h-screen p-4 bg-white relative">
      {/* Header */}
      <div className="flex justify-center items-center w-[200px] h-12 rounded-xl md:h-20 mx-auto mb-6 bg-[#54ADD3] text-white text-2xl font-bold">
        <h1 className="text-2xl font-bold flex items-center justify-center">
          <span className="bg-white rounded-full h-6 w-6 p-[2px] pr-[4px] flex items-center justify-center mr-2 text-[#54ADD3]">
            +
          </span>
          Create Test
        </h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center w-full mb-6">
        <ol className="flex w-full max-w-4xl text-xs text-black font-medium sm:text-base">
          {steps.map((step, index) => (
            <li
              key={index}
              className="relative flex flex-grow items-center justify-center"
            >
              {index !== 0 && index !== steps.length && (
                <div className="absolute top-1/3 left-[-50%] w-full h-0.5 bg-gray-300 -z-8"></div>
              )}
              <div className="relative z-10 flex flex-col items-center">
                <span
                  className={`w-10 h-10 lg:w-12 lg:h-12 border-2 border-gray-300 rounded-full flex justify-center items-center text-sm font-bold transition-all duration-300
                    ${
                      activeStep === index + 1
                        ? "bg-[#54ADD3] text-white border-transparent"
                        : "bg-gray-200 text-black"
                    }`}
                >
                  {index + 1}
                </span>
                <span className="mt-2">{step}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Content Section */}
      <div className="relative mt-6 flex flex-row md:flex-row w-full">
        {activeStep === 1 && (
          <>
            <div className="w-full md:w-1/2 flex items-center justify-center mb-6 md:mb-0 md:pl-2">
              <img
                src="/createtest.png"
                alt="Create Test"
                className="w-[70%] md:w-[300px] h-[150px] md:h-[300px] object-contain"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-4 md:gap-6 sm:w-[100px] justify-center">
              {["Physics", "Chemistry", "Biology"].map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3"
                >
                  <button
                    onClick={() => handleSubjectSelection(subject)}
                    className={`w-full md:w-[500px] px-6 py-4 text-lg font-semibold text-white rounded-lg shadow-md hover:scale-105 transition-transform flex items-center gap-3
                      ${
                        selectedSubjects.includes(subject)
                          ? "bg-gradient-to-r from-[#54ADD3] to-[#3184A6]"
                          : "bg-[#71C1DE]"
                      }`}
                  >
                    <span className="text-2xl">
                      {subject === "Physics" && "⚛️"}
                      {subject === "Chemistry" && "🧪"}
                      {subject === "Biology" && "🌱"}
                    </span>
                    {subject}
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => handleSubjectSelection(subject)}
                      className="h-5 w-5 ml-auto rounded-md border-2 border-white cursor-pointer"
                    />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Step 2: Chapter Selection */}
      <div className="mt-6">{activeStep === 2 && <Chapters />}</div>

      {/* Step 3: Preview */}
      <div className="mt-6">{activeStep === 3 && <Preview />}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-3 flex-wrap pb-2">
        <button
          onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
          disabled={activeStep === 1}
          className="px-6 py-2 bg-[#54ADD3] text-white rounded-md cursor-pointer disabled:opacity-50"
        >
          Previous
        </button>

        {activeStep !== 3 && (
          <button
            onClick={handleNext}
            disabled={
              (activeStep === 1 && selectedSubjects.length === 0) ||
              (activeStep === 2 &&
                JSON.parse(localStorage.getItem("selectedChapters") || "[]")
                  .length === 0)
            }
            className="px-6 py-2 bg-[#54ADD3] text-white rounded-md cursor-pointer disabled:opacity-50"
          >
            Next
          </button>
        )}

        {activeStep === 3 && (
          <button
            onClick={handleGenerateTest}
            disabled={selectedSubjects.length === 0}
            className="px-6 py-2 bg-[#54ADD3] text-white rounded-md cursor-pointer disabled:opacity-50"
          >
            Generate Test
          </button>
        )}
      </div>

      {/* Popup for Test Name */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[350px]">
            <h2 className="text-lg font-semibold mb-4">Enter Your Test Name</h2>
            <input
              type="text"
              placeholder="Test Name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            />
            <button
              onClick={handleSubmitTestName}
              className="px-4 py-2 bg-[#54ADD3] text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Createtest;
