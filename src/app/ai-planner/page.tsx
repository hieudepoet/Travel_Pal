'use client';

import React, { useState, useCallback } from 'react';
import { InputForm } from '../../components/InputForm';
import { Dashboard } from '../../components/Dashboard';
import { EventCard } from '../../components/EventCard';
import { ChatWindow } from '../../components/ChatWindow';
import { TripPlan, UserPreferences, ChatMessage } from '../../types/types';
import { generateTrip, updateTrip, sendChatMessage } from '../../service/geminiService';
import { Loader2, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

type ViewMode = 'FORM' | 'TRIP';

export default function AIPlanner() {
  const [viewMode, setViewMode] = useState<ViewMode>('FORM');
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTrip = async (prefs: UserPreferences) => {
    setLoading(true);
    setError(null);
    
    try {
      const plan = await generateTrip(prefs);
      setTripPlan(plan);
      setViewMode('TRIP');
      setMessages([
        { 
          role: 'model', 
          text: `Tôi đã tạo kế hoạch du lịch đến ${prefs.destination} cho bạn! Bạn có thể hỏi tôi để thay đổi chi tiết hoặc thêm thông tin.` 
        }
      ]);
    } catch (err) {
      console.error('Generate trip error:', err);
      setError("Không thể tạo kế hoạch. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleTripChatMessage = async (text: string) => {
    if (!tripPlan) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setChatLoading(true);

    try {
      const { text: responseText, updatedPlan } = await sendChatMessage(text);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      
      if (updatedPlan) {
        setTripPlan(updatedPlan);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu. Vui lòng thử lại." 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm("Bạn có chắc muốn bắt đầu lại? Kế hoạch hiện tại sẽ bị xóa.");
    if (confirmed) {
      setTripPlan(null);
      setMessages([]);
      setError(null);
      setViewMode('FORM');
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
        if (evt.status === 'rejected') {
          rejectedIds.push(evt.id);
        }
      });
    });

    if (rejectedIds.length === 0) return;

    setRegenerating(true);
    try {
      const updatedPlan = await updateTrip(rejectedIds);
      setTripPlan(updatedPlan);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Tôi đã thay thế các hoạt động bị từ chối bằng các lựa chọn mới." 
      }]);
    } catch (err) {
      console.error('Regenerate error:', err);
      setError("Không thể cập nhật kế hoạch. Vui lòng thử lại.");
    } finally {
      setRegenerating(false);
    }
  };

  const rejectedCount = tripPlan?.itinerary.reduce(
    (acc, day) => acc + day.events.filter(e => e.status === 'rejected').length,
    0
  ) || 0;

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
              <Loader2 className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
            </div>
            <h1 className="font-bold text-xl text-gray-900">AI Travel Planner</h1>
          </div>
          
          {viewMode === 'TRIP' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Bắt đầu lại
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form View */}
        {viewMode === 'FORM' && (
          <div className="max-w-3xl mx-auto">
            <InputForm onSubmit={handleCreateTrip} isLoading={loading} />
          </div>
        )}

        {/* Trip View */}
        {viewMode === 'TRIP' && tripPlan && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chat Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <ChatWindow
                messages={messages}
                onSendMessage={handleTripChatMessage}
                isLoading={chatLoading}
              />
            </aside>

            {/* Trip Content */}
            <section className="lg:col-span-8 space-y-6">
              {/* Dashboard */}
              <Dashboard stats={tripPlan.stats} tips={tripPlan.tips} />

              {/* Regenerate Bar */}
              {rejectedCount > 0 && (
                <div className="sticky top-20 z-20 bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium text-sm">
                      {rejectedCount} hoạt động đã bị loại bỏ
                    </span>
                  </div>
                  <button
                    onClick={handleRegenerateRejected}
                    disabled={regenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {regenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    {regenerating ? 'Đang tạo...' : 'Tạo lại'}
                  </button>
                </div>
              )}

              {/* Itinerary */}
              <div className="space-y-6">
                {tripPlan.itinerary.map((day) => (
                  <article key={day.day} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    {/* Day Header */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-4 py-2 rounded-lg shadow-sm">
                        Ngày {day.day}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{day.date}</p>
                        <p className="text-sm text-orange-600">{day.theme}</p>
                      </div>
                    </div>

                    {/* Events */}
                    <div className="space-y-4">
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
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && viewMode === 'FORM' && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 text-center max-w-md mx-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Đang tạo kế hoạch
              </h3>
              <p className="text-gray-600 text-sm">
                Đang phân tích thời tiết, kiểm tra giá vé và tìm kiếm địa điểm tốt nhất cho bạn...
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
