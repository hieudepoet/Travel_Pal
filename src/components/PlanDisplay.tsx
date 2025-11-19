'use client';

import React from 'react';

interface PlanDisplayProps {
  startDate?: string;
  endDate?: string;
  description?: string;
}

export default function PlanDisplay({ startDate, endDate, description }: PlanDisplayProps) {
  return (
    <div className="p-4 flex-1 px-[10px] h-full" style={{ background: '#FAF8F8', border: '1px solid #D5D4DF', boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.15)', borderRadius: '10px' }}>
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
    </div>
  );
}
