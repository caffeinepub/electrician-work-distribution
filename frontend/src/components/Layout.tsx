import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as { message?: string };
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-foreground/70 hover:text-foreground" />
            <img
              src="/assets/generated/technical-tech-logo.dim_500x500.png"
              alt="Technical Tech"
              className="h-10 w-10 object-contain"
            />
            <span className="font-heading text-xl font-bold text-foreground tracking-wide hidden sm:block">
              Technical Tech
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                Logged in
              </span>
            )}
            <Button
              variant={isAuthenticated ? "outline" : "default"}
              size="sm"
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="gap-2"
            >
              {isLoggingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAuthenticated ? (
                <LogOut className="h-4 w-4" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isLoggingIn ? "Logging in..." : isAuthenticated ? "Logout" : "Login"}
              </span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
