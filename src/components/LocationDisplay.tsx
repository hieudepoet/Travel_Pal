import React, { useState } from 'react';
import { Search } from 'lucide-react';

// Data for the regions with high-quality Unsplash placeholder images matching the themes
const REGIONS = [
  {
    id: 'north',
    name: 'Miền Bắc',
    // Image: Northern Vietnam Mountains/Sapa/Ha Long
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop',
    alt: 'Northern Vietnam Landscape'
  },
  {
    id: 'central',
    name: 'Miền Trung',
    // Image: Golden Bridge (Da Nang) or Hoi An
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop',
    alt: 'Central Vietnam Golden Bridge'
  },
  {
    id: 'south',
    name: 'Miền Nam',
    // Image: Ho Chi Minh City / Saigon
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop',
    alt: 'Southern Vietnam City Architecture'
  },
  {
    id: 'west',
    name: 'Miền Tây',
    // Image: Mekong Delta / Floating Market
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop',
    alt: 'Western Vietnam Floating Market'
  }
];

export default function VietnamTravelUI() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter regions based on search (optional functionality)
  const filteredRegions = REGIONS.filter(region => 
    region.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute bg-[#FAF8F8] p-[8px] font-sans w-[288px] h-[400px] flex flex-col"
    style={{
      right: "20px",
      top: "25%",
      border: "1px solid black",
      boxShadow: "0 0 10px rgba(255, 255, 255, 0.25)",
      borderRadius: "0.5rem",
      gap: "8px"
    }}
    >
        <div className="w-full flex flex-col gap-3">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute h-full z-10" 
            style={{ right: "5px"}} />
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              className="w-full pr-[30px] pl-[10px] py-[8px] text-[16px] border border-[#AFAFAF] rounded-[10px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        </div>
        {/* Regions List */}
        <div className="flex-1 overflow-y-auto py-2 pr-1"
        style={{ 
            background: "white",
            borderRadius: "10px",
            border: "1px solid #AFAFAF",
            boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "8px"
        }}
        >
        {filteredRegions.map((region) => (
            <div 
            key={region.id} 
            className="group relative w-full h-[90px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow"
            >
            {/* Background Image with Gradient Overlay for text readability */}
            <div className="absolute inset-0 w-full h-full z-1">
                <img
                src={region.image}
                alt={region.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                style= {{ objectPosition: "center"}}
                />
            </div>

            {/* Dark gradient overlay to ensure text pops like in the design */}
            <div className='absolute inset-0 z-2 w-full h-full'
              style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 100%)',
              }}
            />

            {/* Text Label */}
            <div className="absolute inset-0 flex items-center justify-center w-full h-full z-3">
                <h2 
                className="text-3xl font-bold tracking-wide text-center select-none"
                style={{
                    color: "white",
                    textShadow: '-1px 1px 0 rgba(0,0,0)'
                }}
                >
                {region.name}
                </h2>
            </div>

            {/* Ripple/Hover Effect overlay */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            </div>
        ))}
        </div>
        
        {/* Bottom Home Bar Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
    </div>
  );
}