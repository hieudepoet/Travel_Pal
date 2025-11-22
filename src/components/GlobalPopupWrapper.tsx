'use client';

import React, { useState, useEffect } from 'react';

export default function GlobalPopupWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  // Prevent scrolling on the body when the popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Button to show the popup when it's closed */}
      {!isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Open Website
          </button>
        </div>
      )}

      {/* The Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          {/* The Popup Content */}
          <div className="relative w-[70%] h-[70%] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">

            {/* Header / Close Button */}
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={() => setIsOpen(false)}
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
      )}
    </>
  );
}
