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

  const [isGuest, setIsGuest] = useState(
    localStorage.getItem("guestMode") === "true"
  );

  const [loading, setLoading] = useState(true);

  // ===========================
  // SET AUTH STATE
  // ===========================
  function setAuth(data: AuthResponse) {
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );
    localStorage.removeItem("guestMode");

    setToken(data.token);
    setUser(data.user);
    setIsGuest(false);
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ===========================
  // GUEST MODE
  // ===========================
  function continueAsGuest() {
    localStorage.removeItem("token");
    localStorage.setItem("guestMode", "true");

    const guestUser: User = {
      id: 0,
      name: "Guest",
      email: "guest@fakecheck.ai",
    };

    localStorage.setItem("user", JSON.stringify(guestUser));
    setToken(null);
    setUser(guestUser);
    setIsGuest(true);
  }

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
    localStorage.removeItem("guestMode");

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
        isAuthenticated: !!token || isGuest,
        isGuest,

        continueAsGuest,

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