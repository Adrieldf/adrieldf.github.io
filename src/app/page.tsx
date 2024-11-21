"use client";

import React from "react";
import ThreeBackground from "../components/ThreeBackground";
import { AboutMe } from "@/components/AboutMe";

const Home: React.FC = () => {
  return (
    <div className=" flex items-center justify-center relative w-full min-h-screen bg-gray-900 text-white overflow-hidden">
      <ThreeBackground />
      <AboutMe />
    </div>
  );
};

export default Home;
