"use client";

import { FaShieldAlt, FaShoppingBag, FaShieldVirus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const TestCards = () => {
  const router = useRouter();

  const cards = [
    { title: "FAST QUIZ", icon: <FaShieldAlt className="w-5 h-5" />, route: "/fastquiz" },
    { title: "START TEST", icon: <FaShoppingBag className="w-5 h-5" />, route: "/testinterface" },
    { title: "CREATE TEST", icon: <FaShieldVirus className="w-5 h-5" />, route: "/createtest" },
  ];

  const enterFullscreen = async () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen(); // Safari
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen(); // IE11
    }
  };

  const handleClick = async (route) => {
    await enterFullscreen(); // Request fullscreen on click
    toast.error(`Warning: Exiting fullscreen will return you to the selection page.`,{
      duraiton: 9000,
    })
    router.push(route);
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => handleClick(card.route)}
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
