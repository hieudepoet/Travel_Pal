'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/types';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-orange-50/50 to-white">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Trợ lý AI của bạn</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Hỏi tôi để thay đổi kế hoạch, thêm địa điểm, hoặc tìm nhà hàng ngon!
            </p>
            <div className="mt-6 space-y-2 w-full">
              <button
                onClick={() => onSendMessage("Thêm nhà hàng hải sản vào ngày 1")}
                className="w-full px-4 py-2 text-sm text-left text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
              >
                💡 Thêm nhà hàng hải sản vào ngày 1
              </button>
              <button
                onClick={() => onSendMessage("Thay đổi hoạt động buổi sáng ngày 2")}
                className="w-full px-4 py-2 text-sm text-left text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
              >
                💡 Thay đổi hoạt động buổi sáng ngày 2
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${msg.role === 'user'
                ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }`}>
              {msg.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-gray-600" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-gray-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-200 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Quick Actions */}
          {messages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                type="button"
                onClick={() => onSendMessage("Thêm thời gian nghỉ ngơi")}
                className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full transition-colors whitespace-nowrap border border-orange-200"
              >
                ⏰ Thêm nghỉ ngơi
              </button>
              <button
                type="button"
                onClick={() => onSendMessage("Tìm nhà hàng gần đây")}
                className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full transition-colors whitespace-nowrap border border-orange-200"
              >
                🍽️ Tìm nhà hàng
              </button>
              <button
                type="button"
                onClick={() => onSendMessage("Kiểm tra thời tiết")}
                className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-full transition-colors whitespace-nowrap border border-orange-200"
              >
                ☀️ Thời tiết
              </button>
            </div>
          )}

          {/* Input Field */}
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-gray-900 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed transition-all placeholder:text-gray-400"
              />
              {input.trim() && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {input.length}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center"
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
