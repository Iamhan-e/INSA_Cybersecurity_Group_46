import { useNavigate } from 'react-router-dom';
import { Users, Smartphone, Activity, Plus } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'View All Users',
      description: 'Manage user accounts',
      icon: Users,
      color: 'primary',
      onClick: () => navigate('/users')
    },
    {
      title: 'View All Devices',
      description: 'Manage registered devices',
      icon: Smartphone,
      color: 'accent',
      onClick: () => navigate('/devices')
    },
    {
      title: 'View Activity',
      description: 'Monitor system activity',
      icon: Activity,
      color: 'success',
      onClick: () => navigate('/activity')
    }
  ];

  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
    accent: 'bg-accent-50 text-accent-600 hover:bg-accent-100',
    success: 'bg-success-50 text-success-600 hover:bg-success-100'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`w-full p-4 rounded-lg transition-colors text-left flex items-center gap-4 ${colorClasses[action.color]}`}
          >
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <action.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-0.5">{action.title}</h4>
              <p className="text-xs opacity-75">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;