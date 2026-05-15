import { Users, AlertTriangle, Clock, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const testerData = [
  { name: 'Sarah Chen', executed: 245, passRate: 96.3, bugs: 28, productivity: 'high' },
  { name: 'John Doe', executed: 198, passRate: 94.1, bugs: 22, productivity: 'high' },
  { name: 'Mike Johnson', executed: 167, passRate: 91.5, bugs: 18, productivity: 'medium' },
  { name: 'Lisa Wang', executed: 156, passRate: 93.8, bugs: 15, productivity: 'medium' },
  { name: 'Tom Brown', executed: 142, passRate: 89.4, bugs: 19, productivity: 'medium' },
];

const riskyModules = [
  { module: 'Payment Gateway', failures: 12, severity: 'critical', failureRate: 13.5 },
  { module: 'Reporting', failures: 18, severity: 'high', failureRate: 13.4 },
  { module: 'API Integration', failures: 15, severity: 'high', failureRate: 9.6 },
  { module: 'File Upload', failures: 8, severity: 'medium', failureRate: 9.2 },
];

const slowTests = [
  { name: 'End-to-End Payment Flow', duration: 342, module: 'Payment' },
  { name: 'Report Generation - Large Dataset', duration: 287, module: 'Reporting' },
  { name: 'Bulk User Import', duration: 256, module: 'User Management' },
  { name: 'API Rate Limiting Test', duration: 198, module: 'API' },
];

const flakyTests = [
  { name: 'Session Timeout Verification', stability: 67, runs: 45 },
  { name: 'Real-time Notifications', stability: 72, runs: 38 },
  { name: 'Concurrent User Login', stability: 78, runs: 52 },
  { name: 'Cache Invalidation Test', stability: 81, runs: 41 },
];

const executionData = testerData.map(t => ({ name: t.name, executed: t.executed }));

export function QALeadDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-8 h-8" />
          <h2 className="text-2xl font-bold">QA Lead Analytics</h2>
        </div>
        <p className="text-blue-100">Comprehensive team performance and quality insights</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tester Productivity</h3>
          <div className="space-y-4">
            {testerData.map((tester, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      {tester.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-slate-700">{tester.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    tester.productivity === 'high' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tester.productivity}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Executed</p>
                    <p className="font-semibold text-slate-800">{tester.executed}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Pass Rate</p>
                    <p className="font-semibold text-slate-800">{tester.passRate}%</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Bugs Found</p>
                    <p className="font-semibold text-slate-800">{tester.bugs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Test Execution by Tester</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={executionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="executed" radius={[8, 8, 0, 0]}>
                {executionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${220 + index * 30}, 70%, 60%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-slate-800">Risky Modules</h3>
          </div>
          <div className="space-y-3">
            {riskyModules.map((module, index) => (
              <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-slate-800">{module.module}</h4>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    module.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    module.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {module.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{module.failures} failures</span>
                  <span className="font-semibold text-red-600">{module.failureRate}% failure rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-bold text-slate-800">Slow Tests Analysis</h3>
          </div>
          <div className="space-y-3">
            {slowTests.map((test, index) => (
              <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-800 text-sm">{test.name}</h4>
                  <span className="px-2 py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-700">
                    {test.duration}s
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{test.module}</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                      style={{ width: `${Math.min((test.duration / 342) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-slate-800">Flaky Tests Monitor</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {flakyTests.map((test, index) => (
            <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
              <h4 className="font-medium text-slate-800 text-sm mb-3">{test.name}</h4>
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={test.stability > 75 ? '#10b981' : test.stability > 70 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - test.stability / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">{test.stability}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 text-center">{test.runs} runs analyzed</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
