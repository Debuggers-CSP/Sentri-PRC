import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  username?: string;
  email: string;
  hasCompletedRecommender: boolean;
  hasCompletedMeetingRecommender: boolean;
}

interface AuthContextType {
  user: User | null;
   login: (email: string, password: string, name: string, id: number) => void;
  logout: () => void;
  completeRecommender: () => void;
  completeMeetingRecommender: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. CHANGE: Start with the user from LocalStorage instead of 'null'
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email: string, password: string, name: string, id: number) => {
    const userData = {
      id: id,
      name: name,
      email: email,
      hasCompletedRecommender: false,
      hasCompletedMeetingRecommender: false,
    };

    console.log("DEBUG 2: AuthContext saving userData:", userData); // <--- Add this
    
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // 2. CHANGE: Remove the user from storage so they stay logged out
    localStorage.removeItem("user");
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