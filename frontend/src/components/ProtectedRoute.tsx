import { Outlet, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn, ShieldAlert } from 'lucide-react';

export function ProtectedRoute() {
    const { loginStatus, login, isInitializing, identity } = useInternetIdentity();
    const navigate = useNavigate();
    const isAuthenticated = !!identity;
    const isLoggingIn = loginStatus === 'logging-in';

    if (isInitializing) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground font-body">Checking authentication…</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="max-w-sm w-full text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <ShieldAlert className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold font-heading text-foreground">Admin Access Required</h2>
                        <p className="text-sm text-muted-foreground font-body">
                            This page is restricted to authenticated administrators. Please log in to continue.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={login}
                            disabled={isLoggingIn}
                            className="w-full gap-2"
                        >
                            {isLoggingIn ? (
                                <>
                                    <div className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                                    Connecting…
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-4 w-4" />
                                    Login with Internet Identity
                                </>
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate({ to: '/services' })}
                            className="w-full text-muted-foreground"
                        >
                            Go to Public Services
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return <Outlet />;
}
