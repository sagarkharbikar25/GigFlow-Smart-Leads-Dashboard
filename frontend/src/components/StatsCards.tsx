import React from 'react';
import {
  Users,
  Inbox,
  PhoneCall,
  CheckCircle,
  Percent,
} from 'lucide-react';

interface IStatsCardsProps {
  stats: {
    new: number;
    contacted: number;
    qualified: number;
    lost: number;
    total: number;
  };
  isLoading: boolean;
}

export const StatsCards: React.FC<IStatsCardsProps> = ({ stats, isLoading }) => {
  // Calculate conversion rate (Qualified Leads / Total Leads)
  const conversionRate = stats.total > 0 
    ? Math.round((stats.qualified / stats.total) * 100) 
    : 0;

  // Widgets configuration mapping
  const metrics = [
    {
      title: 'Total Leads',
      value: stats.total,
      icon: Users,
      colorClass: 'text-brand-primary bg-brand-primary/10 border-brand-primary/20',
      shadowClass: 'hover:shadow-glow-primary/5',
    },
    {
      title: 'New Leads',
      value: stats.new,
      icon: Inbox,
      colorClass: 'text-brand-accent bg-brand-accent/10 border-brand-accent/20',
      shadowClass: 'hover:shadow-glow-primary/5',
    },
    {
      title: 'In Contact',
      value: stats.contacted,
      icon: PhoneCall,
      colorClass: 'text-brand-warning bg-brand-warning/10 border-brand-warning/20',
      shadowClass: 'hover:shadow-glow-secondary/5',
    },
    {
      title: 'Qualified',
      value: stats.qualified,
      icon: CheckCircle,
      colorClass: 'text-brand-success bg-brand-success/10 border-brand-success/20',
      shadowClass: 'hover:shadow-glow-primary/5',
    },
    {
      title: 'Win Rate',
      value: `${conversionRate}%`,
      icon: Percent,
      colorClass: 'text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20',
      shadowClass: 'hover:shadow-glow-secondary/5',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-panel rounded-3xl p-5 md:p-6 animate-pulse h-28">
            <div className="flex justify-between items-start">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-brand-border rounded w-2/3"></div>
                <div className="h-8 bg-brand-border rounded w-1/3"></div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-border"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        return (
          <div
            key={i}
            className={`glass-panel rounded-3xl p-5 md:p-6 shadow-premium hover-glow transition-all duration-300 ${metric.shadowClass}`}
          >
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <span className="text-xs md:text-sm font-semibold text-brand-muted truncate block">
                  {metric.title}
                </span>
                <span className="text-xl md:text-3xl font-bold text-white mt-1 block">
                  {metric.value}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border flex-shrink-0 ${metric.colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
