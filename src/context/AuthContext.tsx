import { createContext, useContext, useState } from "react";

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

  const isAuthenticated = !!token;

  // ✅ MOCK LOGIN (no backend)
  const login = async (data: any) => {
    console.log("Login Data:", data);

    // fake token
    const fakeToken = "demo-token";

    localStorage.setItem("token", fakeToken);
    setToken(fakeToken);
  };

  // ✅ MOCK REGISTER
  const register = async (data: any) => {
    console.log("Register Data:", data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user: null, token, login, register, logout, isAuthenticated }}
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