export const getRole = () => {
  try {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
      console.warn("No user found in localStorage");
      return null;
    }

    const user = JSON.parse(userStr);

    console.log("USER:", user); // debug
    console.log("ROLE:", user?.role); // debug

    // 🔥 normalize role (VERY IMPORTANT)
    return user?.role ? user.role.toLowerCase() : null;

  } catch (error) {
    console.error("Error parsing user:", error);
    return null;
  }
};

export const can = (role: string, resource: string, action: string) => {
  if (!role) return false;

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

  return ROLE_ROUTES[role]?.[resource]?.includes(action) || false;
};