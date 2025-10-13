const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    success: 'bg-success-100 text-success-700 border-success-200',
    danger: 'bg-danger-100 text-danger-700 border-danger-200',
    warning: 'bg-warning-100 text-warning-700 border-warning-200',
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;