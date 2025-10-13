// src/components/common/LoadingSpinner.jsx
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} text-accent-600 animate-spin`} />
      {text && (
        <p className="text-sm text-slate-600">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;