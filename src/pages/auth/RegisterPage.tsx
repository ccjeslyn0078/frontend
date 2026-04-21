import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      alert("Registered successfully 🎉");
      navigate("/auth/login"); // ✅ FIX: absolute path
    },
    onError: () => {
      alert("Registration failed");
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    registerMutation.mutate(form);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Register</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Username"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {registerMutation.isPending ? "Registering..." : "Register"}
        </button>

        {registerMutation.isError && (
          <p className="text-red-500 text-sm text-center">
            Registration failed. Try again.
          </p>
        )}

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}