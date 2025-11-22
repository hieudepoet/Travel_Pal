'use client';

import React, { useState } from 'react';
import Menu from '@/components/Menu';
import { InputForm } from '@/components/InputForm';
import { UserPreferences } from '@/types/types';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (prefs: UserPreferences) => {
    setIsLoading(true);
    try {
      console.log('Travel preferences submitted:', prefs);
      // TODO: Add API call to generate travel plan
      // await generateTravelPlan(prefs);
    } catch (error) {
      console.error('Error generating travel plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, height: '100%', position: 'relative' }}>
      {/* Menu Component */}
      <Menu />

      {/* Input Form */}
      <div style={{
        padding: '40px',
        overflowY: 'auto',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;