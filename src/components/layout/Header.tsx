import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Droplets, Store, Heart, ShoppingBag, Home, User, LogOut, Settings, Bot } from "lucide-react";
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
    { name: t("nav.diagnosis"), href: "/diagnosis", icon: Bot },
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
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center border-2 border-primary bg-primary shrink-0">
            <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-primary hidden xs:inline">
            {t("brand.name")}
          </span>
        </Link>

        {/* Desktop Navigation - show on lg and above */}
        <nav className="hidden lg:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
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
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-2 bg-popover" align="end">
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
                <Button variant="default" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {t("auth.signIn")}
                </Button>
              </Link>
            ) : null}
          </div>
        </nav>

        {/* Mobile/Tablet Navigation - show on smaller than lg */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <LanguageSwitcher />
          
          {/* Mobile User Avatar or Sign In */}
          {isLoaded && isSignedIn ? (
            <Link to="/profile">
              <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : isLoaded ? (
            <Link to="/auth">
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          ) : null}
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center border-2 border-primary bg-primary">
                    <Droplets className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold text-primary">{t("brand.name")}</span>
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col p-4">
                <div className="space-y-1">
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
                          className="w-full justify-start gap-3 h-12"
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
                
                {isSignedIn && (
                  <>
                    <div className="my-4 border-t border-border" />
                    <div className="space-y-1">
                      <Link to="/profile" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                          <User className="h-5 w-5" />
                          {t("nav.profile")}
                        </Button>
                      </Link>
                      <Link to="/settings" onClick={() => setOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                          <Settings className="h-5 w-5" />
                          {t("nav.settings")}
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        {t("auth.signOut")}
                      </Button>
                    </div>
                  </>
                )}

                {!isSignedIn && isLoaded && (
                  <>
                    <div className="my-4 border-t border-border" />
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <Button className="w-full gap-2 h-12">
                        <User className="h-5 w-5" />
                        {t("auth.signIn")}
                      </Button>
                    </Link>
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
