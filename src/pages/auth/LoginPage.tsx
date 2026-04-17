import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "@/api/auth.api"; // ✅ added

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ ONLY THIS FUNCTION UPDATED (logic preserved)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password) {
      try {
        await loginApi({ email, password });

        // ✅ SAME LOGIC (no change)
        localStorage.setItem("auth", "true");
        navigate("/projects");
      } catch (err) {
        console.error("Login failed", err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white rounded-xl p-6 shadow"
      >
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>

        <p className="text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/auth/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}