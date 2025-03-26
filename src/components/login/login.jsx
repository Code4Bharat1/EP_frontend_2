"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/students/login`,
        { emailAddress: formData.email, password: formData.password }
      );
      localStorage.setItem("authToken", response.data.token);
      router.push("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap bg-gradient-to-b from-[#0077B6] to-[#ADE8F4] min-h-screen">
      {/* Left Section */}
      <div className="hidden md:flex md:w-[40%] bg-gradient-to-b from-[#0077B6] to-[#ADE8F4] items-center justify-center">
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
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#45A4CE] mb-1">
          Welcome Back
        </h2>

        {/* Subheading Section */}
        <p className="text-center text-xl md:text-3xl mt-2 font-medium mb-6 text-[#45A4CE]">
          Login to continue
        </p>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#53ADD3] mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Email Address"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#53ADD3] mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Password"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 pt-7 pr-1"
            >
              {showPassword ? (
                <AiOutlineEye className="text-xl" />
              ) : (
                <AiOutlineEyeInvisible className="text-xl" />
              )}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-end md:justify-center">
            <div className="text-sm">
              <a
                href="#"
                onClick={() => router.push("/forgotpassword")}
                className="font-medium text-[#53ADD3] hover:text-[#3e9ec7]"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#45A4CE] text-white font-semibold rounded-md hover:bg-[#3e9ec7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 font-bold">
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={() => router.push("/signup")}
              className="font-semibold text-[#53ADD3] hover:text-[#3e9ec7] transition-all"
            >
              Sign up now
            </a>
          </p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
