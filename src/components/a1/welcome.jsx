'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Mock backend API calls
const checkUserSession = async () => {
  // Simulate a backend check for user session
  return new Promise((resolve) =>
    setTimeout(() => resolve({ isAuthenticated: true, userName: 'John Doe' }), 1000)
  );
};

const WelcomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState(null); // User data from backend
  const router = useRouter();

  useEffect(() => {
    // Simulate delayed content loading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Fetch user data (e.g., check user session or retrieve user info from backend)
    const fetchUserData = async () => {
      const userData = await checkUserSession(); // Simulate backend call
      setUser(userData); // Set user data
    };

    fetchUserData(); // Call to fetch user data

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    router.push('/chooseyourcourse'); // Navigate to the choose your course page
  };

  const handleSkip = () => {
    router.push('/login'); // Navigate to the home or login page
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-4 md:px-8">
      {/* Skip Button at Top Right */}
      <button
        className="absolute top-4 right-5 md:right-8 text-sm font-extrabold md:font-semibold md:text-xl text-[#007AFF] hover:text-blue-800"
        style={{ padding: '0.5rem 1rem', lineHeight: '1.2rem' }}
        onClick={handleSkip}
      >
        Skip
      </button>

      {/* Welcome Image */}
      <div
        className={`transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <Image
          src="/welcome.png"
          alt="Welcome"
          width={864}
          height={566}
          layout="intrinsic"
          className="mx-auto md:mt-12 md:w-[600px] md:h-[300px]" // Added margin-top for md screens
        />
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center items-center gap-2 mt-6 mb-6">
        <span
          className={`block w-3 h-3 rounded-full ${isVisible ? 'bg-[#007AFF]' : 'bg-gray-300'}`}
        ></span>
        <span className="block w-3 h-3 rounded-full bg-gray-300"></span>
        <span className="block w-3 h-3 rounded-full bg-gray-300"></span>
      </div>

      {/* Welcome Text */}
      <div
        className={`flex flex-col items-center text-center my-4 py-4 transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <p
          className="text-xl md:text-4xl font-extrabold text-[#007AFF]"
          style={{
            fontFamily: 'Poppins',
            lineHeight: '1.5em',
          }}
        >
          Welcome to Nexcore Alliance
        </p>
        <p className="text-lg md:text-lg font-medium mt-7">
          Welcome as you learn a world <br />
          changing skill to get a better job.
        </p>
      </div>

      {/* User Info */}
      {user && (
        <div className="mt-4 text-lg font-semibold text-gray-800">
          Hello, {user.userName}! {/* Displaying the username fetched from the backend */}
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="absolute bottom-20 right-8 md:relative md:mt-14 px-10 md:px-16 md:ml-14 py-3 bg-[#007AFF] text-white font-semibold rounded-md hover:bg-blue-700 transition-all duration-500 text-lg md:text-xl"
        style={{
          width: 'max-content',
          lineHeight: '1.2em',
        }}
      >
        Next
      </button>
    </div>
  );
};

export default WelcomePage;
