import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  trend: number;
  icon: LucideIcon;
  sparklineData: number[];
  iconBg: string;
}

export function KPICard({ title, value, trend, icon: Icon, sparklineData, iconBg }: KPICardProps) {
  const isPositive = trend > 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
            isPositive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}

          <span className="text-xs font-medium">
            {Math.abs(trend)}%
          </span>
        </div>
      </div>

      <h3 className="text-3xl font-bold text-slate-800 mb-1">
        {value}
      </h3>

      <p className="text-sm text-slate-500 mb-6">
        {title}
      </p>

      {/* Soft Progress Bar */}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isPositive
              ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
              : 'bg-gradient-to-r from-red-400 to-red-500'
          }`}
          style={{
            width: `${Math.min(Math.abs(trend) * 5 + 40, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}