'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlanDisplay from '@/components/PlanDisplay';
import { ChatWindow } from '@/components/ChatWindow';
import { TripPlan, ChatMessage } from '@/types/types';
import { sendChatMessage, updateTrip } from '@/service/geminiService';
import { ArrowLeft, Share2, Download, Map, Sparkles } from 'lucide-react';

export default function TripPage() {
    const router = useRouter();
    const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);

    useEffect(() => {
        const savedPlan = sessionStorage.getItem('currentTripPlan');
        if (savedPlan) {
            try {
                const parsedPlan = JSON.parse(savedPlan);
                setTripPlan(parsedPlan);
                setMessages([{
                    role: 'model',
                    text: `Chào bạn! Tôi đã tạo xong lịch trình đi ${parsedPlan.itinerary[0]?.events[0]?.locationName ? 'đó' : 'du lịch'} cho bạn. Bạn có muốn thay đổi gì không?`
                }]);
            } catch (e) {
                console.error("Failed to parse trip plan", e);
                router.push('/home');
            }
        } else {
            router.push('/home');
        }
    }, [router]);

    const handleSendMessage = async (text: string) => {
        const newMessages = [...messages, { role: 'user', text } as ChatMessage];
        setMessages(newMessages);
        setIsChatLoading(true);


        try {
            const { text: responseText, updatedPlan } = await sendChatMessage(text, tripPlan!);

            setMessages(prev => [...prev, { role: 'model', text: responseText }]);

            if (updatedPlan) {
                setTripPlan(updatedPlan);
                sessionStorage.setItem('currentTripPlan', JSON.stringify(updatedPlan));
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleReject = (eventId: string) => {
        if (!tripPlan) return;

        const updatedPlan = {
            ...tripPlan,
            itinerary: tripPlan.itinerary.map(day => ({
                ...day,
                events: day.events.map(event =>
                    event.id === eventId ? { ...event, status: 'rejected' as const } : event
                )
            }))
        };
        setTripPlan(updatedPlan);
        sessionStorage.setItem('currentTripPlan', JSON.stringify(updatedPlan));
    };

    const handleRestore = (eventId: string) => {
        if (!tripPlan) return;

        const updatedPlan = {
            ...tripPlan,
            itinerary: tripPlan.itinerary.map(day => ({
                ...day,
                events: day.events.map(event =>
                    event.id === eventId ? { ...event, status: 'accepted' as const } : event
                )
            }))
        };
        setTripPlan(updatedPlan);
        sessionStorage.setItem('currentTripPlan', JSON.stringify(updatedPlan));
    };

    const handleRegenerate = async () => {
        if (!tripPlan) return;

        const rejectedIds = tripPlan.itinerary.flatMap(day =>
            day.events.filter(e => e.status === 'rejected').map(e => e.id)
        );

        if (rejectedIds.length === 0) return;

        setIsRegenerating(true);
        try {
            const newPlan = await updateTrip(tripPlan, rejectedIds);
            setTripPlan(newPlan);
            sessionStorage.setItem('currentTripPlan', JSON.stringify(newPlan));
            setMessages(prev => [...prev, { role: 'model', text: "Tôi đã cập nhật lại lịch trình dựa trên các thay đổi của bạn." }]);
        } catch (error) {
            console.error("Regenerate error:", error);
            alert("Không thể cập nhật lịch trình. Vui lòng thử lại.");
        } finally {
            setIsRegenerating(false);
        }
    };

    if (!tripPlan) return null;

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#f9fafb',
            overflow: 'hidden',
            fontFamily: 'sans-serif'
        }}>
            {/* Main Content - Plan Display */}
            <div style={{
                flex: '1 1 0%',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: 'white'
            }}>
                {/* Top Bar */}
                <div style={{
                    height: '5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    zIndex: 10,
                    position: 'sticky',
                    top: 0
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '9999px',
                            backgroundColor: '#fffbeb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ea580c'
                        }}>
                            <Map size={20} />
                        </div>
                        <div>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: '#111827',
                                lineHeight: '1.25',
                                margin: 0
                            }}>
                                {tripPlan.itinerary[0]?.events[0]?.locationName?.split(',').pop() || 'Chuyến đi của bạn'}
                            </h2>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                fontWeight: 500,
                                margin: 0
                            }}>
                                {tripPlan.stats.durationDays} ngày • {tripPlan.stats.totalEvents} địa điểm
                            </p>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '0.75rem'
                    }}>
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            backgroundColor: 'transparent',
                            border: '1px solid #e5e7eb',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        >
                            <Share2 size={16} />
                            Chia sẻ
                        </button>
                        <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'white',
                            backgroundColor: '#111827',
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#1f2937';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#111827';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        }}
                        >
                            <Download size={16} />
                            Lưu vào Calendar
                        </button>
                    </div>
                </div>

<<<<<<< Updated upstream
                {/* Scrollable Plan Area */}
                <div style={{
                    flex: '1 1 0%',
                    overflowY: 'auto',
                    backgroundColor: 'rgba(249, 250, 251, 0.3)',
                    scrollBehavior: 'smooth'
                }}>
                    <div style={{
                        maxWidth: '72rem',
                        margin: '0 auto',
                        padding: '2.5rem 1.5rem'
                    }}>
                        <PlanDisplay
                            tripPlan={tripPlan}
                            isLoading={false}
                            error={null}
                            onReject={handleReject}
                            onRestore={handleRestore}
                            onRegenerate={handleRegenerate}
                            isRegenerating={isRegenerating}
                        />
=======
                {/* Tab Navigation */}
                <div className="bg-white/60 backdrop-blur-md border-b border-gray-200/50 px-6 relative">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('plan')}
                            className={`px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'plan'
                                ? 'text-orange-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Calendar size={18} className="inline mr-2" />
                            Lịch trình
                            {activeTab === 'plan' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('map')}
                            className={`px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'map'
                                ? 'text-orange-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Map size={18} className="inline mr-2" />
                            Bản đồ
                            {activeTab === 'map' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500"></div>
                            )}
                        </button>
>>>>>>> Stashed changes
                    </div>
                </div>
            </div>
                        <div style={{
                width: '400px',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #e5e7eb',
                backgroundColor: 'white',
                zIndex: 20,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <div style={{
                    padding: '1.25rem',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)'
                }}>
                    <button
                        onClick={() => router.push('/home')}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '9999px',
                            transition: 'all 0.2s ease',
                            color: '#6b7280',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.color = '#ea580c';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#6b7280';
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{
                            fontWeight: 'bold',
                            fontSize: '1.125rem',
                            color: '#111827',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            margin: 0
                        }}>
                            <Sparkles style={{ color: '#f97316', width: '1rem', height: '1rem' }} />
                            Trợ lý AI
                        </h1>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            fontWeight: 500,
                            margin: 0
                        }}>Luôn sẵn sàng hỗ trợ</p>
                    </div>
                </div>

                <div style={{
                    flex: '1 1 0%',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(249, 250, 251, 0.5)'
                }}>
                    <ChatWindow
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isChatLoading}
                    />
                </div>
            </div>
        </div>
    );
}
