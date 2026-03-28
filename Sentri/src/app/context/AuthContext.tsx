import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  hasCompletedRecommender: boolean;
  hasCompletedMeetingRecommender: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, name?: string) => void;
  logout: () => void;
  completeRecommender: () => void;
  completeMeetingRecommender: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, name?: string) => {
    // Mock login - in real app would call API
    setUser({
      id: "1",
      name: name || email.split("@")[0],
      email,
      hasCompletedRecommender: false,
      hasCompletedMeetingRecommender: false,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const completeRecommender = () => {
    if (user) {
      setUser({ ...user, hasCompletedRecommender: true });
    }
  };

  const completeMeetingRecommender = () => {
    if (user) {
      setUser({ ...user, hasCompletedMeetingRecommender: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, completeRecommender, completeMeetingRecommender }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}