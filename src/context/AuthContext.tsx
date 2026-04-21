import { createContext, useContext, useState } from "react";
import API from "../utils/api/fetchclient";

type AuthContextType = {
  user: any;
  token: string | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<any>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null
  );

  const isAuthenticated = !!token;

  // ✅ LOGIN (FIXED)
  const login = async (data: any) => {
    const res = await API(
      "/users/login/",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false // ❗ no auth header
    );

    // adjust based on your backend response
    const accessToken = res.tokens?.access || res.access;

    // store token
    localStorage.setItem("token", accessToken);
    setToken(accessToken);

    // store user (if exists)
    if (res.user) {
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
    }
  };

  // ✅ REGISTER (FIXED)
  const register = async (data: any) => {
    await API(
      "/users/register/",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false // ❗ no auth header
    );
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
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