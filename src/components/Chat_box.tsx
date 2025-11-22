'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Heart } from 'lucide-react';
import Loading from './Loading';

interface ChatBoxProps {
    style?: React.CSSProperties;
    className?: string;
    embedded?: boolean; // Kept for compatibility but unused
    isLoading?: boolean;
}

export default function ChatBox({ style, className, embedded = false, isLoading = false }: ChatBoxProps) {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Chào bạn! Tôi có thể giúp gì cho bạn?', sender: 'bot', time: '10:00 AM' },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isSendHovered, setIsSendHovered] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, newMessage]);
        setInputValue('');

        // Simulate bot response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "Thanks for your message! I'm just a demo bot for now.",
                    sender: 'bot',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        }, 1000);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={`flex flex-col w-full h-full bg-white ${className}`} style={style}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(to right, #FF512F, #FFC300)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div>
                        <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1rem', margin: '0' }}>Travel Pal AI</h3>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '200px' }}>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="flex flex-col items-center gap-3">
                            <Loading />
                            <span className="text-gray-600 font-medium flex items-center gap-[4px] text-sm">
                                Đang suy nghĩ... <Heart className="w-[16px] h-[16px] animate-pulse" fill="currentColor" style={{ color: '#FDA4A4' }} />
                            </span>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
                            >
                                <div
                                    style={{
                                        maxWidth: '85%',
                                        padding: '0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.875rem',
                                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                        backgroundColor: msg.sender === 'user' ? '#4f46e5' : 'white',
                                        color: msg.sender === 'user' ? 'white' : '#1f2937',
                                        border: msg.sender === 'user' ? 'none' : '1px solid #f3f4f6',
                                        borderBottomRightRadius: msg.sender === 'user' ? '0' : '1rem',
                                        borderBottomLeftRadius: msg.sender === 'user' ? '1rem' : '0'
                                    }}
                                >
                                    <p style={{ margin: 0 }}>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div style={{ padding: '0.75rem', backgroundColor: 'white', borderTop: '1px solid #f3f4f6' }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: '1 1 0%', position: 'relative' }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            placeholder="Ask AI..."
                            style={{
                                width: '100%',
                                paddingTop: '0.5rem',
                                paddingBottom: '0.5rem',
                                paddingLeft: '1rem',
                                paddingRight: '1rem',
                                backgroundColor: isInputFocused ? 'white' : '#f3f4f6',
                                border: isInputFocused ? '1px solid #6366f1' : '1px solid transparent',
                                borderRadius: '9999px',
                                fontSize: '0.875rem',
                                transition: 'all 0.15s ease-in-out',
                                outline: 'none',
                                color: '#374151',
                                boxShadow: isInputFocused ? '0 0 0 2px #c7d2fe' : 'none'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        onMouseEnter={() => setIsSendHovered(true)}
                        onMouseLeave={() => setIsSendHovered(false)}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '50%',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.200s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: inputValue.trim() ? (isSendHovered ? '#4338ca' : '#4f46e5') : '#e5e7eb',
                            color: inputValue.trim() ? 'white' : '#9ca3af',
                            cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                            transform: inputValue.trim() && isSendHovered ? 'scale(1.05)' : 'scale(1)',
                            border: 'none'
                        }}
                    >
                        <Send size={16} className={inputValue.trim() ? 'ml-0.5' : ''} />
                    </button>
                </form>
            </div>
        </div>
    );
}
