'use client';

import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

// Helper function to format the plan text with proper line breaks and styling
const formatPlanText = (text: string) => {
  if (!text) return '';
  
  // Split by double newlines to handle paragraphs
  return text
    .split('\n\n')
    .map((paragraph, i) => {
      // Check if paragraph is a heading (starts with # or is followed by a colon)
      if (paragraph.match(/^#+ /) || paragraph.endsWith(':')) {
        return `<p class="font-semibold text-blue-600 mb-2">${paragraph}</p>`;
      }
      
      // Check if paragraph is a list item
      if (paragraph.match(/^\d+\./)) {
        return `<p class="mb-1 pl-4 border-l-2 border-blue-200">${paragraph}</p>`;
      }
      
      // Default paragraph
      return `<p class="mb-3">${paragraph}</p>`;
    })
    .join('');
};

interface PlanDisplayProps {
  plan: string | null;
  isLoading: boolean;
  error: string | null;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export default function PlanDisplay({ plan, isLoading, error, startDate, endDate, description }: PlanDisplayProps) {
  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
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
        <div className="mt-4 p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Đang tạo kế hoạch...</span>
            </div>
          ) : plan ? (
            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-4 text-center" style={{
                background: 'linear-gradient(to bottom right, #EB4335, #FABC12)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>KẾ HOẠCH DU LỊCH</h3>
              
              <div className="bg-white rounded-lg p-4 shadow-md mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Ngày bắt đầu</p>
                    <p className="font-medium">{startDate ? new Date(startDate).toLocaleDateString('vi-VN') : '--'}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Ngày kết thúc</p>
                    <p className="font-medium">{endDate ? new Date(endDate).toLocaleDateString('vi-VN') : '--'}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Số ngày</p>
                    <p className="font-medium">
                      {startDate && endDate 
                        ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)) + 1 
                        : '--'} ngày
                    </p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Mô tả chuyến đi</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {description || 'Không có mô tả'}
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-md">
                <h4 className="font-medium text-gray-700 mb-3">Chi tiết kế hoạch:</h4>
                <div 
                  className="prose max-w-none text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ __html: formatPlanText(plan) }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500">Nhập thông tin và nhấn "Tạo kế hoạch" để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
