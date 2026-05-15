import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'May 7', failures: 7 },
  { date: 'May 8', failures: 13 },
  { date: 'May 9', failures: 8 },
  { date: 'May 10', failures: 12 },
  { date: 'May 11', failures: 8 },
  { date: 'May 12', failures: 10 },
  { date: 'May 13', failures: 14 },
];

export function FailureTrendChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Failure Trend Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorFailures" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="failures"
            stroke="#ef4444"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorFailures)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
