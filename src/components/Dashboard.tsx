import React from 'react';
import { TripStats } from '../types/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CloudSun, DollarSign, MapPin, CalendarClock } from 'lucide-react';

interface DashboardProps {
  stats: TripStats;
  summary: string;
  tips: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Dashboard: React.FC<DashboardProps> = ({ stats, summary, tips }) => {
  // Mock data for the chart based on stats (simplification for viz)
  const chartData = [
    { name: 'Activities', value: stats.totalCost * 0.4 },
    { name: 'Food', value: stats.totalCost * 0.3 },
    { name: 'Transport', value: stats.totalCost * 0.1 },
    { name: 'Lodging', value: stats.totalCost * 0.2 },
  ];

  return (
    // Added !bg-white and border styling
    <div className="!bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <h2 className="text-2xl font-bold !text-gray-800 mb-6">Trip Overview</h2>
      
      {/* Summary Text */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <p className="text-gray-700 italic">&lqudo;{summary}&rqudo;</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          label="Est. Cost"
          value={`${stats.totalCost.toLocaleString()} ${stats.currency}`}
          sub="Total estimate"
        />
        <StatCard 
          icon={<CalendarClock className="w-6 h-6 text-purple-600" />}
          label="Duration"
          value={`${stats.durationDays} Days`}
          sub="Full trip"
        />
        <StatCard 
          icon={<MapPin className="w-6 h-6 text-red-600" />}
          label="Events"
          value={stats.totalEvents.toString()}
          sub="Places to visit"
        />
        <StatCard 
          icon={<CloudSun className="w-6 h-6 text-orange-500" />}
          label="Weather"
          value="Forecast"
          sub={stats.weatherSummary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 h-64">
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Budget Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${Math.round(value)} ${stats.currency}`} />
                <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
            </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Travel Agent Tips</h3>
            <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-100">
                <ul className="space-y-2">
                    {tips.split('. ').map((tip, idx) => (
                         tip && <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></span>
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
    <div className="p-3 bg-white rounded-full shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase">{label}</p>
      <p className="text-lg font-bold !text-gray-900 truncate max-w-[120px]" title={value}>{value}</p>
      <p className="text-xs text-gray-400 truncate max-w-[120px]" title={sub}>{sub}</p>
    </div>
  </div>
);