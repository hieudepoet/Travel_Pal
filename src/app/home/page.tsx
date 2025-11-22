'use client';

import React from 'react';
import Menu from '@/components/Menu';
import PlanDisplay from '@/components/PlanDisplay';
import { fakeTripPlan } from '@/constant/fakeData';

const HomePage = () => {
  return (
    <div className="flex-1 h-full relative">
      {/* Menu Component */}
      <Menu />

      <div className="p-4 overflow-y-auto h-full pb-20">
        <PlanDisplay
          tripPlan={fakeTripPlan}
          isLoading={false}
          error={null}
          onReject={() => { }}
          onRestore={() => { }}
        />
      </div>
    </div>
  );
};

export default HomePage;