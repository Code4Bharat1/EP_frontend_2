"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoCameraOutline } from "react-icons/io5";
import Select from "react-select";
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const PersonalData = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    examType: "",
    language: [],
    dateOfBirth: "",
    email: "",
    country: "",
    state: "",
    city: "",
    fullAddress: "",
  });

  const [profileImage, setProfileImage] = useState("/profile.jpg");
  const [isEditable, setIsEditable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isDataFilled, setIsDataFilled] = useState(false);

  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`${apiBaseUrl}/students/getdata`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.status === 200) {
          const userData = response.data;

          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.emailAddress || "",
            examType: userData.examType || "",
            language: userData.language
              ? userData.language.map((lang) => ({ value: lang, label: lang }))
              : [],
            dateOfBirth: userData.dateOfBirth || "",
            country: userData.domicileState || "",
            state: userData.location || "",
            city: userData.city || "",
            fullAddress: userData.fullAddress || "",
          });
          const storedImage = localStorage.getItem("profileImage");
          setProfileImage(
            storedImage || userData.profileImage || "/profile.jpg"
          );
        }
      } catch (error) {
        console.error("Error fetching personal data:", error);
      }
    };
    fetchPersonalData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Handle language selection
  const handleLanguageChange = (selectedOptions) => {
    setFormData((prev) => ({ ...prev, language: selectedOptions }));
  };
  // Handling Good Images. 
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      localStorage.setItem("profileImage", reader.result);
    };
    setProfileImage(file);
  };
  //saving data.
  const handleUpdateClick = async () => {
    setIsUpdating(true);
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        router.push("/login");
        return;
      }
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("examType", formData.examType);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("emailAddress", formData.email);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("fullAddress", formData.fullAddress);

      // Convert selected languages to JSON format
      formDataToSend.append(
        "language",
        JSON.stringify(formData.language.map((lang) => lang.value))
      );

      // Only append profileImage if user uploads a new one
      if (profileImage && typeof profileImage !== "string") {
        formDataToSend.append("profileImage", profileImage);
      }

      const response = await axios.post(
        `${apiBaseUrl}/students/adddata`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowPopup(true);
        setIsEditable(false);
        setTimeout(() => setShowPopup(false), 3000);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error updating personal data:", error);
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className="p-6 w-full relative">
      {/* Profile Section */}
      <div className="flex justify-between items-center mb-6">
        {/* Profile Details */}
        <div className="flex items-center space-x-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300">
            {/* Profile Image */}
            <img
              src={profileImage || "/profile.jpg"} // Use profile image from backend, fallback to default
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {/* Camera Icon */}
            {isEditable && (
              <label className="absolute bottom-2 right-2 bg-white p-1 rounded-full cursor-pointer shadow-md">
                <IoCameraOutline className="text-gray-700 text-xl" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
          {/* Name & Email */}
          <div>
            <h2 className="text-xl font-bold">Dear, {formData.firstName} {formData.lastName} 👨🏻‍🦱</h2>
            <p className="text-gray-500">{formData.email}</p>
          </div>
        </div>
        {/* Edit / Update Button */}
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

      {/* Image Upload Guidelines - Visible Only in Edit Mode */}
      {isEditable && (
        <p className="text-sm text-gray-500 my-4">
          Format should be in <b>.jpeg, .png</b> at least <b>800x800px</b> and
          less than <b>5MB</b>.
        </p>
      )}

      {/* Pop-up Notification After Update */}
      {showPopup && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          ✅ Updated Successfully!
        </div>
      )}

      {/* Personal Details Form */}
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
          <SelectField
            label="Exam Type"
            name="examType"
            options={["JEE", "NEET", "Both"]}
            value={formData.examType}
            onChange={handleChange}
            isEditable={isEditable}
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            isEditable={isEditable}
          />
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Language
            </label>
            <Select
              isMulti
              options={[
                { value: "English", label: "English" },
                { value: "Hindi", label: "Hindi" },
              ]}
              value={formData.language}
              onChange={handleLanguageChange}
              isDisabled={!isEditable}
              className="w-full focus:ring-[#45A4CE]"
            />
          </div>
          <InputField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            isEditable={isEditable}
          />
        </div>

        {/* Address Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Address</h2>
          <p className="text-gray-500 mb-6">Your current domicile</p>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <SelectField
              label="Country"
              name="country"
              options={["India", "USA", "UK"]}
              value={formData.country}
              onChange={handleChange}
              isEditable={isEditable}
            />
            <SelectField
              label="State"
              name="state"
              options={
                formData.country === "India" ? ["Maharashtra", "Karnataka"] : []
              }
              value={formData.state}
              onChange={handleChange}
              isEditable={isEditable}
              disabled={!formData.country}
            />
            <SelectField
              label="City"
              name="city"
              options={
                formData.state === "Maharashtra" ? ["Mumbai", "Pune"] : []
              }
              value={formData.city}
              onChange={handleChange}
              isEditable={isEditable}
              disabled={!formData.state}
            />
            <TextAreaField
              label="Full Address"
              name="fullAddress"
              placeholder="Enter your full address"
              value={formData.fullAddress}
              onChange={handleChange}
              isEditable={isEditable}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

/* Reusable Components */
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

const SelectField = InputField;
const TextAreaField = InputField;

export default PersonalData;


