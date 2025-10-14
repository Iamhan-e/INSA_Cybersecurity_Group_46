import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Wifi } from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-danger-100 rounded-full mb-4">
            <ShieldAlert className="w-10 h-10 text-danger-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600">
            This portal is for administrators only
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
              <p className="text-sm text-danger-900 font-medium mb-2">
                ⚠️ Administrator Access Required
              </p>
              <p className="text-sm text-danger-700">
                You do not have permission to access this admin panel. Only users with administrator privileges can log in here.
              </p>
            </div>

            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-sm text-primary-900 font-medium mb-2 flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                For Students:
              </p>
              <p className="text-sm text-primary-700">
                To access the network, connect to the <strong>ESP32 WiFi access point</strong> and log in through the captive portal that appears automatically.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;