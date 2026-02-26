import { Outlet } from '@tanstack/react-router';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { LogIn, LogOut, User } from 'lucide-react';

export function Layout() {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const principalText = identity ? identity.getPrincipal().toString() : null;
  const truncatedPrincipal = principalText
    ? `${principalText.slice(0, 5)}…${principalText.slice(-4)}`
    : null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen bg-background">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
          <div className="h-4 w-px bg-border" />
          <img
            src="/assets/generated/electropro-logo.dim_300x80.png"
            alt="Technical Tech Logo"
            className="h-7 object-contain"
            loading="eager"
          />
          <span className="text-sm text-muted-foreground font-body hidden sm:inline">Technical Tech</span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Auth controls */}
          {!isInitializing && (
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs text-primary font-mono" title={principalText ?? ''}>
                      {truncatedPrincipal}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clear}
                    className="gap-1.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="gap-1.5 text-xs transition-all"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      <span className="hidden sm:inline">Connecting…</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Login</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </header>

        {/* Main content with fade-in transition */}
        <main className="flex-1 overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster richColors theme="dark" />
    </SidebarProvider>
  );
}
