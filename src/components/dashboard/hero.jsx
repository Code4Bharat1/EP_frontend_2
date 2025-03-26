'use client';
import Image from "next/image";

const Hero = () => {
  const userName = "Basim Thakur"; // Placeholder for backend data

  return (
    <div className="flex items-end justify-center w-full">
      <div className="w-full h-[120px] md:h-[262px] mx-4 bg-gradient-to-r from-[#0077B6] to-[#ADE8F4] text-white rounded-lg p-6 md:p-8 flex flex-row items-center justify-between my-5 shadow-lg">
        
        {/* Text Content */}
        <div className="flex-1 text-left mb-4 md:mb-0">
          <h3 className="text-sm md:text-4xl font-bold mb-2 md:mb-6">
            Welcome Back, {userName}!
          </h3>
          <p className="text-[10px] md:text-lg md:font-thin">
            You have <strong>8+ pending tests</strong>, gear up and start preparing now!
          </p>
        </div>

        {/* Image Div */}
        <div className="flex-shrink-0 w-[150px] md:w-[390px] flex justify-end">
          <Image
            src="/hero.png"  // Replace with actual image path
            alt="Teacher and Students"
            width={390}  
            height={190} 
            className="w-auto md:w-[390px] h-auto object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default Hero;
