'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Import axios for API calls
import toast from 'react-hot-toast';

const VerifyYourEmail = () => {
  const [code, setCode] = useState(new Array(4).fill('')); // OTP input fields
  const [timeLeft, setTimeLeft] = useState(60); // Timer for OTP expiry
  const [email, setEmail] = useState(''); // Initialize as empty
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Should be http://localhost:3180/api

  useEffect(() => {
    // Fetch the email from localStorage (or another global state)
    const savedEmail = localStorage.getItem('email'); // Ensure email is saved here after registration
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      setError('No email found. Please register first.');
      // Optionally, redirect to registration page after a delay
      setTimeout(() => {
        router.push('/signup'); // Adjust the path as needed
      }, 3000); // Redirect after 3 seconds
    }

    // Timer countdown
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      resetTimer();
    }
  }, [timeLeft, router]);

  const resetTimer = () => {
    setTimeLeft(60); // Reset the timer to 60 seconds
    resendOtp();
  };

  const resendOtp = async () => {
    if (!email) {
      setError('Email address is missing. Cannot resend OTP.');
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/students/resend-otp`, {
        emailAddress: email,
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success('OTP resent successfully!',{
          duration: 5000
        });
        setTimeLeft(60); // Reset timer after successful resend
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred while resending OTP. Please try again.');
      }
      console.error('Error while resending OTP:', err);
    }
  };

  const handleChange = (element, index) => {
    if (!/^\d*$/.test(element.value)) return; // Allow only digits

    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    const otp = code.join('');

    if (otp.length !== 4) {
      setError('Please enter all 4 digits of the OTP.');
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/students/verify-otp`, {
        emailAddress: email,
        otp,
      });

      if (response.status >= 200 && response.status < 300) {
        toast.success('OTP verified successfully!',{
          duration: 5000
        });
        localStorage.removeItem('email'); // Optionally remove email from localStorage
        router.push('/login'); // Redirect to login page
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'An error occurred during OTP verification. Please try again.');
      }
      console.error('Error during OTP verification:', err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Blue Panel */}
      <div className="w-1/3 bg-gradient-to-b from-[#0077B6] to-[#ADE8F4] flex flex-col items-center justify-center">
        <img src="/nexcore-logo-pc.png" alt="Nexcore Alliance Logo" className="h-24" />
      </div>

      {/* Right Form Panel */}
      <div className="w-2/3 flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Verify Your Email Address</h2>
          <p className="text-center mb-4">
            We sent you a 4-digit code to verify your email address <br />(<b>{email}</b>). <br />
             Enter it in the below field.
          </p>
          <form onSubmit={handleVerify} className="flex justify-center space-x-2 mb-6">
            {code.map((data, index) => (
              <input
                key={index}
                className="w-12 h-12 text-center form-control form-control-lg bg-gray-200 border-none rounded-md"
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </form>
          <p className="text-center mb-4">
            Didn't get the code?{' '}
            <button
              type="button"
              onClick={resetTimer}
              className="text-blue-600 hover:text-blue-700"
              disabled={timeLeft > 0}
            >
              Resend
            </button> <br /> expire in
            {timeLeft > 0 && ` in ${timeLeft} seconds`}
          </p>
          <button
            type="submit"
            onClick={handleVerify}
            className="w-full py-2 bg-[#45A4CE] hover:bg-[#338eb5] text-white font-semibold rounded-md"
          >
            Submit
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default VerifyYourEmail;
