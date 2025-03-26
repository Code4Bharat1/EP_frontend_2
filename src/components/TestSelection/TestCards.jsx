"use client";

import { FaShieldAlt, FaShoppingBag, FaShieldVirus } from "react-icons/fa";
import { useRouter } from "next/navigation";

const TestCards = () => {
  const router = useRouter();

  const cards = [
    { title: "EXAM PLAN", icon: <FaShieldAlt className="w-5 h-5" />, route: "/examplan" },
    { title: "START TEST", icon: <FaShoppingBag className="w-5 h-5" />, route: "/testinterface" },
    { title: "CREATE TEST", icon: <FaShieldVirus className="w-5 h-5" />, route: "/createtest" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => router.push(card.route)}
          className="md:h-[100px] sm:w-full flex items-center justify-center gap-4 p-3 md:p-4 lg:p-5 rounded-lg text-white text-xs md:text-sm lg:text-base text-center font-medium shadow-lg transition-transform transform hover:scale-105 cursor-pointer bg-gradient-to-b from-[#0077B6] to-[#ADE8F4]"
        >
          <div>{card.icon}</div>
          <span>{card.title}</span>
        </div>
      ))}
    </div>
  );
};

export default TestCards;