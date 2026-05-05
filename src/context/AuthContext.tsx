import { createContext, useContext, useEffect, useState } from "react";
import API from "../utils/api/fetchclient";

type UserType = {
  id: string;
  username: string;
  email: string;
  role: string;
  organization?: string;
};

type AuthContextType = {
  user: UserType | null;
  token: string | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access")
  );

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  // ✅ FETCH CURRENT USER (/me)
  const fetchUser = async () => {
    try {
      const res = await API("/users/me/", { method: "GET" }, true);

      setUser(res);

      // 🔥🔥 CRITICAL FIX — STORE ROLE IN LOCALSTORAGE
      localStorage.setItem(
        "user",
        JSON.stringify({
          role: res?.role?.toLowerCase() || "admin", // fallback safety
        })
      );

    } catch (err) {
      console.error("Failed to fetch user", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ✅ AUTO FETCH ON APP LOAD
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // ✅ LOGIN
  const login = async (data: any) => {
    const res = await API(
      "/users/login/",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false
    );

    const accessToken = res.tokens?.access || res.access;

    localStorage.setItem("access", accessToken);
    setToken(accessToken);

    // 🔥 Fetch user → also stores role now
    await fetchUser();
  };

  // ✅ REGISTER
  const register = async (data: any) => {
    await API(
      "/users/register/",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false
    );
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};