'use client';

import React from 'react';
import ThreeBasic from '@/components/ThreeBasic'; // Adjust the import path if necessary
import { Button } from '@/components/ui/button'; // Adjust based on your shadcn setup
import Link from 'next/link';

const ThreeBasicPage: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-gray-900 text-white flex items-center justify-center">
      <header className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button variant="ghost" size="sm">
            &larr; Back to Home
          </Button>
        </Link>
      </header>

      <div className="w-full h-full">
        <ThreeBasic />
      </div>
    </div>
  );
};

export default ThreeBasicPage;
