export const getRole = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.role;
};

export const can = (role: string, resource: string, action: string) => {
  const ROLE_ROUTES: any = {
    admin: {
      projects: ["create", "read", "update", "delete"],
      modules: ["create", "read", "update", "delete"],
      screens: ["create", "read", "update", "delete"],
      testcases: ["create", "read", "update", "delete"],
      bugs: ["create", "read", "update", "delete"],
      testruns: ["create", "read", "update"],
    },
    tester: {
      projects: ["read"],
      modules: ["create", "read", "update"],
      screens: ["create", "read", "update"],
      testcases: ["create", "read", "update"],
      bugs: ["create", "read", "update", "delete"],
      testruns: ["create", "read", "update"],
    },
    reviewer: {
      projects: ["read"],
      modules: ["read"],
      screens: ["read"],
      testcases: ["read"],
      bugs: ["read", "update"],
      testruns: ["read", "update"],
    },
    superadmin: {
      projects: ["create", "read", "update", "delete"],
      modules: ["create", "read", "update", "delete"],
      screens: ["create", "read", "update", "delete"],
      testcases: ["create", "read", "update", "delete"],
      bugs: ["create", "read", "update", "delete"],
      testruns: ["create", "read", "update"],
    },
  };

  return ROLE_ROUTES[role]?.[resource]?.includes(action);
};