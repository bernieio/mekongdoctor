import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  clerk_user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  province: string | null;
  district: string | null;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  role: "farmer" | "expert" | "admin";
}

interface AuthContextType {
  profile: Profile | null;
  roles: UserRole[];
  isLoading: boolean;
  hasRole: (role: "farmer" | "expert" | "admin") => boolean;
  isAdmin: () => boolean;
  isExpert: () => boolean;
  isFarmer: () => boolean;
  refreshProfile: (clerkUserId: string) => Promise<void>;
  clearProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async (clerkUserId: string) => {
    try {
      setIsLoading(true);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("clerk_user_id", clerkUserId)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return;
      }

      if (profileData) {
        setProfile(profileData as Profile);

        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profileData.id);

        if (rolesError) {
          console.error("Error fetching roles:", rolesError);
        } else {
          setRoles((rolesData as UserRole[]) || []);
        }
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async (clerkUserId: string) => {
    await fetchProfile(clerkUserId);
  };

  const clearProfile = () => {
    setProfile(null);
    setRoles([]);
  };

  const hasRole = (role: "farmer" | "expert" | "admin"): boolean => {
    return roles.some((r) => r.role === role);
  };

  const isAdmin = () => hasRole("admin");
  const isExpert = () => hasRole("expert");
  const isFarmer = () => hasRole("farmer");

  return (
    <AuthContext.Provider
      value={{
        profile,
        roles,
        isLoading,
        hasRole,
        isAdmin,
        isExpert,
        isFarmer,
        refreshProfile,
        clearProfile,
      }}
    >
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
