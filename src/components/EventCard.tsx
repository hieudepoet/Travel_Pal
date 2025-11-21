import React from 'react';
import { ItineraryEvent } from '../types/types';
import { MapPin, Wallet, Bus, X, RefreshCw, CalendarPlus, Phone, Globe, ExternalLink } from 'lucide-react';
import { generateGoogleCalendarLink } from '../utils/dateUtils';

interface EventCardProps {
  event: ItineraryEvent;
  date: string;
  onReject: (id: string) => void;
  onRestore: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, date, onReject, onRestore }) => {
  const isRejected = event.status === 'rejected';

  const handleAddToCalendar = () => {
      const link = generateGoogleCalendarLink(event, date);
      window.open(link, '_blank');
  };

  const openMap = () => {
      if (event.address || event.locationName) {
          const query = encodeURIComponent(event.address || event.locationName);
          window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
      }
  };

  return (
    // Added !bg-white to ensure card is white regardless of global theme
    <div className={`relative flex flex-col md:flex-row gap-4 !bg-white p-4 rounded-xl border transition-all duration-300 ${isRejected ? 'border-red-200 !bg-red-50 opacity-70' : 'border-gray-200 hover:shadow-md'}`}>
      
      {/* Image Placeholder */}
      <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 relative group cursor-pointer" onClick={openMap}>
         <img 
            src={`https://picsum.photos/seed/${event.id}/200/200`} 
            alt={event.activity}
            className={`w-full h-full object-cover transition-all ${isRejected ? 'grayscale' : ''}`}
         />
         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ExternalLink className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div>
             <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-1 capitalize ${
                 event.type === 'food' ? 'bg-orange-100 text-orange-700' :
                 event.type === 'transport' ? 'bg-gray-100 text-gray-700' :
                 'bg-blue-100 text-blue-700'
             }`}>
                {event.type}
             </span>
             <h4 className={`text-lg font-bold truncate ${isRejected ? 'text-gray-500 line-through' : '!text-gray-800'}`}>
                {event.activity}
             </h4>
          </div>
          <div className="text-right flex-shrink-0">
             <div className="text-sm font-bold !text-gray-900">{event.time}</div>
             {event.endTime && <div className="text-xs text-gray-500">to {event.endTime}</div>}
          </div>
        </div>

        {/* Address / Location */}
        <div 
            className="flex items-start gap-1.5 text-sm text-gray-600 mb-2 cursor-pointer hover:text-blue-600 transition-colors group"
            onClick={openMap}
            title="View on Google Maps"
        >
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <span className="line-clamp-1 group-hover:underline decoration-blue-600 underline-offset-2">
                {event.address || event.locationName}
            </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3 italic">
            &lqudo;{event.description}&rqudo;
        </p>

        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
             <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                <Wallet className="w-3 h-3 text-green-600" />
                {event.costEstimate > 0 ? <span className="font-semibold text-gray-700">{event.costEstimate.toLocaleString()} {event.currency}</span> : <span className="text-green-600 font-medium">Free</span>}
             </span>
             <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                <Bus className="w-3 h-3 text-purple-600" />
                {event.transportDuration} ({event.transportMethod})
             </span>
        </div>
        
        {/* Contact Links */}
        <div className="flex gap-3">
            {event.website && (
                <a href={event.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                    <Globe className="w-3 h-3" /> Website
                </a>
            )}
            {event.phoneNumber && (
                 <a href={`tel:${event.phoneNumber}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                    <Phone className="w-3 h-3" /> {event.phoneNumber}
                </a>
            )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex md:flex-col justify-between md:justify-start gap-2 mt-2 md:mt-0 pl-0 md:pl-2 md:border-l md:border-gray-100">
        {isRejected ? (
             <button 
                onClick={() => onRestore(event.id)}
                className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors md:w-full"
             >
                <RefreshCw className="w-3 h-3" />
                Restore
             </button>
        ) : (
            <>
                <button 
                    onClick={handleAddToCalendar}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-colors md:w-full whitespace-nowrap"
                    title="Add to Google Calendar"
                >
                    <CalendarPlus className="w-3 h-3" />
                    Add Cal
                </button>
                <button 
                    onClick={() => onReject(event.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-white border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors md:w-full group"
                    title="Reject this event"
                >
                    <X className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    Reject
                </button>
            </>
        )}
      </div>
      
      {isRejected && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px] rounded-xl pointer-events-none z-10">
             <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-red-200">
                Rejected
             </span>
          </div>
      )}
    </div>
  );
};