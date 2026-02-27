import { Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Loader2, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function ProtectedRoute() {
  const { identity, login, loginStatus, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const handleLogin = async () => {
      try {
        await login();
      } catch (err: any) {
        if (err?.message === 'User is already authenticated') {
          queryClient.clear();
        }
      }
    };

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          <div className="rounded-full bg-muted p-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground text-sm">
              You need to be logged in to access this section. Please authenticate with Internet Identity.
            </p>
          </div>
          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="gap-2"
          >
            {isLoggingIn ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {isLoggingIn ? 'Logging in...' : 'Login to Continue'}
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
