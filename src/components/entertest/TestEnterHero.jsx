'use client';
import Image from "next/image";

const TestEnterHero = () => {
  return (
    <div className="flex items-end justify-center w-full">
      <div className="w-full h-[120px] md:h-[262px] mx-4 bg-gradient-to-r from-[#0077B6] to-[#ADE8F4] text-white rounded-lg p-6 md:p-8 flex flex-row items-center justify-between my-5 shadow-lg">
        
        {/* Text Content */}
        <div className="flex-1 text-left mb-4 md:mb-0">
          <h2 className="text-sm md:text-4xl font-bold mb-2 md:mb-6">
            Test
          </h2>
          {/* for desktop */}
          <p className="hidden md:block font-normal md:text-2xl md:font-normal">
            Create your own personalized tests tailored to your <br />
             learning needs—choose topics, difficulty levels, and timing!
          </p>
          {/* For mobile */}
          <p className="text-[8px] font-normal md:hidden">
            Create your own personalized tests tailored to your
             learning needs—choose topics, difficulty levels, and timing!
          </p>
        </div>

        {/* Image Div */}
        <div className="flex-shrink-0 w-[150px] md:w-[390px] flex justify-end">
          <Image
            src="/entertest.png"  // Replace with actual image path
            alt="Enter Test"
            width={390}  
            height={190} 
            className="w-[110px] md:w-[250px] h-auto object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default TestEnterHero;
