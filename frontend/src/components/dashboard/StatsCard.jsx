import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    danger: 'bg-danger-100 text-danger-600',
    accent: 'bg-accent-100 text-accent-600'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-600';
    if (trend === 'down') return 'text-danger-600';
    return 'text-slate-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mb-2">{value}</h3>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
          {trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;