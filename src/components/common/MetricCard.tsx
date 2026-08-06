import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'indigo';
  subtitle?: string;
}

const colorMap = {
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/40',
    glow: 'group-hover:border-blue-500/40'
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800/40',
    glow: 'group-hover:border-purple-500/40'
  },
  emerald: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/40',
    glow: 'group-hover:border-emerald-500/40'
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/40',
    glow: 'group-hover:border-amber-500/40'
  },
  rose: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/40',
    glow: 'group-hover:border-rose-500/40'
  },
  indigo: {
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800/40',
    glow: 'group-hover:border-indigo-500/40'
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  color = 'indigo',
  subtitle
}) => {
  const colors = colorMap[color];

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-gray-900 border ${colors.border} ${colors.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-currency font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`rounded-xl p-3 ${colors.bg} ${colors.text} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
          {changeType === 'positive' ? (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              {change}
            </span>
          ) : changeType === 'negative' ? (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-100 px-2 py-0.5 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              <TrendingDown className="h-3.5 w-3.5" />
              {change}
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {change}
            </span>
          )}
          <span className="text-gray-400 dark:text-gray-500">vs last term</span>
        </div>
      )}
    </div>
  );
};
