import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { date: 'May 7', executed: 145, passed: 138, failed: 7 },
  { date: 'May 8', executed: 178, passed: 165, failed: 13 },
  { date: 'May 9', executed: 162, passed: 154, failed: 8 },
  { date: 'May 10', executed: 198, passed: 186, failed: 12 },
  { date: 'May 11', executed: 156, passed: 148, failed: 8 },
  { date: 'May 12', executed: 189, passed: 179, failed: 10 },
  { date: 'May 13', executed: 219, passed: 205, failed: 14 },
];

export function DailyExecutionChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Daily Execution Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
          <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="executed" stroke="#3b82f6" strokeWidth={3} name="Executed" />
          <Line type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={3} name="Passed" />
          <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={3} name="Failed" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
