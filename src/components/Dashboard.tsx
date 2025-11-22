'use client';

import React from 'react';
import { TripStats } from '../types/types';
import { CloudSun, DollarSign, MapPin, CalendarClock } from 'lucide-react';

interface DashboardProps {
  stats: TripStats;
  tips: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, tips }) => {
  return (
    // Applied styles from TravelPlanner
    <div className="flex flex-row gap-[20px]">
      <div className="w-full">
        <h2 className="text-[18px] font-bold !text-gray-800 mb-6">Tổng quan</h2>
        <div className="grid grid-cols-2 gap-[8px] mb-8" >
          <StatCard
            icon={<DollarSign className="w-full h-full" style={{ color: "green" }} />}
            label="Ước tính chi phí"
            value={`${stats.totalCost.toLocaleString()} ${stats.currency}`}
            sub=""
            backgroundColor="#E8F5E9" // Light Green
          />
          <StatCard
            icon={<CalendarClock className="w-full h-full" style={{ color: "purple" }} />}
            label="Thời gian"
            value={`${stats.durationDays} Days`}
            sub=""
            backgroundColor="#F3E5F5" // Light Purple
          />
          <StatCard
            icon={<MapPin className="w-full h-full" style={{ color: "red" }} />}
            label="Số địa điểm"
            value={stats.totalEvents.toString()}
            sub=""
            backgroundColor="#FFEBEE" // Light Red
          />
          <StatCard
            icon={<CloudSun className="w-full h-full" style={{ color: "orange" }} />}
            label="Thời tiết"
            value={stats.weatherSummary}
            sub=""
            backgroundColor="#FFF3E0" // Light Orange
          />
        </div>
      </div>
      <div className="w-full">
        <h3 className="text-[18px] font-semibold text-gray-500 mb-4 tracking-wider">Gợi ý</h3>
        <div className="p-[5px]" style={{ backgroundColor: "#DBEAFE", borderRadius: "10px" }}>
          <ul className="" style={{ margin: "8px", padding: "0" }}>
            {tips.split('. ').map((tip, idx) => (
              tip && <li key={idx} className="flex items-start gap-[8px] text-sm mb-[8px]" style={{ color: "gray" }}>
                <span className="inline-block w-[10px] h-[10px] mt-[5px] mr-[5px] flex-shrink-0" style={{ backgroundColor: "#0088FE", borderRadius: "50%" }}></span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-3 flex items-center gap-3`}>
    <div className="bg-white p-2 rounded-full shadow-sm">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
      <p className="text-sm font-bold text-gray-900 truncate" title={value}>{value}</p>
    </div>
  </div>
);
