export interface User {
  id: number;
  name: string;
  email: string;

  // Optional fields for Google users
  profile_picture?: string;
  provider?: "local" | "google";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;

  loginWithGoogle: (
  code: string
) => Promise<void>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;
}