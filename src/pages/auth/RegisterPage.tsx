export default function RegisterPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl w-[350px] shadow">
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        <input
          placeholder="Name"
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Create Account
        </button>
      </div>
    </div>
  );
}