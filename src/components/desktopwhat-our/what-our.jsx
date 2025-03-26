"use client";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

const testimonials = [
  {
    name: "Carmen Hodkiewicz",
    role: "Global Markets Engineer",
    image: "/what our 1.png", // Update this path to actual image
    feedback:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at massa sit amet nisi blandit vehicula adipiscing elit.",
  },
  {
    name: "John Doe",
    role: "Software Engineer",
    image: "/student2.png",
    feedback:
      "Vestibulum euismod, nisl eget consectetur sagittis, nisl nunc vehicula nisi, ut eleifend justo mauris eu purus.",
  },
  {
    name: "Jane Smith",
    role: "AI Researcher",
    image: "/student3.png",
    feedback:
      "Aenean tristique, tortor nec consequat vulputate, lorem arcu congue sapien, at pulvinar nisi libero vel nisi.",
  },
];

const Whatour = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="bg-[#49a6cf] text-white py-12 px-6 text-center">
      {/* Header Section */}
      <h2 className="text-3xl md:text-4xl font-bold">What Our Student</h2>
      <h3 className="text-2xl md:text-3xl font-bold mt-1">Say About Us</h3>
      <p className="text-white opacity-90 mt-4 max-w-2xl mx-auto">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at massa sit amet nisi blandit vehicula adipiscing elit.
      </p>

      {/* Testimonial Content */}
      <div className="flex items-center justify-center mt-8 space-x-6">
        {/* Left Arrow */}
        <button onClick={prevTestimonial} className="text-white text-2xl">
          <FaChevronLeft />
        </button>

        {/* Testimonial Info */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={testimonials[currentIndex].image}
                alt="Student Image"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <h3 className="mt-4 text-lg font-bold">
            {testimonials[currentIndex].name}
          </h3>
          <p className="text-white opacity-90 text-sm">
            {testimonials[currentIndex].role}
          </p>
          <p className="text-white opacity-90 mt-4 text-sm max-w-md mx-auto">
            {testimonials[currentIndex].feedback}
          </p>
        </div>

        {/* Right Arrow */}
        <button onClick={nextTestimonial} className="text-white text-2xl">
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default Whatour;
