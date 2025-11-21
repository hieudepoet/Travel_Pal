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
        <div className={`w-full flex flex-row gap-[10px] p-[5px] transition-all duration-300 ${!isRejected ? 'hover:shadow-md' : ''}`} style={{
            borderRadius: '10px',
            background: isRejected ? '#FCA5A5' : 'white',
            border: isRejected ? '1px solid #EF4444' : '1px solid #E5E7EB',
            opacity: isRejected ? 0.7 : 1
        }}>

            {/* Image Placeholder */}
            <div className="h-[50px] w-[50px] flex-shrink-0 overflow-hidden relative group cursor-pointer" onClick={openMap} style={{ borderRadius: '10px' }}>
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
            <div className="w-full flex flex-col gap-[5px]">

                {/* Type */}
                <div className="flex justify-between items-start">
                    <span className={`inline-block px-2 py-0.5 rounded capitalize ${event.type === 'food' ? 'bg-orange-100 text-orange-700' :
                        event.type === 'transport' ? 'bg-gray-100 text-gray-700' :
                            'bg-blue-100 text-blue-700'
                        }`} style={{ fontSize: '14px', fontWeight: 'semibold' }}>
                        {event.type}
                    </span>
                    <div>{event.time}</div>
                    {event.endTime && <div >to {event.endTime}</div>}
                </div>

                {/* Name */}
                <h4 className={`text-lg font-bold truncate ${isRejected ? 'text-gray-500 line-through' : '!text-gray-800'}`} style={{ margin: '0' }}>
                    {event.activity}
                </h4>

                {/* Address / Location */}
                <div
                    className="flex items-start gap-[5px] cursor-pointer hover:text-blue-600 transition-colors group" style={{ fontSize: '14px', color: 'gray' }}
                    onClick={openMap}
                    title="View on Google Maps"
                >
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                    <span className="line-clamp-1 group-hover:underline decoration-blue-600 underline-offset-2">
                        {event.address || event.locationName}
                    </span>
                </div>

                <p className="text-sm line-clamp-2 mb-3 italic" style={{ margin: '0', color: 'gray' }}>
                    {event.description}
                </p>

                <div className="flex flex-wrap gap-[10px]">
                    <span className="flex items-center gap-[2px] p-[2px]" style={{ borderRadius: '5px', border: '1px solid #E5E7EB', backgroundColor: '#F0F4F9' }}>
                        <Wallet className="w-3 h-3 text-green-600" />
                        {event.costEstimate > 0 ? <span className="font-semibold text-gray-700">{event.costEstimate.toLocaleString()} {event.currency}</span> : <span className="text-green-600 font-medium">Free</span>}
                    </span>
                    <span className="flex items-center gap-[2px] p-[2px]" style={{ borderRadius: '5px', border: '1px solid #E5E7EB', backgroundColor: '#F0F4F9' }}>
                        <Bus className="w-3 h-3 text-purple-600" />
                        {event.transportDuration} ({event.transportMethod})
                    </span>
                </div>

                {/* Contact Links */}
                <div className="flex flex-row justify-between">
                    <div className="flex gap-[10px]">
                        {event.website && (
                            <a href={event.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                <Globe className="w-[20px] h-[20px] mr-[5px]" /> Website
                            </a>
                        )}
                        {event.phoneNumber && (
                            <a href={`tel:${event.phoneNumber}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                <Phone className="w-[20px] h-[20px] mr-[5px]" /> {event.phoneNumber}
                            </a>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center items-center">
                        {isRejected ? (
                            <button
                                onClick={() => onRestore(event.id)}
                                className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Restore
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => onReject(event.id)}
                                    className="flex items-center justify-center p-[2px]" style={{ fontSize: '12px', color: 'red', fontWeight: 'semibold', backgroundColor: 'white', border: '1px solid red', borderRadius: '5px' }}
                                    title="Bỏ địa điểm này"
                                >
                                    <X className="w-auto h-full group-hover:scale-105 transition-transform" />
                                    Loại bỏ
                                </button>
                            </>
                        )}
                    </div>
                </div>

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