export const ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  ADMIN: {
    DASHBOARD: "/dashboard",
    PROJECTS: "/projects",
    PROJECT_DETAILS: (id: string) => `/projects/${id}`,
    PROJECT_OPTION: (id: string, option: string) =>
      `/projects/${id}/${option}`,
  },
};