'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '@/components/Menu';
import { InputForm } from '@/components/InputForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { UserPreferences, TripPlan } from '@/types/types';
import { generateTrip } from '@/service/geminiService';
import PlanDisplay from '@/components/PlanDisplay';

const HomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
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

  const handleReject = (eventId: string) => {
    if (!tripPlan) return;

    setTripPlan({
      ...tripPlan,
      itinerary: tripPlan.itinerary.map(day => ({
        ...day,
        events: day.events.map(event =>
          event.id === eventId ? { ...event, status: 'rejected' as const } : event
        )
      }))
    });
  };

  const handleRestore = (eventId: string) => {
    if (!tripPlan) return;

    setTripPlan({
      ...tripPlan,
      itinerary: tripPlan.itinerary.map(day => ({
        ...day,
        events: day.events.map(event =>
          event.id === eventId ? { ...event, status: 'accepted' as const } : event
        )
      }))
    });
  };

  return (
    <div style={{ flex: 1, height: '100%', position: 'relative' }}>
      {/* Menu Component */}
      <Menu />

      {/* Main Content Area */}
      <div style={{
        padding: '40px',
        overflowY: 'auto',
        height: '100%',
        gap: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Input Form */}
        <div style={{ maxWidth: '800px', width: '100%', flexShrink: 0 }}>
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
      <LoadingOverlay isLoading={isLoading} message="Đang tạo kế hoạch du lịch..." />
      {/* Plan Display */}
      <div style={{ flex: 1, minWidth: '0' }}>
        <PlanDisplay
          tripPlan={tripPlan}
          isLoading={isLoading}
          error={error}
          onReject={handleReject}
          onRestore={handleRestore}
        />
      </div>
    </div>
  );
};

export default HomePage;