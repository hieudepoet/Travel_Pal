'use client';

import React from 'react';
import { ItineraryEvent } from '../types/types';
import { MapPin, Wallet, Bus, X, RefreshCw, Phone, Globe, ExternalLink } from 'lucide-react';
import { generateGoogleCalendarLink } from '../utils/dateUtils';

interface EventCardProps {
  event: ItineraryEvent;
  date: string;
  onReject: (id: string) => void;
  onRestore: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, date, onReject, onRestore }) => {
  const isRejected = event.status === 'rejected';

  const openMap = () => {
    if (event.address || event.locationName) {
      const query = encodeURIComponent(event.address || event.locationName);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const getTypeColor = () => {
    switch (event.type) {
      case 'food':
        return { bg: 'bg-orange-100', text: 'text-orange-700' };
      case 'transport':
        return { bg: 'bg-gray-100', text: 'text-gray-700' };
      case 'lodging':
        return { bg: 'bg-purple-100', text: 'text-purple-700' };
      default:
        return { bg: 'bg-blue-100', text: 'text-blue-700' };
    }
  };

  const typeColor = getTypeColor();

  return (
    <div className={`relative bg-white rounded-xl p-4 border transition-all duration-300 ${
      isRejected 
        ? 'border-red-300 bg-red-50 opacity-60' 
        : 'border-gray-200 hover:shadow-md'
    }`}>
      <div className="flex gap-3">
        {/* Image */}
        <div 
          className="w-[150px] h-[150px] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group relative"
          onClick={openMap}
        >
          <img
            src={`https://picsum.photos/seed/${event.id}/200/200`}
            alt={event.activity}
            className={`w-full h-full object-cover transition-all ${isRejected ? 'grayscale' : ''}`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize ${typeColor.bg} ${typeColor.text}`}>
              {event.type}
            </span>
            <span className="text-sm font-medium text-gray-600">{event.time}</span>
          </div>

          <h4 className={`text-base font-bold mb-1 ${isRejected ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
            {event.activity}
          </h4>

          <div 
            className="flex items-start gap-1.5 mb-2 cursor-pointer group text-sm text-gray-600"
            onClick={openMap}
          >
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <span className="line-clamp-1 group-hover:underline">
              {event.address || event.locationName}
            </span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3 italic">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-md text-xs">
              <Wallet className="w-3.5 h-3.5 text-green-600" />
              {event.costEstimate > 0 ? (
                <span className="font-semibold text-gray-700">
                  {event.costEstimate.toLocaleString()} {event.currency}
                </span>
              ) : (
                <span className="text-green-600 font-medium">Free</span>
              )}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-md text-xs">
              <Bus className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-gray-700">{event.transportDuration}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3 text-xs">
              {event.website && (
                <a 
                  href={event.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Website
                </a>
              )}
              {event.phoneNumber && (
                <a 
                  href={`tel:${event.phoneNumber}`} 
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {event.phoneNumber}
                </a>
              )}
            </div>

            <div>
              {isRejected ? (
                <button
                  onClick={() => onRestore(event.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 bg-white border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Hoàn tác
                </button>
              ) : (
                <button
                  onClick={() => onReject(event.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-white border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Bỏ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isRejected && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-xl pointer-events-none">
          <span className="px-3 py-1.5 bg-white border border-red-600 rounded-lg text-xs font-semibold text-red-700 shadow-sm">
            Đã bỏ
          </span>
        </div>
      )}
    </div>
  );
};
