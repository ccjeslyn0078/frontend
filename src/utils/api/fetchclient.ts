const BASE_URL = "http://127.0.0.1:8000/api";

// 🔐 AUTH HEADERS (FIXED)
export const getAuthHeaders = () => {
  const token = localStorage.getItem("access");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// 🔥 MAIN API FUNCTION
const API = async (
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(requireAuth
        ? getAuthHeaders()
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  // ✅ Handle DELETE (204 No Content)
  if (res.status === 204) {
    return null;
  }

  return res.json();
};

export default API;