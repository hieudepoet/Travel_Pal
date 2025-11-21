'use client';

import React, { useState, useCallback } from 'react';
import { InputForm } from './InputForm';
import { Dashboard } from './Dashboard';
import { EventCard } from './EventCard';
import { ChatWindow } from './ChatWindow';
import { generateTrip, updateTrip, sendChatMessage } from '../service/geminiService';
import { TripPlan, UserPreferences, ChatMessage } from '../types/types';
import { Loader2, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

interface AgenticUIProps {
  className?: string;
}

export const AgenticUI: React.FC<AgenticUIProps> = ({ className = "" }) => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const handleCreateTrip = async (prefs: UserPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generateTrip(prefs);
      setTripPlan(plan);
      setMessages([
        { role: 'model', text: `I've created a trip to ${prefs.destination} for you! You can ask me to modify details or just chat about the location.` }
      ]);
    } catch (err) {
      setError("Failed to generate itinerary. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
      if(window.confirm("Are you sure? This will delete the current plan.")) {
        setTripPlan(null);
        setMessages([]);
        setError(null);
      }
  };

  const handleChatMessage = async (text: string) => {
      if (!tripPlan) return;
      
      setMessages(prev => [...prev, { role: 'user', text }]);
      setChatLoading(true);

      try {
          const { text: responseText, updatedPlan } = await sendChatMessage(text, tripPlan);
          
          setMessages(prev => [...prev, { role: 'model', text: responseText }]);
          
          if (updatedPlan) {
              setTripPlan(updatedPlan);
          }
      } catch (err) {
          setMessages(prev => [...prev, { role: 'model', text: "I encountered an error processing that." }]);
      } finally {
          setChatLoading(false);
      }
  };

  const handleRejectEvent = useCallback((eventId: string) => {
    setTripPlan(prev => {
      if (!prev) return null;
      const newItinerary = prev.itinerary.map(day => ({
        ...day,
        events: day.events.map(evt => 
          evt.id === eventId ? { ...evt, status: 'rejected' as const } : evt
        )
      }));
      return { ...prev, itinerary: newItinerary };
    });
  }, []);

  const handleRestoreEvent = useCallback((eventId: string) => {
    setTripPlan(prev => {
      if (!prev) return null;
      const newItinerary = prev.itinerary.map(day => ({
        ...day,
        events: day.events.map(evt => 
          evt.id === eventId ? { ...evt, status: 'accepted' as const } : evt
        )
      }));
      return { ...prev, itinerary: newItinerary };
    });
  }, []);

  const handleRegenerateRejected = async () => {
    if (!tripPlan) return;
    
    const rejectedIds: string[] = [];
    tripPlan.itinerary.forEach(day => {
        day.events.forEach(evt => {
            if (evt.status === 'rejected') rejectedIds.push(evt.id);
        });
    });

    if (rejectedIds.length === 0) return;

    setRegenerating(true);
    try {
        const updatedPlan = await updateTrip(tripPlan, rejectedIds);
        setTripPlan(updatedPlan);
        setMessages(prev => [...prev, { role: 'model', text: "I've replaced the rejected events with new options." }]);
    } catch (err) {
        setError("Failed to update itinerary. Please try again.");
    } finally {
        setRegenerating(false);
    }
  };

  const rejectedCount = tripPlan?.itinerary.reduce((acc, day) => 
    acc + day.events.filter(e => e.status === 'rejected').length, 0
  ) || 0;

  return (
    // Force light mode colors with !important to override global Next.js styles
    <div className={`w-full h-full !bg-gray-50 !text-gray-900 ${className}`}>
      {/* Header within AgenticUI - force white background */}
      <div className="!bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-blue-600 p-1.5 rounded-lg">
                <Loader2 className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
             </div>
             <h1 className="font-bold text-xl tracking-tight !text-gray-900">Việt Nam</h1>
          </div>
          {tripPlan && (
             <button 
               onClick={handleReset}
               className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
             >
                <ArrowLeft className="w-4 h-4" />
                End Trip & Start New
             </button>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 animate-pulse">
                <AlertCircle className="w-5 h-5" />
                {error}
            </div>
        )}

        {!tripPlan ? (
          <div className="mt-10 animate-fade-in-up max-w-3xl mx-auto">
            <InputForm onSubmit={handleCreateTrip} isLoading={loading} />
          </div>
        ) : (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Chat Interface */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 lg:h-[calc(100vh-150px)]">
                <ChatWindow 
                    messages={messages} 
                    onSendMessage={handleChatMessage} 
                    isLoading={chatLoading} 
                />
            </div>

            {/* Right Column: Itinerary Content */}
            <div className="lg:col-span-8">
                <Dashboard 
                    stats={tripPlan.stats} 
                    summary={tripPlan.summary} 
                    tips={tripPlan.tips} 
                />

                {/* Action Bar for Regenerate */}
                {rejectedCount > 0 && (
                    <div className="sticky top-20 z-20 mb-6 !bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-amber-200 flex items-center justify-between animate-slide-in">
                        <div className="flex items-center gap-2 text-amber-800 font-medium">
                            <AlertCircle className="w-5 h-5" />
                            <span>{rejectedCount} events rejected manually</span>
                        </div>
                        <button 
                            onClick={handleRegenerateRejected}
                            disabled={regenerating}
                            className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center gap-2 shadow-md disabled:opacity-50 transition-all"
                        >
                            {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            Regenerate Fixes
                        </button>
                    </div>
                )}

                <div className="space-y-8">
                {tripPlan.itinerary.map((day) => (
                    <div key={day.day} className="relative">
                        <div className="sticky top-24 z-10 flex items-center gap-4 mb-4">
                            <div className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-r-full shadow-md -ml-4">
                                Day {day.day}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 !bg-white/90 px-3 py-1 rounded-md backdrop-blur-sm shadow-sm border border-gray-100">
                                {day.date} — <span className="text-blue-600">{day.theme}</span>
                            </h3>
                        </div>
                        
                        <div className="space-y-4 pl-2 md:pl-6 border-l-2 border-gray-100 ml-4 md:ml-0">
                            {day.events.map((event) => (
                                <EventCard 
                                    key={event.id} 
                                    event={event} 
                                    date={day.date}
                                    onReject={handleRejectEvent}
                                    onRestore={handleRestoreEvent}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};