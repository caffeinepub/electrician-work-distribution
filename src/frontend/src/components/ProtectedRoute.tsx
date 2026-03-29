import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Outlet } from "@tanstack/react-router";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";

// Admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "TechAdmin@2025";
const OWNER_EMAIL = "velumanickam721@gmail.com";

const STORAGE_KEY = "technicaltech_admin_auth";

function isAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

interface ProtectedRouteProps {
  adminOnly?: boolean;
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  adminOnly = false,
  children,
}: ProtectedRouteProps) {
  const [loggedIn, setLoggedIn] = useState<boolean>(isAdminLoggedIn);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (!adminOnly) {
    return children ? <>{children}</> : <Outlet />;
  }

  if (!loggedIn) {
    function handleEmailSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (email.trim().toLowerCase() === OWNER_EMAIL) {
        setEmailVerified(true);
        setEmailError("");
      } else {
        setEmailError(
          "Access denied. This portal is restricted to the admin account.",
        );
      }
    }

    function handleLogin(e: React.FormEvent) {
      e.preventDefault();
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem(STORAGE_KEY, "true");
        setLoggedIn(true);
        setError("");
      } else {
        setError("Incorrect username or password. Please try again.");
      }
    }

    return (
      <div className="flex items-center justify-center min-h-[80vh] p-6">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/10 border-2 border-amber-400/40">
              <ShieldCheck className="h-7 w-7 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Admin Login</h2>
            <p className="text-sm text-muted-foreground text-center">
              Technical Tech — Admin Portal
            </p>
          </div>

          {!emailVerified ? (
            /* Step 1: Gmail verification */
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="admin-email">Gmail Account</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your Gmail address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              {emailError && (
                <p className="text-sm text-destructive text-center">
                  {emailError}
                </p>
              )}
              <Button type="submit" className="w-full mt-1">
                Verify Gmail
              </Button>
            </form>
          ) : (
            /* Step 2: Username/password login — credentials shown only here */
            <>
              {/* Credentials hint box — only visible after Gmail verified */}
              <div className="mb-6 rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-3">
                <p className="text-xs font-semibold text-amber-400 mb-1">
                  Admin Credentials
                </p>
                <p className="text-sm text-foreground">
                  Username: <span className="font-mono font-bold">admin</span>
                </p>
                <p className="text-sm text-foreground">
                  Password:{" "}
                  <span className="font-mono font-bold">TechAdmin@2025</span>
                </p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input
                    id="admin-username"
                    data-ocid="admin_login.input"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      data-ocid="admin_login.input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p
                    data-ocid="admin_login.error_state"
                    className="text-sm text-destructive text-center"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  data-ocid="admin_login.submit_button"
                  className="w-full mt-1"
                >
                  Login to Admin Portal
                </Button>

                <button
                  type="button"
                  className="text-xs text-muted-foreground text-center hover:underline"
                  onClick={() => {
                    setEmailVerified(false);
                    setEmail("");
                    setError("");
                  }}
                >
                  Use a different Gmail account
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
