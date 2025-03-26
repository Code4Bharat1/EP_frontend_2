'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const GetCertified = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Simulate delayed content loading
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    router.push('/signup'); // Navigate to signup page
  };

  const handleBack = () => {
    router.push('/chooseyourcourse'); // Navigate back to Choose Your Course
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-4 md:px-8">
      {/* Skip Button at Top Right */}
      <button
        className="absolute top-4 right-5 text-sm font-extrabold md:font-semibold md:text-xl text-blue-600 hover:text-blue-800 md:right-8"
        style={{ padding: '0.5rem 1rem', lineHeight: '1.2rem' }}
        onClick={() => router.push('/')}
      >
        Skip
      </button>

      {/* Certification Image */}
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } md:mt-12`}
      >
        <Image
          src="/getcertificate.png"
          alt="Get Certified"
          width={432}
          height={312}
          layout="intrinsic"
          className="mx-auto h-64 w-60 md:w-[350px] md:h-[300px]" // Adjusted width for md screens
        />
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center gap-2 mt-6 mb-6">
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <div
          className={`w-3 h-3 rounded-full ${
            isVisible ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        ></div>
      </div>

      {/* Certification Text */}
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
          Get Certified
        </p>
        <p className="text-lg md:text-2xl font-semibold mt-4">
          Start learning and get certified after <br />
          your training to get a lucrative job.
        </p>
      </div>

      {/* Back and Get Started Buttons */}
      <div className="flex justify-between items-center w-full max-w-3xl mt-8 md:px-20 md:gap-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="text-blue-600 font-extrabold md:font-bold hover:text-blue-800 ml-1 transition-all duration-500 text-lg md:text-2xl"
        >
          Back
        </button>

        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-500 text-lg md:text-2xl"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default GetCertified;
