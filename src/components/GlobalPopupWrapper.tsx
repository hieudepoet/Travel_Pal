'use client';

import React, { useEffect } from 'react';
import { useMapPopup } from '../contexts/MapPopupContext';

export default function GlobalPopupWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setShowMapPopup } = useMapPopup();

  // Prevent scrolling on the body when the popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClose = () => {
    setShowMapPopup(false);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      {/* The Popup Content */}
      <div
        className="relative w-[90%] h-[90%] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: 'white',
        }}
      >

        {/* Header / Close Button */}
        <div className="absolute top-4 left-4 z-[10000]">
          <button
            onClick={handleClose}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
}
