import { Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { ShieldOff, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

interface ProtectedRouteProps {
  adminOnly?: boolean;
  children?: React.ReactNode;
}

export default function ProtectedRoute({ adminOnly = false, children }: ProtectedRouteProps) {
  const { identity, login, loginStatus, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  // Show loading while initializing auth
  if (isInitializing || (isAuthenticated && adminOnly && adminLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Login Required</h2>
          <p className="text-sm text-muted-foreground">
            You need to be logged in to access this page.
          </p>
          <Button
            onClick={async () => {
              try {
                await login();
                queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
              } catch (e) {
                console.error('Login error:', e);
              }
            }}
            disabled={isLoggingIn}
            className="w-full"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Authenticated but not admin
  if (adminOnly && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
            <ShieldOff className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
          <p className="text-sm text-muted-foreground">
            You don't have permission to access this admin area.
          </p>
          <Button variant="outline" onClick={() => { window.location.href = '/'; }}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
