'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant: 'blue' | 'teal' | 'green' | 'orange';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  delay?: number;
}

const variantClasses = {
  blue: 'stats-blue',
  teal: 'stats-teal',
  green: 'stats-green',
  orange: 'stats-orange',
};

export default function StatsCard({ title, value, subtitle, icon, variant, trend, delay = 0 }: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-5 text-white relative overflow-hidden animate-slide-in-up',
        variantClasses[variant],
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            {icon}
          </div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trend.direction === 'up' ? 'bg-white/20' : 'bg-white/20'
            )}>
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}%
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm text-white/80 mt-1">{title}</p>
        {subtitle && (
          <p className="text-xs text-white/60 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
