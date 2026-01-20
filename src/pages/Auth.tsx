import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Droplets } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { t } = useLanguage();
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/");
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Don't render auth form if already signed in
  if (isSignedIn) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-6 sm:py-12 px-3 sm:px-4">
        <div className="w-full max-w-[min(100%,24rem)] sm:max-w-md space-y-4 sm:space-y-6">
          {/* Logo and Welcome */}
          <div className="text-center space-y-1.5 sm:space-y-2">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center border-2 border-primary bg-primary rounded-lg">
                <Droplets className="h-7 w-7 sm:h-10 sm:w-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {mode === "signin" ? t("auth.signIn") : t("auth.signUp")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              {mode === "signin" 
                ? t("auth.signInDescription") 
                : t("auth.signUpDescription")}
            </p>
          </div>

          {/* Clerk Auth Component */}
          <Card className="border-2 shadow-sm">
            <CardContent className="p-4 sm:pt-6 sm:px-6">
              {mode === "signin" ? (
                <SignIn 
                  routing="hash"
                  afterSignInUrl="/"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none p-0 w-full",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-2 border-border hover:bg-muted text-sm sm:text-base py-2.5 sm:py-3",
                      formFieldInput: "text-sm sm:text-base py-2 sm:py-2.5",
                      formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm sm:text-base py-2.5 sm:py-3",
                      footerAction: "hidden",
                      formFieldLabel: "text-sm",
                      identityPreviewText: "text-sm",
                      formFieldAction: "text-sm",
                    },
                  }}
                />
              ) : (
                <SignUp 
                  routing="hash"
                  afterSignUpUrl="/"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none p-0 w-full",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-2 border-border hover:bg-muted text-sm sm:text-base py-2.5 sm:py-3",
                      formFieldInput: "text-sm sm:text-base py-2 sm:py-2.5",
                      formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm sm:text-base py-2.5 sm:py-3",
                      footerAction: "hidden",
                      formFieldLabel: "text-sm",
                      identityPreviewText: "text-sm",
                      formFieldAction: "text-sm",
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Toggle between SignIn and SignUp */}
          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {mode === "signin" ? t("auth.noAccount") : t("auth.hasAccount")}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="border-2 text-sm sm:text-base px-4 sm:px-6"
            >
              {mode === "signin" ? t("auth.signUp") : t("auth.signIn")}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
