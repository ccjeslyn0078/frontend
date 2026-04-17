import { fetchClient } from "./fetchclient";
import { ENDPOINTS } from "./endpoints";

export async function loginApi(data: { email: string; password: string }) {
  return fetchClient(ENDPOINTS.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerApi(data: {
  username: string;
  email: string;
  password: string;
}) {
  return fetchClient(ENDPOINTS.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify(data),
  });
}