import { createContext, useContext, ReactNode } from "react";

// Simplified context
interface AuthContextType {
  isAdmin: () => boolean;
  isExpert: () => boolean;
  isFarmer: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Return false for special roles, true for farmer (default guest)
  const isAdmin = () => false;
  const isExpert = () => false;
  const isFarmer = () => true;

  return (
    <AuthContext.Provider value={{ isAdmin, isExpert, isFarmer }}>
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
