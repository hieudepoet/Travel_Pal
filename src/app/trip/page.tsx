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
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Left Sidebar - Chat */}
            <div className="w-[400px] flex flex-col border-r border-gray-200 bg-white z-20 shadow-2xl">
                <div className="p-5 border-b border-gray-100 flex items-center gap-4 bg-white/80 backdrop-blur-sm">
                    <button
                        onClick={() => router.push('/home')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-orange-600"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <Sparkles className="text-orange-500 w-4 h-4" />
                            Trợ lý AI
                        </h1>
                        <p className="text-xs text-gray-500 font-medium">Luôn sẵn sàng hỗ trợ</p>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden bg-gray-50/50">
                    <ChatWindow
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isChatLoading}
                    />
                </div>
            </div>

            {/* Main Content - Plan Display */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
                {/* Top Bar */}
                <div className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                            <Map size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">
                                {tripPlan.itinerary[0]?.events[0]?.locationName?.split(',').pop() || 'Chuyến đi của bạn'}
                            </h2>
                            <p className="text-sm text-gray-500 font-medium">
                                {tripPlan.stats.durationDays} ngày • {tripPlan.stats.totalEvents} địa điểm
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-full transition-all border border-gray-200">
                            <Share2 size={16} />
                            Chia sẻ
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-full transition-all shadow-lg hover:shadow-xl">
                            <Download size={16} />
                            Tải xuống
                        </button>
                    </div>
                </div>

                {/* Scrollable Plan Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50/30 scroll-smooth">
                    <div className="max-w-6xl mx-auto py-10 px-6">
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
            </div>
        </div>
    );
}
