import { APP_CONFIG } from "@/config/app.config";

export async function fetchClient(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem("access"); // JWT token

  const response = await fetch(`${APP_CONFIG.apiBaseUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("API Error");
  }

  return response.json();
}