'use client';

import React, { useState } from 'react';
import { UserPreferences, TravelStyle } from '../types/types';
import { Plane, Calendar, MapPin, Sparkles, User, Baby, Wallet, DollarSign } from 'lucide-react';

interface InputFormProps {
    onSubmit: (prefs: UserPreferences) => void;
    isLoading: boolean;
}
// PR đi 
export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [destination, setDestination] = useState('Đà Nẵng, Việt Nam');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>([]);
    const [prompt, setPrompt] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [exactBudget, setExactBudget] = useState<string>('');
    const [currency, setCurrency] = useState('USD');
    const [budgetIndex, setBudgetIndex] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const budgetLevels = ["Tiết kiệm", "Trung bình", "Cao cấp", "Sang trọng"];
    const budgetDescriptions = [
        "Du lịch tiết kiệm chi phí",
        "Cân bằng sự thoải mái",
        "Trải nghiệm cao cấp",
        "Sang trọng mọi thứ"
    ];
    const currencies = ["USD", "EUR", "JPY", "VND", "GBP", "AUD"];

    const toggleStyle = (style: TravelStyle) => {
        setSelectedStyles(prev =>
            prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!startDate || !endDate) {
            setError("Vui lòng chọn ngày bắt đầu và kết thúc");
            return;
        }

        const parsedBudget = exactBudget ? parseFloat(exactBudget) : undefined;

        onSubmit({
            destination,
            startDate,
            endDate,
            style: selectedStyles,
            prompt,
            partySize: { adults, children },
            budget: budgetLevels[budgetIndex],
            exactBudget: parsedBudget,
            currency: currency
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', padding: '24px 32px', border: '1px solid #fff7ed' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: '#ffedd5', borderRadius: '50%', marginBottom: '12px' }}>
                    <Plane style={{ width: '24px', height: '24px', color: '#ea580c' }} />
                </div>
                <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827' }}>Lên kế hoạch du lịch</h2>
                <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>AI sẽ tạo lịch trình hoàn hảo cho bạn</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Destination and Dates Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                    {/* Destination */}
                    <div style={{ width: '100%' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Đi đâu?</label>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <MapPin style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
                            <input
                                type="text"
                                required
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                                placeholder="VD: Paris, France"
                                style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', transition: 'all 0.2s', backgroundColor: 'white', color: '#111827' }}
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Ngày bắt đầu</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
                            <input
                                type="date"
                                required
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', transition: 'all 0.2s', backgroundColor: 'white', color: '#111827' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Ngày kết thúc</label>
                        <div style={{ position: 'relative' }}>
                            <Calendar style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '20px', height: '20px' }} />
                            <input
                                type="date"
                                required
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', transition: 'all 0.2s', backgroundColor: 'white', color: '#111827' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Travelers */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Số người</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ backgroundColor: '#ffedd5', padding: '6px', borderRadius: '50%' }}>
                                        <User style={{ width: '16px', height: '16px', color: '#ea580c' }} />
                                    </div>
                                    <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>Người lớn</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setAdults(Math.max(1, adults - 1))}
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    >
                                        -
                                    </button>
                                    <span style={{ color: '#111827', fontWeight: 'bold', width: '24px', textAlign: 'center' }}>{adults}</span>
                                    <button
                                        type="button"
                                        onClick={() => setAdults(adults + 1)}
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ backgroundColor: '#fce7f3', padding: '6px', borderRadius: '50%' }}>
                                        <Baby style={{ width: '16px', height: '16px', color: '#db2777' }} />
                                    </div>
                                    <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>Trẻ em</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setChildren(Math.max(0, children - 1))}
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    >
                                        -
                                    </button>
                                    <span style={{ color: '#111827', fontWeight: 'bold', width: '24px', textAlign: 'center' }}>{children}</span>
                                    <button
                                        type="button"
                                        onClick={() => setChildren(children + 1)}
                                        style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Ngân sách</label>
                        <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                            <div style={{ position: 'relative', flex: '1' }}>
                                <DollarSign style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', width: '16px', height: '16px' }} />
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Số tiền (Tùy chọn)"
                                    value={exactBudget}
                                    onChange={(e) => setExactBudget(e.target.value)}
                                    style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px', backgroundColor: 'white', color: '#111827' }}
                                />
                            </div>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                style={{ backgroundColor: 'white', border: '1px solid #d1d5db', color: '#374151', fontSize: '14px', borderRadius: '8px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '10px', paddingBottom: '10px', outline: 'none' }}
                            >
                                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div style={{
                            padding: '16px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            transition: 'opacity 0.2s',
                            opacity: exactBudget ? 0.4 : 1,
                            pointerEvents: exactBudget ? 'none' : 'auto',
                            backgroundColor: exactBudget ? '#f9fafb' : 'white'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <span>{budgetLevels[0]}</span>
                                <span>{budgetLevels[3]}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="3"
                                step="1"
                                value={budgetIndex}
                                onChange={(e) => setBudgetIndex(parseInt(e.target.value))}
                                disabled={!!exactBudget}
                                style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '8px', appearance: 'none', cursor: 'pointer', accentColor: '#ea580c', marginBottom: '10px' }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ color: '#c2410c', fontWeight: 'bold', fontSize: '14px' }}>{budgetLevels[budgetIndex]}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280' }}>
                                    <Wallet style={{ width: '14px', height: '14px' }} />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }}>{budgetDescriptions[budgetIndex]}</span>
                                </div>
                            </div>
                        </div>
                        {exactBudget && <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '6px', fontWeight: '500' }}>✓ Sử dụng ngân sách cụ thể</p>}
                    </div>
                </div>

                {/* Styles */}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Phong cách du lịch</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {Object.values(TravelStyle).map((style) => (
                            <button
                                key={style}
                                type="button"
                                onClick={() => toggleStyle(style)}
                                style={{
                                    paddingLeft: '14px',
                                    paddingRight: '14px',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    borderRadius: '9999px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s',
                                    backgroundColor: selectedStyles.includes(style) ? '#ea580c' : '#f3f4f6',
                                    color: selectedStyles.includes(style) ? 'white' : '#4b5563',
                                    boxShadow: selectedStyles.includes(style) ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
                                    transform: selectedStyles.includes(style) ? 'scale(1.05)' : 'scale(1)',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    if (!selectedStyles.includes(style)) {
                                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!selectedStyles.includes(style)) {
                                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    }
                                }}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Prompt */}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Yêu cầu đặc biệt</label>
                    <textarea
                        rows={3}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="VD: Tôi thích ăn ramen, muốn thăm đền chùa lịch sử và tránh nơi đông người."
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', transition: 'all 0.2s', resize: 'none', backgroundColor: 'white', color: '#111827' }}
                    />
                </div>



                {error && (
                    <div style={{
                        marginBottom: '16px',
                        padding: '12px',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fee2e2',
                        borderRadius: '8px',
                        color: '#dc2626',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        paddingTop: '14px',
                        paddingBottom: '14px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: 'white',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: isLoading ? '#9ca3af' : 'linear-gradient(to right, #f97316, #ea580c)',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        border: 'none',
                        position: 'relative',
                        zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                        if (!isLoading) {
                            e.currentTarget.style.background = 'linear-gradient(to right, #ea580c, #c2410c)';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isLoading) {
                            e.currentTarget.style.background = 'linear-gradient(to right, #f97316, #ea580c)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }
                    }}
                >
                    {isLoading ? (
                        <>
                            <div style={{
                                animation: 'spin 1s linear infinite',
                                borderRadius: '50%',
                                height: '20px',
                                width: '20px',
                                borderBottom: '2px solid white',
                                borderTop: '2px solid transparent',
                                borderLeft: '2px solid transparent',
                                borderRight: '2px solid transparent'
                            }}></div>
                            Đang tạo kế hoạch...
                        </>
                    ) : (
                        <>
                            <Sparkles style={{ width: '20px', height: '20px' }} />
                            Tạo lịch trình
                        </>
                    )}
                </button>
            </div>

            <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </form >
    );
};
