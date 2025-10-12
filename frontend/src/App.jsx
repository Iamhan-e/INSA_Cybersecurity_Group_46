function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            ESP32 NAC Admin Dashboard
          </h1>
          <p className="text-slate-600">Professional Design System Test</p>
        </div>

        {/* Color Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primary Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Primary Colors</h3>
              <div className="w-12 h-12 rounded-lg bg-primary-600"></div>
            </div>
            <p className="text-sm text-slate-600">Slate-based professional palette</p>
          </div>

          {/* Accent Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Accent Colors</h3>
              <div className="w-12 h-12 rounded-lg bg-accent-600"></div>
            </div>
            <p className="text-sm text-slate-600">Blue accent for CTAs</p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Status Colors</h3>
              <div className="w-12 h-12 rounded-lg bg-success-500"></div>
            </div>
            <p className="text-sm text-slate-600">Emerald for success states</p>
          </div>
        </div>

        {/* Button Test */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Button Styles</h3>
          <div className="flex flex-wrap gap-3">
            <button className="bg-accent-600 hover:bg-accent-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Primary Button
            </button>
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors">
              Secondary Button
            </button>
            <button className="bg-success-600 hover:bg-success-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Success Button
            </button>
            <button className="bg-danger-600 hover:bg-danger-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
              Danger Button
            </button>
          </div>
        </div>

        {/* Status Badges Test */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Status Badges</h3>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-700">
              Active
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-danger-100 text-danger-700">
              Blocked
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning-100 text-warning-700">
              Warning
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
              Pending
            </span>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-success-50 border border-success-200 rounded-lg p-4">
          <p className="text-success-700 font-medium">
            ✅ Phase 1 Complete! Professional design system is configured.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;