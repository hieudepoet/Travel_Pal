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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Tổng quan</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
          label="Chi phí"
          value={`${stats.totalCost.toLocaleString()} ${stats.currency}`}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<CalendarClock className="w-5 h-5 text-purple-600" />}
          label="Thời gian"
          value={`${stats.durationDays} ngày`}
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<MapPin className="w-5 h-5 text-red-600" />}
          label="Địa điểm"
          value={stats.totalEvents.toString()}
          bgColor="bg-red-50"
        />
        <StatCard
          icon={<CloudSun className="w-5 h-5 text-orange-600" />}
          label="Thời tiết"
          value={stats.weatherSummary}
          bgColor="bg-orange-50"
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Gợi ý</h3>
        <div className="bg-blue-50 rounded-lg p-4">
          <ul className="space-y-2">
            {tips.split('. ').filter(tip => tip.trim()).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="inline-block w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                <span>{tip.trim()}{tip.endsWith('.') ? '' : '.'}</span>
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
