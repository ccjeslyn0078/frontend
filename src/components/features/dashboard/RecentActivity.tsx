import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const activities = [
  { id: 1, type: 'pass', user: 'John Doe', action: 'completed test run', target: 'Payment Gateway - Regression Suite', time: '2 minutes ago', icon: CheckCircle, color: 'text-green-600' },
  { id: 2, type: 'fail', user: 'Sarah Chen', action: 'reported bug', target: 'Login Flow - Session Timeout', time: '15 minutes ago', icon: XCircle, color: 'text-red-600' },
  { id: 3, type: 'pass', user: 'Mike Johnson', action: 'verified fix', target: 'Dashboard - Data Loading', time: '32 minutes ago', icon: CheckCircle, color: 'text-green-600' },
  { id: 4, type: 'warning', user: 'Lisa Wang', action: 'marked as blocked', target: 'API Integration - OAuth Flow', time: '1 hour ago', icon: AlertCircle, color: 'text-yellow-600' },
  { id: 5, type: 'pending', user: 'Tom Brown', action: 'started test run', target: 'User Management - CRUD Operations', time: '2 hours ago', icon: Clock, color: 'text-blue-600' },
];

export function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all">
              <div className={`w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-sm text-slate-600 mt-1">{activity.target}</p>
                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
