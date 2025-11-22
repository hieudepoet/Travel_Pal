'use client';

import React from 'react';
import { ItineraryEvent } from '../types/types';
import { MapPin, Wallet, Bus, X, RefreshCw, Phone, Globe, ExternalLink, UtensilsCrossed, Hotel, Camera } from 'lucide-react';
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
        return { backgroundColor: '#e25822', color: 'white', icon: UtensilsCrossed };
      case 'transport':
        return { backgroundColor: '#475569', color: 'white', icon: Bus };
      case 'lodging':
        return { backgroundColor: '#9333ea', color: 'white', icon: Hotel };
      default:
        return { backgroundColor: '#2563eb', color: 'white', icon: Camera };
    }
  };

  const typeColor = getTypeColor();

  return (
    <div style={{ borderRadius: '10px', borderLeft: '5px solid', borderLeftColor: typeColor.backgroundColor }} className={`relative transition-all duration-300 ${isRejected
      ? 'border-red-300 bg-red-50 opacity-60'
      : 'border-gray-200 hover:shadow-md'
      }`}>
      <div className="flex gap-3 p-[10px]" style={{ borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        {/* Image */}
        <div
          className="w-[150px] h-[150px] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group relative mr-[10px]" style={{ borderRadius: '10px' }}
          onClick={openMap}
        >
          <span style={{ ...typeColor, padding: '0.25rem', borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '10px', left: '10px' }}>
            <typeColor.icon className="w-4 h-4" />
          </span>
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
        <div className="flex flex-col w-full gap-[5px]">
          <div className="flex items-start justify-end gap-2 mb-2">
            <span className="text-sm font-medium text-gray-600">{event.time}</span>
          </div>

          <h4 className={`text-base font-bold mb-1 ${isRejected ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
            {event.activity}
          </h4>

          <div
            className="flex items-start gap-1.5 mb-2 cursor-pointer group text-sm text-gray-600" style={{ color: '#A6A6A6' }}
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

          <div className="flex flex-wrap gap-[8px] mb-3">
            <span className="flex items-center gap-1.5 p-[3px]" style={{ borderRadius: '5px', backgroundColor: '#F0FDF4' }}>
              <Wallet className="w-[25px] h-[25px] mr-[5px]" style={{ color: '#16A34A' }} />
              {event.costEstimate > 0 ? (
                <span className="font-semibold text-gray-700" style={{ color: '#16A34A' }}>
                  {event.costEstimate.toLocaleString()} {event.currency}
                </span>
              ) : (
                <span className="text-green-600 font-medium" style={{ color: '#16A34A' }}>Free</span>
              )}
            </span>
            <span className="flex items-center gap-1.5 p-[3px]" style={{ borderRadius: '5px', backgroundColor: '#EFF6FF' }}>
              <Bus className="w-[25px] h-[25px] mr-[5px]" style={{ color: '#2563EB' }} />
              <span className="text-gray-700" style={{ color: '#2563EB' }}>{event.transportDuration}</span>
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
                  <Globe className="w-[20px] h-[20px]" />
                  Website
                </a>
              )}
              {event.phoneNumber && (
                <a
                  href={`tel:${event.phoneNumber}`}
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Phone className="w-[20px] h-[20px]" />
                  {event.phoneNumber}
                </a>
              )}
            </div>

            <div>
              {isRejected ? (
                <button
                  onClick={() => onRestore(event.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', fontSize: '0.75rem', fontWeight: '600', color: '#15803d', backgroundColor: 'white', border: '1px solid #16a34a', borderRadius: '0.5rem', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <RefreshCw className="w-[25px] h-[25px]" />
                  Hoàn tác
                </button>
              ) : (
                <button
                  onClick={() => onReject(event.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.2rem 0.50rem', fontSize: '0.75rem', fontWeight: '600', color: '#b91c1c', backgroundColor: 'white', border: '1px solid #dc2626', borderRadius: '0.5rem', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <X className="w-[25px] h-[25px]" />
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
