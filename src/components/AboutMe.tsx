import React from "react";
import SocialButtons from "../components/SocialButtons";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

export function AboutMe() {
  const fullName = "Adriel Izoton de Faci";
  const role = "Senior 3D Web Developer | Game Developer";
  const locationDescription = "Caxias do Sul - RS, Brazil";

  return (
    <div className="relative z-10 max-w-4xl mx-auto p-6 bg-gray-800 bg-opacity-75 rounded-lg shadow-lg mt-20 md:mt-0">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{fullName}</h1>
        <p className="text-xl md:text-2xl mb-1">{role}</p>
        <div className="flex items-center justify-center text-gray-400 mt-1">
          <FaMapMarkerAlt className="w-5 h-5 mr-2" />
          <p className="text-md md:text-lg">{locationDescription}</p>
        </div>
      </div>

      <SocialButtons />
      <Separator className="bg-slate-600 mt-4" />
      <div className="flex flex-col items-start justify-center">
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Hello!</h2>
          <p className="text-gray-300">

            I&apos;m a Brazilian web developer with over 8 years of programming
            experience. Working with teams from different cultures and
            nationalities has enriched my communication skills both in English and
            Portuguese as well as making me a strong team player. I&apos;m
            proactive and always strive to find the best solutions, delivering
            high-quality and reliable code. My experience includes code reviews,
            technical documentation, and providing support to my team. In my free
            time, I enjoy creating games to stimulate my creativity and combine
            two things I love: coding and gaming. I&apos;m committed to be
            continuously improving my skills and learn new technologies.
          </p>
          <p className="text-gray-300">You can find my socials on the icons above if you want to reach out for a conversation.</p>
          <p className="text-gray-300">Feel free to navigate and explore all my projects on the left side bar.</p>
        </div>
        <Separator className="bg-slate-600 mt-4" />
      </div>
    </div>
  );
}
