"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoCameraOutline } from "react-icons/io5";
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const PersonalData = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    updatedProfileImage: "",
    firstName: "",
    lastName: "",
    examType: "",
    gender: "",
    dateOfBirth: "",
    emailAddress: "",
    targetYear: "",
    domicileState: "",
    mobileNumber: "",
    fullAddress: "",
  });

  const [profileImage, setProfileImage] = useState("/profile.jpg");
  const [isEditable, setIsEditable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) return;

        const response = await axios.get(`${apiBaseUrl}/students/getdata`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200) {
          const userData = response.data;
          setFormData({
            id: authToken,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            emailAddress: userData.emailAddress || "",
            examType: userData.examType || "",
            gender: userData.gender || "",
            dateOfBirth: userData.dateOfBirth || "",
            targetYear: userData.targetYear || "",
            domicileState: userData.domicileState || "",
            mobileNumber: userData.mobileNumber || "",
            fullAddress: userData.fullAddress || "",
          });

          console.log(formData);

          setProfileImage(userData.profileImage || "/profile.jpg");
        }
      } catch (error) {
        console.error("Error fetching personal data:", error);
      }
    };
    fetchPersonalData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("profileImage", reader.result);
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateClick = async () => {
    setIsUpdating(true);
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.error("No auth token found");
        return;
      }

      // Decode the JWT token to get the student ID
      const decodeJWT = (token) => {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          return JSON.parse(atob(base64));
        } catch (error) {
          console.error("Error decoding JWT:", error);
          return null;
        }
      };

      const decodedToken = decodeJWT(authToken);
      const studentId = decodedToken?.id; // Adjust based on your JWT structure

      if (!studentId) {
        throw new Error("Unable to decode student ID from token");
      }

      // Get profile image from localStorage or state
      const updatedProfileImage =
        localStorage.getItem("profileImage") || profileImage;

      // Prepare the data to send
      const requestData = {
        id: studentId,
        updatedImageUrl: updatedProfileImage,
        firstName: formData.firstName,
        lastName: formData.lastName,
        examType: formData.examType,
        dateOfBirth: formData.dateOfBirth,
        domicileState: formData.domicileState,
        targetYear: formData.targetYear,
        mobileNumber: formData.mobileNumber,
        gender: formData.gender,
        emailAddress: formData.emailAddress,
        fullAddress: formData.fullAddress,
      };

      console.log("Sending data :", requestData);

      const response = await axios.post(
        `${apiBaseUrl}/students/newdata`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setShowPopup(true);
        setIsEditable(false);
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch (error) {
      console.error("Error updating personal data:", error);
      alert(`Update failed: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 w-full relative">
      {/* Profile Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {isEditable && (
              <label className="absolute bottom-2 right-2 bg-white p-1 rounded-full cursor-pointer shadow-md">
                <IoCameraOutline className="text-gray-700 text-xl" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              Dear, {formData.firstName} {formData.lastName} 👨🏻‍🦱
            </h2>
            <p className="text-gray-500">{formData.emailAddress}</p>
          </div>
        </div>
        <button
          onClick={!isEditable ? () => setIsEditable(true) : handleUpdateClick}
          className={`px-6 py-2 rounded text-white font-medium ${
            isEditable
              ? "bg-[#0077B6] hover:bg-[#498fb5]"
              : "bg-[#45A4CE] hover:bg-[#3589ac]"
          }`}
        >
          {isUpdating ? "Updating..." : isEditable ? "Update" : "Edit"}
        </button>
      </div>

      {isEditable && (
        <p className="text-sm text-gray-500 my-4">
          Format should be in <b>.jpeg, .png</b> at least <b>800x800px</b> and
          less than <b>5MB</b>.
        </p>
      )}

      {showPopup && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          ✅ Updated Successfully!
        </div>
      )}

      <form>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField
            label="First Name"
            name="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            isEditable={isEditable}
          />
          <InputField
            label="Last Name"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            isEditable={isEditable}
          />

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Exam Type
            </label>
            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              disabled={!isEditable}
              className="bg-[#F9F9F9] border-none text-gray-900 text-sm rounded-lg focus:ring-[#45A4CE] focus:border-[#45A4CE] block w-full p-2.5"
            >
              <option value="">Select exam type</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <InputField
            label="Email Address"
            name="emailAddress"
            type="email"
            placeholder="example@example.com"
            value={formData.emailAddress}
            onChange={handleChange}
            isEditable={isEditable}
          />

          <InputField
            label="Gender"
            name="gender"
            type="text"
            placeholder="Male/Female/Other"
            value={formData.gender}
            onChange={handleChange}
            isEditable={isEditable}
          />

          <InputField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            isEditable={isEditable}
          />

          <InputField
            label="Target Year"
            name="targetYear"
            type="text"
            placeholder="2024"
            value={formData.targetYear}
            onChange={handleChange}
            isEditable={isEditable}
          />

          <InputField
            label="State (Domicile)"
            name="domicileState"
            type="text"
            placeholder="Maharashtra"
            value={formData.domicileState}
            onChange={handleChange}
            isEditable={isEditable}
          />

          <InputField
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            placeholder="9876543210"
            value={formData.mobileNumber}
            onChange={handleChange}
            isEditable={isEditable}
          />
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Address</h2>
          <p className="text-gray-500 mb-6">Your current domicile</p>
          <TextAreaField
            label="Full Address"
            name="fullAddress"
            placeholder="Enter your full address"
            value={formData.fullAddress}
            onChange={handleChange}
            isEditable={isEditable}
          />
        </div>
      </form>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  isEditable,
}) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-900">
      {label}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={!isEditable}
      className="bg-[#F9F9F9] border-none text-gray-900 text-sm rounded-lg focus:ring-[#45A4CE] focus:border-[#45A4CE] block w-full p-2.5"
    />
  </div>
);

const TextAreaField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  isEditable,
}) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-900">
      {label}
    </label>
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={!isEditable}
      rows={3}
      className="bg-[#F9F9F9] border-none text-gray-900 text-sm rounded-lg focus:ring-[#45A4CE] focus:border-[#45A4CE] block w-full p-2.5"
    />
  </div>
);

export default PersonalData;
