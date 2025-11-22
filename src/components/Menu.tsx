"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { MenuIcon, User2, Sparkles, Map } from 'lucide-react';
import Logout from './Logout';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/clientApp';
import Loading from './Loading';
import { useMapPopup } from '../contexts/MapPopupContext';

const tabItems = [
  { label: "Khu vực", value: "region" },
  { label: "Các thành phố", value: "cities" },
  { label: "Địa điểm", value: "places" },
];

const Menu = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { setShowMapPopup } = useMapPopup();

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
        <Image
          src="/images/my_location.svg"
          alt="Định vị"
          width={30}
          height={30}
        />
      </button>

      {/* Map button */}
      <button
        type="button"
        onClick={() => setShowMapPopup(true)}
        className="flex items-center justify-center rounded-full text-gray-700 hover:text-[#ff7c2a] hover:bg-gray-100 transition-colors p-[4px]"
        style={{
          border: 'none',
          cursor: 'pointer',
        }}
        aria-label="Vietnam Map"
      >
        <Map strokeWidth={2} className="h-[30px] w-[30px]" />
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
      <Logout onClick={handleLogout} isLoading={isLoggingOut} />
    </div>
  );
};

export default Menu;
