"use client";

import React, { useState } from 'react';
import { MenuIcon, User2, LogOut, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/clientApp';
import Loading from './Loading';

const tabItems = [
  { label: "Khu vực", value: "region" },
  { label: "Các thành phố", value: "cities" },
  { label: "Địa điểm", value: "places" },
];

const Menu = () => {
  const [activeTab, setActiveTab] = useState(tabItems[0].value);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className="absolute z-20 inline-flex items-center"
      style={{ right: '20px', top: '20px', gap: '5px' }}
    >
      {/* Radar icon button */}
      {!isMenuCollapsed && (
        <button
          type="button"
          className="flex self-start h-12 w-12 items-center justify-center rounded-full shadow-sm transition hover:shadow-md"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            border: 'none',
            animation: 'slideInLeft 0.3s ease-out',
            cursor: 'pointer',
          }}
          aria-label="Chọn vị trí mặc định"
        >
          <img
            src="/images/my_location.svg"
            alt="Định vị"
            className="h-8 w-8"
          />
        </button>
      )}


      {/* Vertical icon stack */}
      <div className="flex flex-col" style={{ gap: '5px' }}>
        <button
          type="button"
          className="flex items-center justify-center rounded-full text-[#101010] shadow hover:text-[#ff7c2a]"
          style={{ width: '48px', height: '48px', border: 'none', cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          aria-label="Menu chính"
          onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
        >
          <MenuIcon strokeWidth={2} />
        </button>
        {!isMenuCollapsed && (
          <>
            <button
              type="button"
              className="flex items-center justify-center rounded-full text-white shadow hover:shadow-lg transition-all"
              style={{
                width: '48px',
                height: '48px',
                border: 'none',
                background: 'linear-gradient(135deg, rgba(255,81,47,0.85) 0%, rgba(240,152,25,0.85) 100%)',
                animation: 'slideInDown 0.3s ease-out',
                cursor: 'pointer',
              }}
              aria-label="AI Travel Planner"
              onClick={() => router.push('/ai-planner')}
              title="AI Travel Planner"
            >
              <Sparkles strokeWidth={2} className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="flex items-center justify-center rounded-full text-[#101010] shadow hover:text-[#ff7c2a]"
              style={{
                width: '48px',
                height: '48px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                animation: 'slideInDown 0.3s ease-out',
              }}
              aria-label="Tài khoản"
            >
              <User2 strokeWidth={2} />
            </button>
            {isLoggingOut ? (
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: '48px',
                  height: '48px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  animation: 'slideInDown 0.3s ease-out',
                  cursor: 'pointer',
                }}
              >
                <Loading />
              </div>
            ) : (
              <button
                type="button"
                className="flex items-center justify-center rounded-full text-[#101010] shadow hover:text-[#ff7c2a]"
                style={{
                  width: '48px',
                  height: '48px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  animation: 'slideInDown 0.3s ease-out',
                  cursor: 'pointer',
                }}
                aria-label="Đăng xuất"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut strokeWidth={2} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
