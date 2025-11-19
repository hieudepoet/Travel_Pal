"use client";

import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/Button';
import CalendarComponent, { type CalendarValue } from '@/components/Calendar';
import Menu from '@/components/Menu';

import { Calendar } from 'lucide-react';

import { Roboto } from 'next/font/google'
import { handleStartDateChange, handleEndDateChange } from '@/utils/dateValidation';

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export default function VungMienLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={roboto.className}>
      <TravelPlanner />
      {children}
    </div>
  )
}

function TravelPlanner() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [dateError, setDateError] = useState('');
  const [calendarRange, setCalendarRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const startIconRef = useRef<HTMLButtonElement | null>(null);
  const endIconRef = useRef<HTMLButtonElement | null>(null);

  const toDateOrNull = (value: string) => (value ? new Date(value) : null);
  const formatInputDate = (date: Date | null) =>
    date ? date.toISOString().split('T')[0] : '';

  const syncCalendarWithInputs = (nextStart: string, nextEnd: string) => {
    setCalendarRange([toDateOrNull(nextStart), toDateOrNull(nextEnd)]);
  };

  const onStartDateChange = (value: string) => {
    handleStartDateChange(value, endDate, setStartDate, setDateError);
    syncCalendarWithInputs(value, endDate);
  };

  const onEndDateChange = (value: string) => {
    handleEndDateChange(value, startDate, setEndDate, setDateError);
    syncCalendarWithInputs(startDate, value);
  };

  const handleCalendarSelection = (value: CalendarValue) => {
    if (!Array.isArray(value)) return;

    const [start, end] = value as [Date | null, Date | null];
    setCalendarRange([start, end]);

    const startStr = formatInputDate(start);
    const endStr = formatInputDate(end);

    handleStartDateChange(startStr, endDate, setStartDate, setDateError);
    const normalizedStart = startStr !== undefined ? startStr : startDate;
    handleEndDateChange(endStr, normalizedStart, setEndDate, setDateError);
  };

  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isCalendarOpen) return;

      const target = event.target as Node;
      const clickedCalendar = calendarRef.current?.contains(target);
      const clickedIcon =
        startIconRef.current?.contains(target) ||
        endIconRef.current?.contains(target);

      if (!clickedCalendar && !clickedIcon) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  return (
    <div className="flex h-screen relative">
      {/* Left Sidebar - 30% width */}
      <div className="w-[30%] overflow-y-auto h-[100vh]">
        {/* Logo */}
        <div className="flex justify-center mb-6 rounded-lg p-4 pt-[10px] w-full h-auto" style={{ background: 'white' }}>
          <img 
            src="/images/logo.png" 
            alt="LOGO" 
            className="w-[170px] h-[80px] object-contain"
          />
        </div>

        <div
          className="w-full h-full py-[20px] px-[25px] flex flex-col gap-[10px]"
          style={{ background: '#FAF8F8', boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.1)' }}
        >
          {/* Start Date Input */}
          <div className="flex relative items-center" >
            <label className="block text-gray-700 font-medium mb-2 text-[14px] absolute px-[5px]" style={{ background: '#FAF8F8', top: '-15%', left: '3%' }}>
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={startDate}
              placeholder="DD/MM/YYYY"
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full px-3 py-2 p-[8px] pr-12 border-2 border-gray-200 rounded-[20px] focus:outline-none focus:border-orange-400 transition-colors text-[16px] text-center"
              style={{ background: '#FAF8F8', border: '1px solid #D5D4DF', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' }}
            />
            <button
              type="button"
              aria-label="Chọn ngày bắt đầu trên lịch"
              className="absolute inset-y-0 flex items-center text-orange-400"
              onClick={toggleCalendar}
              ref={startIconRef}
              style={{ right: '10px', border: 'none' }}
            >
              <Calendar size={20} strokeWidth={2} />
            </button>
          </div>

          {/* End Date Input */}
          <div className="flex relative items-center">
            <label className="block text-gray-700 font-medium mb-2 text-sm text-[14px] absolute px-[5px]" style={{ background: '#FAF8F8', top: '-15%', left: '3%' }}>
              Ngày kết thúc
            </label>
            <input
              type="date"
              value={endDate}
              placeholder="DD/MM/YYYY"
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full px-3 py-2 p-[8px] pr-12 border-2 border-gray-200 rounded-[20px] focus:outline-none focus:border-orange-400 transition-colors text-[16px] text-center"
              style={{ background: '#FAF8F8', border: '1px solid #D5D4DF', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' }}
            />
            <button
              type="button"
              aria-label="Chọn ngày kết thúc trên lịch"
              className="absolute inset-y-0 right-3 flex items-center text-orange-400"
              onClick={toggleCalendar}
              ref={endIconRef}
              style={{ right: '10px', border: 'none' }}
            >
              <Calendar size={20} strokeWidth={2} />
            </button>
          </div>

          <div className="relative">
            {isCalendarOpen && (
              <div
                ref={calendarRef}
                className="absolute z-10 mt-2 rounded-2xl border border-[#F6D9C2] bg-white/95 p-3 shadow-xl"
                style={{ borderRadius: '10px', right: '10px', left: 'auto' }}
              >
                <CalendarComponent
                  type="range"
                  value={calendarRange}
                  onChange={handleCalendarSelection}
                  className="bg-transparent"
                />
              </div>
            )}
          </div>

          {/* Description Textarea */}
          <div className="relative pb-[40px] rounded-[10px] border-2 border-gray-200 overflow-hidden" style={{ background: '#FAF8F8', border: '1px solid #D5D4DF', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' }}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Hãy miêu tả mong muốn chi tiết của bạn khi lập kế hoạch"
              rows={8}
              className="w-full px-3 py-2 p-[10px] rounded-lg focus:outline-none focus:border-orange-400 transition-colors resize-none text-sm  text-[16px]" style={{ border: 'none', background: '#FAF8F8' }}
            />
            <div className="flex justify-end items-center mt-2 gap-2 absolute bottom-[10px] right-[10px] transition-all duration-200" onMouseEnter={(e) => {
                const span = e.currentTarget.querySelector('#suggestion');
                if (span) {
                  (span as HTMLSpanElement).style.color = 'black';
                }
                e.currentTarget.style.transform = 'translateY(-2px)';
              }} onMouseLeave={(e) => {
                const span = e.currentTarget.querySelector('#suggestion');
                if (span) {
                  (span as HTMLSpanElement).style.color = '#AFAFAF';
                }
                e.currentTarget.style.transform = 'translateY(0px)';
              }}>
              <span id="suggestion" className="text-xs mr-[10px] cursor-pointer" style={{ color: '#AFAFAF' }}>Gợi ý</span>
              <div className="p-[4px] bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors" style={{ border: '1px solid #D5D4DF', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' }}>
                <img 
                  src="/images/gemini_logo.svg" 
                  alt="Gemini" 
                  className="w-[18px] h-[18px]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Button />
          </div>

          {/* Plan Display Area */}
          <div className="p-4 flex-1 px-[10px]" style={{ background: '#FAF8F8', border: '1px solid #D5D4DF', boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.15)', borderRadius: '10px' }}>
            <div className="py-[4px] px-[14px] mx-auto relative" style={{ background: '#FAF8F8', boxShadow: '0 2px 2px rgba(0, 0, 0, 0.15)', width: 'fit-content', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
              <svg
                width="20"
                height="30"
                viewBox="0 0 20 60"
                style={{ position: 'absolute', right: '-14px', top: 0, clipPath: 'inset(0 0 50% 0)' }}
              >
                <defs>
                  <filter id="shadow-left" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="1" floodColor="rgba(0,0,0,0.15)" />
                  </filter>
                </defs>
                <path
                  d="M20 0 Q-15 30 20 60 L0 60 L0 0 Z"
                  fill="#FAF8F8"
                  filter="url(#shadow-left)"
                />
              </svg>
              <svg
                width="20"
                height="30"
                viewBox="0 0 20 60"
                style={{ position: 'absolute', left: '-14px', top: 0, clipPath: 'inset(0 0 50% 0)' }}
              >
                <defs>
                  <filter id="shadow-right" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="-2" dy="2" stdDeviation="1" floodColor="rgba(0,0,0,0.15)" />
                  </filter>
                </defs>
                <path
                  d="M0 0 Q35 30 0 60 L20 60 L20 0 Z"
                  fill="#FAF8F8"
                  filter="url(#shadow-right)"
                />
              </svg>
              <h3 className="font-semibold text-sm mb-2 text-center" style={{
                background: 'linear-gradient(to bottom right, #EB4335, #FABC12)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Kế hoạch</h3>
            </div>
            
            <div className="py-4">
              
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area - 70% width */}
      <div className="flex-1 bg-gray-50 p-8">
        <div className="text-center text-gray-400 mt-20">
          <h2 className="text-2xl font-semibold mb-4">Main Content Area</h2>
          <p>This is where your main application content will appear</p>
        </div>
      </div>
    </div>
  );
}