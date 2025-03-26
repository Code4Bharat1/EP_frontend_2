"use client";
import Image from "next/image";

const UniversityMobile = () => {
  return (
    <section className="grid grid-cols-2 gap-0 pl-[2rem] pr-[1rem] py-8 items-center">
      {/* Left Side - Images Section */}
      <div className="flex flex-col items-center">
        {/* First Image with Badge */}
        <div className="relative w-[13rem]">
          <Image
            src="/college1.png" // Update with actual image path
            width={320}
            height={260}
            alt="College Image"
            className="rounded-2xl shadow-lg w-full"
          />
          {/* Student Count Badge */}
          <div className="absolute -bottom-[3.5rem] left-1/2 transform -translate-x-1/2 bg-white shadow-lg px-4 py-2 rounded-3xl flex flex-col items-center w-28">
            <span className="text-blue-600 font-semibold text-lg">50K+</span>
            <span className="text-gray-600 text-sm">Students</span>
            <div className="flex -space-x-1 mt-1">
              <Image src="/student1.png" width={22} height={22} alt="Avatar" className="rounded-full border border-white"/>
              <Image src="/student2.png" width={22} height={22} alt="Avatar" className="rounded-full border border-white"/>
              <Image src="/student3.png" width={22} height={22} alt="Avatar" className="rounded-full border border-white"/>
            </div>
          </div>
        </div>

        {/* Second Image */}
        <div className="mt-[1rem] w-[98%] max-w-xs">
          <Image
            src="/college2.png" // Update with actual image path
            width={320}
            height={260}
            alt="Campus Image"
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
      </div>

      {/* Right Side - Statistics Section */}
      <div className="flex flex-col justify-start items-end space-y-4">
        {/* Header */}
        <span className="text-lg font-bold text-blue-600 pr-4">Target College</span>

        {/* Statistics */}
        <div className="w-32 bg-white drop-shadow-lg rounded-3xl p-4 flex flex-col items-center text-center">
          <span className="text-blue-600 text-2xl font-bold">35+</span>
          <p className="text-gray-900 text-sm">Course</p>
        </div>
        <div className="w-32 bg-white drop-shadow-lg rounded-3xl p-4 flex flex-col items-center text-center">
          <span className="text-blue-600 text-2xl font-bold">56+</span>
          <p className="text-gray-900 text-sm">Startups</p>
        </div>
        <div className="w-32 bg-white drop-shadow-lg rounded-3xl p-4 flex flex-col items-center text-center">
          <span className="text-blue-600 text-2xl font-bold">100+</span>
          <p className="text-gray-900 text-sm">Language</p>
        </div>
        <div className="w-32 bg-white drop-shadow-lg rounded-3xl p-4 flex flex-col items-center text-center">
          <span className="text-blue-600 text-2xl font-bold">150+</span>
          <p className="text-gray-900 text-sm">Professors</p>
        </div>
      </div>
    </section>
  );
};

export default UniversityMobile;
