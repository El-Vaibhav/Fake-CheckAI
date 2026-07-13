import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import api from "@/api/api";
import {
  AuthContextType,
  User,
  AuthResponse,
} from "@/types/auth";

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ===========================
  // LOGIN
  // ===========================
  async function login(email: string, password: string) {
    const response = await api.post<AuthResponse>(
      "/login",
      {
        email,
        password,
      }
    );

    const data = response.data;

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);
  }

  // ===========================
  // REGISTER
  // ===========================
  async function register(
  name: string,
  email: string,
  password: string
) {
  const response = await api.post<AuthResponse>(
    "/register",
    {
      name,
      email,
      password,
    }
  );

  const data = response.data;

  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  setToken(data.token);
  setUser(data.user);
}

  // ===========================
  // LOGOUT
  // ===========================
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);

    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,

        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}