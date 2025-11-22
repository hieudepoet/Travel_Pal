'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import Menu from '@/components/Menu';


const HomePage = () => {
  return (
    <div className="flex-1 h-full relative">
      {/* Menu Component */}
      <Menu />
    </div>
  );
};

export default HomePage;