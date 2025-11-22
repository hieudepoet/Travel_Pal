'use client';

import React, { useState } from 'react';
import { UserPreferences, TravelStyle } from '../types/types';
import { Plane, Calendar, MapPin, Sparkles, User, Baby, Wallet, DollarSign } from 'lucide-react';

interface InputFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState('Tokyo, Japan');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>([]);
  const [prompt, setPrompt] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [exactBudget, setExactBudget] = useState<string>('');
  const [currency, setCurrency] = useState('USD');
  const [budgetIndex, setBudgetIndex] = useState(1);

  const budgetLevels = ["Economy", "Moderate", "Premium", "Luxury"];
  const budgetDescriptions = [
    "Cost-conscious travel",
    "Balanced comfort",
    "Upscale experiences",
    "Luxury everything"
  ];
  const currencies = ["USD", "EUR", "JPY", "VND", "GBP", "AUD"];

  const toggleStyle = (style: TravelStyle) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Vui lòng chọn ngày bắt đầu và kết thúc");
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-orange-50">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
          <Plane className="w-6 h-6 text-orange-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Lên kế hoạch du lịch</h2>
        <p className="text-gray-500 mt-1 text-sm">AI sẽ tạo lịch trình hoàn hảo cho bạn</p>
      </div>

      <div className="space-y-5">
        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Đi đâu?</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              required
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="VD: Paris, France"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white text-gray-900"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày bắt đầu</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white text-gray-900"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày kết thúc</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Travelers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số người</label>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-1.5 rounded-full">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700 text-sm font-medium">Người lớn</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button 
                    type="button" 
                    onClick={() => setAdults(Math.max(1, adults - 1))} 
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm transition-colors"
                  >
                    -
                  </button>
                  <span className="text-gray-900 font-bold w-6 text-center">{adults}</span>
                  <button 
                    type="button" 
                    onClick={() => setAdults(adults + 1)} 
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center gap-2">
                  <div className="bg-pink-100 p-1.5 rounded-full">
                    <Baby className="w-4 h-4 text-pink-600" />
                  </div>
                  <span className="text-gray-700 text-sm font-medium">Trẻ em</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button 
                    type="button" 
                    onClick={() => setChildren(Math.max(0, children - 1))} 
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm transition-colors"
                  >
                    -
                  </button>
                  <span className="text-gray-900 font-bold w-6 text-center">{children}</span>
                  <button 
                    type="button" 
                    onClick={() => setChildren(children + 1)} 
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngân sách</label>
            <div className="mb-3 flex gap-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  min="0"
                  placeholder="Số tiền (Tùy chọn)"
                  value={exactBudget}
                  onChange={(e) => setExactBudget(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm bg-white text-gray-900"
                />
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 px-3 py-2.5 outline-none"
              >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className={`p-4 border rounded-lg transition-opacity duration-200 ${exactBudget ? 'opacity-40 pointer-events-none bg-gray-50 border-gray-200' : 'border-gray-200 bg-white'}`}>
              <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600 mb-2.5"
              />
              <div className="flex items-center justify-between">
                <span className="text-orange-700 font-bold text-sm">{budgetLevels[budgetIndex]}</span>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Wallet className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[110px]">{budgetDescriptions[budgetIndex]}</span>
                </div>
              </div>
            </div>
            {exactBudget && <p className="text-xs text-green-600 mt-1.5 font-medium">✓ Sử dụng ngân sách cụ thể</p>}
          </div>
        </div>

        {/* Styles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phong cách du lịch</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(TravelStyle).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedStyles.includes(style)
                    ? 'bg-orange-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Yêu cầu đặc biệt</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="VD: Tôi thích ăn ramen, muốn thăm đền chùa lịch sử và tránh nơi đông người."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none bg-white text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 rounded-xl font-bold text-base text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang tạo kế hoạch...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Tạo lịch trình
            </>
          )}
        </button>
      </div>
    </form>
  );
};
