import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function Layout() {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            {isInitializing ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Button
                variant={isAuthenticated ? 'outline' : 'default'}
                size="sm"
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Logging in...</span>
                  </>
                ) : isAuthenticated ? (
                  <>
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Logout</span>
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
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
