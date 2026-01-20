import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Droplets } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Welcome */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center border-2 border-primary bg-primary">
                <Droplets className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === "signin" ? t("auth.signIn") : t("auth.signUp")}
            </h1>
            <p className="text-muted-foreground">
              {mode === "signin" 
                ? t("auth.signInDescription") 
                : t("auth.signUpDescription")}
            </p>
          </div>

          {/* Clerk Auth Component */}
          <Card className="border-2">
            <CardContent className="pt-6">
              {mode === "signin" ? (
                <SignIn 
                  routing="hash"
                  signUpUrl="/auth"
                  afterSignInUrl="/"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none p-0 w-full",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-2 border-border hover:bg-muted",
                      formButtonPrimary: "bg-primary hover:bg-primary/90",
                      footerAction: "hidden",
                    },
                  }}
                />
              ) : (
                <SignUp 
                  routing="hash"
                  signInUrl="/auth"
                  afterSignUpUrl="/"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "shadow-none p-0 w-full",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "border-2 border-border hover:bg-muted",
                      formButtonPrimary: "bg-primary hover:bg-primary/90",
                      footerAction: "hidden",
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>

          {/* Toggle between SignIn and SignUp */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {mode === "signin" ? t("auth.noAccount") : t("auth.hasAccount")}
            </p>
            <Button
              variant="outline"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="border-2"
            >
              {mode === "signin" ? t("auth.signUp") : t("auth.signIn")}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
