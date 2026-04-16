export default function TestRunPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Test Run</h1>

      <div className="border p-4 rounded">
        <p>Execute test cases and mark pass/fail</p>

        <button className="bg-green-500 text-white px-4 py-2 mt-3 rounded">
          Run Tests
        </button>
      </div>
    </div>
  );
}