const bugs = [
  {
    id: "BUG-1",
    title: "Login button not working",
    severity: "High",
  },
];

export default function BugsPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Bugs</h1>

      {bugs.map((bug) => (
        <div key={bug.id} className="border p-4 rounded mb-2">
          <h2 className="font-medium">{bug.title}</h2>
          <p className="text-sm text-red-500">{bug.severity}</p>
        </div>
      ))}
    </div>
  );
}