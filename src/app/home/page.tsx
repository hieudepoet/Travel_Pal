'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '@/components/Menu';
import { InputForm } from '@/components/InputForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { UserPreferences } from '@/types/types';
import { generateTrip } from '@/service/geminiService';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (prefs: UserPreferences) => {
    setIsLoading(true);
    try {
      console.log('Travel preferences submitted:', prefs);
      const plan = await generateTrip(prefs);
      sessionStorage.setItem('generatedTripPlan', JSON.stringify(plan));
      router.push('/ai-planner');
    } catch (error) {
      console.error('Error generating travel plan:', error);
      // Optional: Add a toast or alert here if needed, but the overlay will just stop
      // Actually, if error, we should probably stop loading
      alert("Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại.");
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
      <LoadingOverlay isLoading={isLoading} message="Đang tạo kế hoạch du lịch..." />
    </div>
  );
};

export default HomePage;