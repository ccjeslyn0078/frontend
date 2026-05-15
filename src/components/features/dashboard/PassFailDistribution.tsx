import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Passed', value: 1175, color: '#10b981' },
  { name: 'Failed', value: 72, color: '#ef4444' },
];

export function PassFailDistribution() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6">Pass vs Fail Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-slate-600">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
