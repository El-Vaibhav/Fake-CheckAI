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

  const [isGuest, setIsGuest] = useState(
    localStorage.getItem("guest") === "true"
  );

  // ===========================
  // SET AUTH STATE
  // ===========================
  function setAuth(data: AuthResponse) {
    localStorage.removeItem("guest");
    setIsGuest(false);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  }

  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  setIsGuest(localStorage.getItem("guest") === "true");

  setLoading(false);
}, []);

  // ===========================
  // LOGIN
  // ===========================
  async function login(
    email: string,
    password: string
  ) {
    const response = await api.post<AuthResponse>(
      "/login",
      {
        email,
        password,
      }
    );

    setAuth(response.data);
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

    setAuth(response.data);
  }

  // ===========================
  // GOOGLE LOGIN
  // ===========================
  // ===========================
  // GOOGLE LOGIN
  // ===========================
  async function loginWithGoogle(
    credential: string
  ) {
    const response = await api.post<AuthResponse>(
      "/google-login",
      {
        credential,
      }
    );

    setAuth(response.data);
  }

  // ===========================
  // GOOGLE REGISTER
  // ===========================
  async function registerWithGoogle(
    credential: string
  ) {
    const response = await api.post<AuthResponse>(
      "/google-register",
      {
        credential,
      }
    );

    setAuth(response.data);
  }

  // ===========================
  // LOGOUT
  // ===========================
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("guest");

    setUser(null);
    setToken(null);
    setIsGuest(false);

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
        loginWithGoogle,

        register,
        registerWithGoogle,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}