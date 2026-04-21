import { getAuthHeaders } from "../api/apihelpers";

const BASE_URL = "http://127.0.0.1:8000/api";

const API = async (
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true
) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      ...(requireAuth
        ? getAuthHeaders()
        : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  // ✅ FIX: handle empty response (DELETE 204)
  if (res.status === 204) {
    return null;
  }

  return res.json();
};

export default API;