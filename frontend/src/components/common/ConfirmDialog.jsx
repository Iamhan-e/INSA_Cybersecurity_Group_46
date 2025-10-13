import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-danger-600 hover:bg-danger-700',
    warning: 'bg-warning-600 hover:bg-warning-700',
    primary: 'bg-primary-600 hover:bg-primary-700'
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${variant === 'danger' ? 'bg-danger-100' : 'bg-warning-100'} flex items-center justify-center`}>
              <AlertTriangle className={`w-5 h-5 ${variant === 'danger' ? 'text-danger-600' : 'text-warning-600'}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-slate-600">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-white transition-colors font-medium text-slate-700"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${variantClasses[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;