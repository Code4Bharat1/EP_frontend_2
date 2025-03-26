'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AiOutlineSend } from 'react-icons/ai';

const ForgotPassword = () => {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // API base URL from environment variables

  // Step 1: Send email to request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/students/forgot-password`, {
        emailAddress: email,
      });

      if (response.status === 200) {
        setMessage('OTP sent to your email for password reset.');
        setIsOtpSent(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset Password by sending email, OTP, and new password together
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Basic validation: Ensure all fields are filled out
    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill out all fields: OTP, new password, and confirm password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/students/reset-password`, {
        emailAddress: email,
        otp,          // OTP as a string
        newPassword,  // New password field
      });

      if (response.status === 200) {
        setMessage('Your password has been successfully reset.');
        // Optionally, redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset the password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="hidden md:flex md:w-[40%] bg-[#1977F3] items-center justify-center">
        <Image
          src="/nexcore-logo-pc.png"
          alt="Nexcore Logo"
          width={300}
          height={200}
          className="object-contain"
        />
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-center justify-center w-full md:w-[60%] bg-white p-6 md:rounded-l-3xl">
        {/* Logo Section for Mobile */}
        <div className="md:hidden flex justify-center mb-6">
          <Image
            src="/nexcore-logo-pc.jpg"
            alt="Nexcore Logo"
            width={160}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Heading Section */}
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#000] mb-4">
          Forgot Your Password?
        </h2>
        <p className="mb-8 text-md text-gray-500 text-lg md:text-2xl md:py-6">
          Enter your email address to receive an OTP for password reset.
        </p>

        {/* Form Section */}
        <form
          onSubmit={isOtpSent ? handleResetPassword : handleEmailSubmit}
          className="space-y-6 w-full md:w-full max-w-md"
        >
          {/* Email Field (only visible before OTP is sent) */}
          {!isOtpSent && (
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter Your Email"
              />
            </div>
          )}

          {/* OTP, New Password, and Confirm Password Fields (visible after OTP is sent) */}
          {isOtpSent && (
            <>
              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={4}
                  className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter OTP"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter New Password"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirm New Password"
                />
              </div>
            </>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* Success Message */}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 bg-[#1977F3] text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center justify-center ${
              isLoading && 'opacity-75'
            }`}
            disabled={isLoading}
          >
            <AiOutlineSend className="text-lg mr-2" />
            {isLoading
              ? 'Sending...'
              : isOtpSent
              ? 'Reset Password'
              : 'Send OTP'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 font-semibold">
            Remember your password?{' '}
            <button
              onClick={() => router.push('/login')}
              className="font-bold text-[#1977F3] hover:text-blue-800 transition-all"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
