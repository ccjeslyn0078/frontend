import { AlertTriangle, CheckCircle } from 'lucide-react';

const modules = [
  { name: 'Authentication', tests: 145, failures: 3, rate: 2.1, risk: 'low' },
  { name: 'Payment Gateway', tests: 89, failures: 12, rate: 13.5, risk: 'high' },
  { name: 'User Management', tests: 167, failures: 5, rate: 3.0, risk: 'low' },
  { name: 'Reporting', tests: 134, failures: 18, rate: 13.4, risk: 'high' },
  { name: 'Dashboard', tests: 98, failures: 7, rate: 7.1, risk: 'medium' },
  { name: 'API Integration', tests: 156, failures: 15, rate: 9.6, risk: 'medium' },
  { name: 'Notifications', tests: 112, failures: 4, rate: 3.6, risk: 'low' },
  { name: 'File Upload', tests: 87, failures: 8, rate: 9.2, risk: 'medium' },
];

export function ModuleHeatmap() {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Module Heatmap</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-green-500 to-green-600"></div>
            <span className="text-slate-600">Stable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-yellow-500 to-yellow-600"></div>
            <span className="text-slate-600">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-br from-red-500 to-red-600"></div>
            <span className="text-slate-600">Risky</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {modules.map((module) => (
          <div
            key={module.name}
            className={`bg-gradient-to-br ${getRiskColor(module.risk)} rounded-xl p-4 text-white relative overflow-hidden`}
          >
            <div className="absolute top-2 right-2">
              {module.risk === 'high' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
            </div>
            <h4 className="font-semibold mb-2 pr-6">{module.name}</h4>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{module.rate}%</p>
              <p className="text-xs opacity-90">{module.failures}/{module.tests} failed</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
