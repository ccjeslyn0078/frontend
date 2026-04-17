import { fetchClient } from "./fetchclient";
import { ENDPOINTS } from "./endpoints";

export async function getProjects() {
  return fetchClient(ENDPOINTS.PROJECTS);
}