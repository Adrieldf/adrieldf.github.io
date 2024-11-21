import React from "react";
import SocialButtons from "../components/SocialButtons";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

export function AboutMe() {
  const fullName = "Adriel Izoton de Faci";
  const role = "Senior 3D Web Developer | Game Developer";
  const locationDescription = "Caxias do Sul - RS, Brazil";
  const aboutMeDescription =
    "I have over eight years of experience as a developer, working with TypeScript, WebGL, React and other technologies. I've also created several games using Unity and C#. I focus on writing efficient code, keeping clear documentation, and thoroughly testing my projects. I like to stay updated with new technologies and have experience working remotely with teams from around the world.";

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
      <Separator className="bg-slate-600 mt-4"/>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">About Me</h2>
        <p className="text-gray-300">{aboutMeDescription}</p>
      </div>


      <Separator className="bg-slate-600 mt-4"/>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Experience</h2>
        <p className="text-gray-300"></p>
      </div>
    </div>
  );
}
