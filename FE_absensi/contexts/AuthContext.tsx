import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/axios/axios";
import { User } from "../types";

interface LoginCredentials {
  email: string;
  password: string;
}

type RegisterData = Omit<User, "id">;

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => void;
  register: (data: RegisterData) => void;
  logout: () => void;
  isLoggingIn: boolean;
  loginError: unknown;
  isRegistering: boolean;
  registerError: unknown;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const loginUser = async (
  credentials: LoginCredentials
): Promise<User & { token: string }> => {
  const { data } = await apiClient.post("/login", credentials);
  return data;
};

const registerUser = async (
  userData: RegisterData
): Promise<User & { token: string }> => {
  const { data } = await apiClient.post("/register", userData);
  return data;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Cek apakah ada data user di localStorage saat aplikasi dimuat
    const savedUser = localStorage.getItem("absenflow_user");
    if (savedUser) {
      const parsedUser: User & { token?: string } = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.token) {
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${parsedUser.token}`;
      }
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: ({ token, user }) => {
      localStorage.setItem("absenflow_token", token);

      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);

      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: ({ token, user }) => {
      localStorage.setItem("absenflow_token", token);

      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);

      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const logout = () => {
    localStorage.removeItem("absenflow_user");
    delete apiClient.defaults.headers.common["Authorization"];
    setUser(null);
    queryClient.clear(); // Hapus cache query saat logout
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginMutation.mutate,
        loginError: loginMutation.error,
        register: registerMutation.mutate,
        registerError: registerMutation.error,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
