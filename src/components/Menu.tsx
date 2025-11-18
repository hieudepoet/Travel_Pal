"use client";

import { useState } from "react";
import { Menu as MenuIcon, User2, LogOut } from "lucide-react";

const tabItems = [
  { label: "Vùng miền", value: "region" },
  { label: "Các thành phố", value: "cities" },
  { label: "Địa điểm", value: "places" },
];

const Menu = () => {
  const [activeTab, setActiveTab] = useState(tabItems[0].value);

  return (
    <div
      className="absolute z-20 inline-flex items-center"
      style={{ right: '20px', top: '20px', gap: '5px' }}
    >
      {/* Radar icon button */}
      <button
        type="button"
        className="flex self-start h-12 w-12 items-center justify-center rounded-full shadow-sm transition hover:shadow-md"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', border: 'none' }}
        aria-label="Chọn vị trí mặc định"
      >
        <img
          src="/images/my_location.svg"
          alt="Định vị"
          className="h-8 w-8"
        />
      </button>

      {/* Tab navigation */}
      <div className="flex self-start rounded-full px-2 py-1" style={{ gap: '5px', backgroundColor: 'rgba(255, 255, 255, 0.7)',height: '48px',alignItems: 'center', justifyContent: 'center', padding: '0 10px'}}>
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-full px-4 py-2 text-[18px] transition ${
                isActive ? 'text-white shadow' : 'text-[#d0d0d0] hover:text-[#ff9c48]'
              }`}
              style={{
                padding: '0 10px',
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'fit-content',
                borderTop: isActive ? '1px solid #ffffff' : 'none',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(255,81,47,0.85) 0%, rgba(240,152,25,0.85) 100%)'
                  : 'none',
                color: '#ffffff',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Vertical icon stack */}
      <div className="flex flex-col" style={{ gap: '5px' }}>
        <button
          type="button"
          className="flex items-center justify-center rounded-full text-[#101010] shadow hover:text-[#ff7c2a]"
          style={{ width: '48px', height: '48px', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          aria-label="Menu chính"
        >
          <MenuIcon strokeWidth={2} />
        </button>
        <button
          type="button"
          className="flex items-center justify-center rounded-full text-[#101010] shadow hover:text-[#ff7c2a]"
          style={{ width: '48px', height: '48px', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          aria-label="Tài khoản"
        >
          <User2 strokeWidth={2} />
        </button>
        <button
          type="button"
          className="flex items-center justify-center rounded-full text-[#101010] shadow hover:text-[#ff7c2a]"
          style={{ width: '48px', height: '48px', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          aria-label="Đăng xuất"
        >
          <LogOut strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default Menu;
