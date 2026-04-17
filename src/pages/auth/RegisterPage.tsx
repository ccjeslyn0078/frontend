import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // fake register
    if (name && email && password) {
      localStorage.setItem("auth", "true");
      navigate("/projects");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white rounded-xl p-6 shadow"
      >
        <h2 className="text-2xl font-semibold mb-4">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          Register
        </button>

        <p className="text-sm mt-4">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}