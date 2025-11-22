'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlanDisplay from '@/components/PlanDisplay';
import { ChatWindow } from '@/components/ChatWindow';
import { TripPlan, ChatMessage } from '@/types/types';
import { sendChatMessage, updateTrip } from '@/service/geminiService';
import { ArrowLeft, Share2, Download, Map, Calendar, Sparkles, MessageCircle, X } from 'lucide-react';

export default function TripPage() {
    const router = useRouter();
    const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'plan' | 'map'>('plan');
    const [isChatOpen, setIsChatOpen] = useState(true);

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
        <div className="flex h-screen overflow-hidden font-sans relative">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 ${isChatOpen ? 'mr-[420px]' : 'mr-0'}`}>
                {/* Top Navigation Bar */}
                <div className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-6 z-10 relative">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/home')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-orange-600"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                                    {tripPlan.itinerary[0]?.events[0]?.locationName?.split(',').pop() || 'Chuyến đi của bạn'}
                                </h2>
                                <p className="text-xs text-gray-500 font-medium">
                                    {tripPlan.stats.durationDays} ngày • {tripPlan.stats.totalEvents} địa điểm
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all border border-gray-200">
                            <Share2 size={16} />
                            Chia sẻ
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-xl transition-all shadow-lg hover:shadow-xl">
                            <Download size={16} />
                            Tải xuống
                        </button>
                    </div>
                </div>

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
                    </div>
                </div>

                {/* Content Area with Tabs */}
                <div className="flex-1 overflow-hidden relative">
                    {activeTab === 'plan' ? (
                        <div className="h-full overflow-y-auto scroll-smooth">
                            <div className="max-w-6xl mx-auto py-8 px-6">
                                <PlanDisplay
                                    tripPlan={tripPlan}
                                    isLoading={false}
                                    error={null}
                                    onReject={handleReject}
                                    onRestore={handleRestore}
                                    onRegenerate={handleRegenerate}
                                    isRegenerating={isRegenerating}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                                    <Map size={40} className="text-orange-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Bản đồ đang được phát triển</h3>
                                <p className="text-gray-500">Tính năng này sẽ sớm được cập nhật</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar - Chat */}
            <div className={`fixed right-0 top-0 h-full w-[420px] bg-white border-l border-gray-200/50 shadow-2xl z-30 transition-transform duration-300 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Chat Header */}
                <div className="h-16 bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-between px-6 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-base">Trợ lý AI</h3>
                            <p className="text-xs text-white/80">Luôn sẵn sàng hỗ trợ</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsChatOpen(false)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Content */}
                <div className="h-[calc(100%-4rem)] bg-gradient-to-b from-gray-50 to-white">
                    <ChatWindow
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isChatLoading}
                    />
                </div>
            </div>

            {/* Floating Chat Toggle Button (when chat is closed) */}
            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-20 flex items-center justify-center"
                >
                    <MessageCircle size={28} />
                </button>
            )}
        </div>
    );
}
