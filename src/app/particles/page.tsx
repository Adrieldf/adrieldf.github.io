'use client';

import React from 'react';
import PhysicsParticleSystem from '@/components/PhysicsParticleSystem';
import { Button } from '@/components/ui/button'; // Adjust based on your shadcn setup
import Link from 'next/link';

const PhysicsParticlesPage: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      {/* Header with Back Button */}
      <header className="absolute top-4 left-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            &larr; Back to Home
          </Button>
        </Link>
      </header>

      {/* Physics Particle System */}
      <div className="w-full h-full p-4">
        <PhysicsParticleSystem />
      </div>
    </div>
  );
};

export default PhysicsParticlesPage;
