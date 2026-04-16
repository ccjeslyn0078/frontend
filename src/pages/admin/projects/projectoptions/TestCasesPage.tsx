const mockTestCases = [
  {
    id: "TC-001",
    title: "Login with valid credentials",
    status: "Pass",
    priority: "High",
  },
  {
    id: "TC-002",
    title: "Login with invalid credentials",
    status: "Fail",
    priority: "High",
  },
];

export default function TestCasesPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Test Cases</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
          </tr>
        </thead>

        <tbody>
          {mockTestCases.map((tc) => (
            <tr key={tc.id} className="text-center border-t">
              <td>{tc.id}</td>
              <td>{tc.title}</td>
              <td>{tc.status}</td>
              <td>{tc.priority}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}