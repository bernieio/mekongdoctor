import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

// This hook integrates with Clerk when the SDK is available
// For now, it provides a placeholder for the Clerk user state

interface ClerkUser {
  id: string;
  emailAddresses?: Array<{ emailAddress: string }>;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

interface UseClerkAuthReturn {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: ClerkUser | null;
}

export function useClerkAuth(): UseClerkAuthReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<ClerkUser | null>(null);
  const { refreshProfile, clearProfile } = useAuth();

  // Check for Clerk on window (when Clerk SDK is loaded)
  useEffect(() => {
    const checkClerk = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clerk = (window as any).Clerk;
      
      if (clerk) {
        try {
          await clerk.load();
          setIsLoaded(true);
          
          const clerkUser = clerk.user;
          if (clerkUser) {
            setIsSignedIn(true);
            setUser({
              id: clerkUser.id,
              emailAddresses: clerkUser.emailAddresses,
              firstName: clerkUser.firstName,
              lastName: clerkUser.lastName,
              imageUrl: clerkUser.imageUrl,
            });
            // Sync with our auth context
            await refreshProfile(clerkUser.id);
          } else {
            setIsSignedIn(false);
            setUser(null);
            clearProfile();
          }
        } catch (error) {
          console.error("Error loading Clerk:", error);
          setIsLoaded(true);
        }
      } else {
        // Clerk not available, mark as loaded with no user
        setIsLoaded(true);
      }
    };

    checkClerk();

    // Listen for Clerk auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes("clerk")) {
        checkClerk();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshProfile, clearProfile]);

  return { isLoaded, isSignedIn, user };
}
