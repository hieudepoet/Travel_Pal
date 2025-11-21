'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import Menu from '@/components/Menu';

// Dynamically import client components with SSR disabled
const LocationDisplay = dynamic(() => import('@/components/LocationDisplay'), { 
  ssr: false 
});

const HomePage = () => {
  return (
    <div className="flex-1 h-full overflow-auto">
      <LocationDisplay folder="home"/>
      {/* Menu Component */}
      <Menu />
    </div>
  );
};

export default HomePage;