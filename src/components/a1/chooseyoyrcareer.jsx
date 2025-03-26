'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ChooseYourCourse = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Simulate delayed content loading
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    router.push('/getcertified'); // Change this to your actual next page path
  };

  const handleBack = () => {
    router.push('/'); // Modify as necessary for the actual path you want to go back to
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-4 md:px-8">
      {/* Skip Button at Top Right */}
      <button
        className="absolute top-4 right-5 text-sm font-extrabold md:font-semibold md:text-xl text-blue-600 hover:text-blue-800 md:right-8"
        style={{ padding: '0.5rem 1rem', lineHeight: '1.2rem' }}
        onClick={handleBack}
      >
        Skip
      </button>

      {/* Course Selection Image */}
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } md:mt-12`}
      >
        <Image
          src="/chooseyourcourse.png"
          alt="Choose Your Course"
          width={864}
          height={624}
          layout="intrinsic"
          className="mx-auto md:w-[500px] md:h-[270px]" // Increased size for md screens
        />
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center gap-2 mt-6 mb-6">
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div
          className={`w-3 h-3 rounded-full ${
            isVisible ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        ></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
      </div>

      {/* Course Selection Text */}
      <div
        className={`flex flex-col items-center text-center transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p
          className="text-2xl md:text-4xl font-extrabold text-blue-600"
          style={{
            fontFamily: 'Poppins',
            lineHeight: '1.5em',
          }}
        >
          Choose Your Course
        </p>
        <p className="text-lg md:text-2xl font-semibold mt-4">
          Choose the course of your choice <br />
          and gain industry knowledge and <br />
          experience in it.
        </p>
      </div>

      {/* Back and Next Buttons */}
      <div className="flex justify-between items-center w-full max-w-3xl mt-8 md:px-20 md:gap-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="text-blue-600 font-extrabold md:font-bold hover:text-blue-800 ml-1 transition-all duration-500 text-lg md:text-2xl"
        >
          Back
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-500 text-lg md:text-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChooseYourCourse;
