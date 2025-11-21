'use client';

import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Dashboard } from './Dashboard';
import { EventCard } from './EventCard';
import { TripPlan } from '../types/types';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface PlanDisplayProps {
    tripPlan: TripPlan | null;
    isLoading: boolean;
    error: string | null;
    onReject: (id: string) => void;
    onRestore: (id: string) => void;
    onRegenerate?: () => void;
    isRegenerating?: boolean;
}

export default function PlanDisplay({
    tripPlan,
    isLoading,
    error,
    onReject,
    onRestore,
    onRegenerate,
    isRegenerating = false
}: PlanDisplayProps) {

    // Show error toast when error changes
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const rejectedCount = tripPlan?.itinerary.reduce((acc, day) =>
        acc + day.events.filter(e => e.status === 'rejected').length, 0
    ) || 0;

    return (
        <div className="w-full h-full p-[10px]" style={{ background: '#FAF8F8', border: '1px solid #D5D4DF', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)', borderRadius: "20px" }}>
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 animate-pulse">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <span className="text-gray-600 font-medium">Generating your perfect trip...</span>
                    </div>
                </div>
            ) : !tripPlan ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="bg-blue-50 p-4 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg">Enter your preferences to start planning</p>
                </div>
            ) : (
                <div className="w-full animate-fade-in">
                    <Dashboard
                        stats={tripPlan.stats}
                        tips={tripPlan.tips}
                    />

                    {/* Action Bar for Regenerate */}
                    {rejectedCount > 0 && onRegenerate && (
                        <div className="sticky top-20 z-20 mb-6 !bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-amber-200 flex items-center justify-between animate-slide-in">
                            <div className="flex items-center gap-2 text-amber-800 font-medium">
                                <AlertCircle className="w-5 h-5" />
                                <span>{rejectedCount} events rejected manually</span>
                            </div>
                            <button
                                onClick={onRegenerate}
                                disabled={isRegenerating}
                                className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 flex items-center gap-2 shadow-md disabled:opacity-50 transition-all"
                            >
                                {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                Regenerate Fixes
                            </button>
                        </div>
                    )}

                    <div className="w-full space-y-8 mt-8">
                        {tripPlan.itinerary.map((day) => (
                            <div key={day.day} className="w-full relative">
                                <div className="sticky top-24 z-10 flex items-center gap-4 mb-4">
                                    <div className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-r-full shadow-md -ml-4">
                                        Ngày {day.day}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 !bg-white/90 px-3 py-1 rounded-md backdrop-blur-sm shadow-sm border border-gray-100">
                                        {day.date} — <span className="text-blue-600">{day.theme}</span>
                                    </h3>
                                </div>

                                <div className="w-full space-y-4 pl-2 md:pl-6 border-l-2 border-gray-100 ml-4 md:ml-0">
                                    {day.events.map((event) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            date={day.date}
                                            onReject={onReject}
                                            onRestore={onRestore}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
