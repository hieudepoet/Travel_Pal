'use client';

import React, { useState } from 'react';
import Menu from '@/components/Menu';
import { InputForm } from '@/components/InputForm';
import { UserPreferences, TripPlan } from '@/types/types';
import PlanDisplay from '@/components/PlanDisplay';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Travel preferences submitted:', prefs);
      // TODO: Add API call to generate travel plan
      // const plan = await generateTravelPlan(prefs);
      // setTripPlan(plan);
    } catch (error) {
      console.error('Error generating travel plan:', error);
      setError('Failed to generate travel plan. Please try again.');
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