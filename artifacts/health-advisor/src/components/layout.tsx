import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useLogoutUser } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetCurrentUserQueryKey } from "@workspace/api-client-react";
import { Menu, User, LogOut, History, BookOpen, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogoMark } from "@/components/logo";
import { PwaInstallBanner } from "@/components/pwa-install";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const logout = useLogoutUser();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() });
        setLocation("/");
        setIsMobileMenuOpen(false);
      },
    });
  };

  const navLinks = isAuthenticated
    ? [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/history", label: "My History", icon: History },
        { href: "/diseases", label: "Conditions Guide", icon: BookOpen },
      ]
    : [
        { href: "/diseases", label: "Conditions Guide", icon: BookOpen },
      ];

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
            <LogoMark size={28} />
            <span className="font-semibold text-lg tracking-tight">HealthAdvisor</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user?.name}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px] flex flex-col">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex items-center gap-2 text-primary mb-8">
                  <LogoMark size={26} />
                  <span className="font-semibold text-lg">HealthAdvisor</span>
                </div>

                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          location === link.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto flex flex-col gap-4 border-t pt-6">
                  {!isLoading && (
                    <>
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {user?.name}
                          </div>
                          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" asChild className="w-full">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                          </Button>
                          <Button asChild className="w-full">
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t bg-muted/40 py-8 mt-auto">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4 text-primary opacity-80">
            <LogoMark size={20} />
            <span className="font-medium">HealthAdvisor</span>
          </div>
          <p className="max-w-md mx-auto mb-4">
            Providing accessible, clear, and reassuring health guidance.
            This tool is for informational purposes and does not replace professional medical advice.
          </p>
          <p>© {new Date().getFullYear()} HealthAdvisor. All rights reserved.</p>
        </div>
      </footer>

      <PwaInstallBanner />
    </div>
  );
}
