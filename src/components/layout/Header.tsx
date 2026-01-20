import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Droplets, Store, Heart, ShoppingBag, Home, User, LogOut, Settings } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const navigation = [
    { name: t("nav.home"), href: "/", icon: Home },
    { name: t("nav.diagnosis"), href: "/diagnosis", icon: Droplets },
    { name: t("nav.taccau"), href: "/taccau", icon: Store },
    { name: t("nav.community"), href: "/community", icon: Heart },
    { name: t("nav.marketplace"), href: "/marketplace", icon: ShoppingBag },
  ];

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    return (first + last).toUpperCase() || user.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U";
  };

  const handleSignOut = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-card">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-primary bg-primary">
            <Droplets className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-primary">{t("brand.name")}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
          <div className="ml-2">
            <LanguageSwitcher />
          </div>
          
          {/* User Menu or Sign In */}
          <div className="ml-2">
            {isLoaded && isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-2" align="end">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {user?.fullName || user?.emailAddresses?.[0]?.emailAddress}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.emailAddresses?.[0]?.emailAddress}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      {t("nav.profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      {t("nav.settings")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("auth.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isLoaded ? (
              <Link to="/auth">
                <Button variant="default" className="gap-2">
                  <User className="h-4 w-4" />
                  {t("auth.signIn")}
                </Button>
              </Link>
            ) : null}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          
          {/* Mobile User Avatar or Sign In */}
          {isLoaded && isSignedIn ? (
            <Link to="/profile">
              <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : isLoaded ? (
            <Link to="/auth">
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          ) : null}
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-2 mt-8">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start gap-3"
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
                
                {isSignedIn && (
                  <>
                    <div className="my-2 border-t border-border" />
                    <Link to="/profile" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3">
                        <User className="h-5 w-5" />
                        {t("nav.profile")}
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 text-destructive"
                      onClick={() => {
                        setOpen(false);
                        handleSignOut();
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      {t("auth.signOut")}
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
