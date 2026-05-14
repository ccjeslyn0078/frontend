const BASE_URL = "http://127.0.0.1:8000/api";

const API = async (
  endpoint: string,
  options: RequestInit = {},
  auth: boolean = true
) => {

  const token =
    localStorage.getItem("access");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (auth && token) {
    headers["Authorization"] =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = null;

const text = await response.text();

data = text ? JSON.parse(text) : null;

  console.log(
    "API RESPONSE:",
    endpoint,
    data
  );

  if (!response.ok) {

    throw new Error(
      data?.detail ||
      data?.message ||
      "API Error"
    );
  }

  return data;
};

export default API;