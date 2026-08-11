import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { adminSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ShieldCheck, GraduationCap, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin-login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError, data } = await adminSupabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      // Verify role
      const { data: profile, error: profileError } = await adminSupabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        setError("Access denied. Administrator privileges required.");
        await adminSupabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Success, navigate to admin dashboard
      navigate({ to: "/admin/schools" });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left side: decorative/branding area */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-zinc-900 p-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-zinc-900 to-black opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />

        <div className="relative z-10 flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-indigo-400" />
          <span className="text-xl font-bold tracking-tight">School Guide</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg mt-auto pb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Administrative Portal
          </h1>
          <p className="text-lg text-zinc-300">
            Secure access to manage schools, applications, and student profiles for the School Guide
            platform.
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-400">
          &copy; {new Date().getFullYear()} School Guide Platform
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 sm:p-12">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-indigo-100 p-3 mb-4">
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Admin Login</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your credentials to access the administrative dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="email"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@schoolguide.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="password"
                  >
                    Password
                  </label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
