import React, { useState } from 'react';
import { UserPreferences, TravelStyle } from '../types/types';
import { Plane, Calendar, Map as MapIcon, Sparkles } from 'lucide-react';

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

  const toggleStyle = (style: TravelStyle) => {
    setSelectedStyles(prev => 
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert("Please select dates");
    onSubmit({
      destination,
      startDate,
      endDate,
      style: selectedStyles,
      prompt
    });
  };

  return (
    // Add !bg-white to override potential global dark backgrounds
    <form onSubmit={handleSubmit} className="!bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto border border-blue-50">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <Plane className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold !text-gray-900">Plan Your Dream Trip</h2>
        <p className="text-gray-500 mt-2">Let AI create a perfect itinerary tailored to you.</p>
      </div>

      <div className="space-y-6">
        
        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Where to?</label>
          <div className="relative">
            <MapIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              required
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g. Paris, France"
              // Changed text-white to text-gray-900 to ensure visibility on white inputs
              className="!text-gray-900 w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                // Changed text-white to text-gray-900
                className="!text-gray-900 w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                // Changed text-white to text-gray-900
                className="!text-gray-900 w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                />
            </div>
          </div>
        </div>

        {/* Styles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Travel Style</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(TravelStyle).map((s) => {
              const style = s as TravelStyle;
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedStyles.includes(style)
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="e.g. I love ramen, want to visit historical shrines, and avoid crowded places."
            // Changed text-white to text-gray-900
            className="!text-gray-900 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Plan...
            </>
          ) : (
            <>
                <Sparkles className="w-5 h-5" />
                Generate Itinerary
            </>
          )}
        </button>
      </div>
    </form>
  );
};