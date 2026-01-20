import { createContext, useContext, useState, ReactNode } from "react";
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

type RoleType = "farmer" | "expert" | "admin";

interface AuthContextType {
  profile: Profile | null;
  roles: RoleType[];
  isLoading: boolean;
  hasRole: (role: RoleType) => boolean;
  isAdmin: () => boolean;
  isExpert: () => boolean;
  isFarmer: () => boolean;
  refreshProfile: (clerkUserId: string) => Promise<void>;
  clearProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async (clerkUserId: string) => {
    try {
      setIsLoading(true);

      // Use edge function to fetch profile (bypasses RLS)
      const { data, error } = await supabase.functions.invoke("get-profile", {
        body: { clerkUserId },
      });

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data?.profile) {
        setProfile(data.profile as Profile);
        setRoles((data.roles as RoleType[]) || []);
      } else {
        setProfile(null);
        setRoles([]);
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

  const hasRole = (role: RoleType): boolean => {
    return roles.includes(role);
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
