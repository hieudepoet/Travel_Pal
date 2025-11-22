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
      className="absolute z-20 flex flex-row items-center gap-[10px] px-[8px] py-[8px] bg-white/90 backdrop-blur-md rounded-full shadow-lg transition-all hover:shadow-xl"
      style={{ right: '20px', top: '20px' }}
    >

      {/* Radar icon button */}
      <button
        type="button"
        className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors p-[4px]"
        style={{
          border: 'none',
          cursor: 'pointer',
          display: 'none'
        }}
        aria-label="Chọn vị trí mặc định"
      >
        <img
          src="/images/my_location.svg"
          alt="Định vị"
          className="h-[30px] w-[30px]"
        />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1"></div>

      {/* User */}
      <button
        type="button"
        className="flex items-center justify-center rounded-full text-gray-700 hover:text-[#ff7c2a] hover:bg-gray-100 transition-colors p-[4px]"
        style={{
          border: 'none',
          cursor: 'pointer',
          display: 'none'
        }}
        aria-label="Tài khoản"
      >
        <User2 strokeWidth={2} className="h-[30px] w-[30px]" />
      </button>

      {/* Logout */}
      {isLoggingOut ? (
        <div className="flex items-center justify-center p-2">
          <Loading />
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center justify-center rounded-full text-gray-700 hover:text-red-500 hover:bg-red-50 transition-colors p-[4px]"
          style={{
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Đăng xuất"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut strokeWidth={2} className="h-[30px] w-[30px]" />
        </button>
      )}
    </div>
  );
};

export default Menu;
