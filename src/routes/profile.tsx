import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { AppShell } from "@/components/AppShell";
import { useUserStore } from "@/data/useUserStore";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogOut, Camera, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { session, logout, hasCompletedOnboarding } = useUserStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!session) {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          navigate({ to: "/login" });
        }
      }
    };
    checkAuth();

    if (!session) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, age, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error loading profile:", error);
          return;
        }

        if (data) {
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setAge(data.age?.toString() || "");

          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url);
          } else if (session.user.user_metadata?.avatar_url) {
            setAvatarUrl(session.user.user_metadata.avatar_url);
          }

          if (!data.first_name) {
            setIsEditing(true);
            setTimeout(() => {
              toast.info("Welcome to MASARAK!", {
                description: "Let's build your technical CV to start matching you with opportunities.",
                duration: 6000,
              });
            }, 500);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session?.user?.id]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${session?.user.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setAvatarUrl(publicUrlData.publicUrl);
      toast.success("Photo uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload photo");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          age: age ? parseInt(age) : null,
          avatar_url: avatarUrl,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      if (!hasCompletedOnboarding) {
        useUserStore.getState().setOnboardingCompleted();
        toast.success("Profile created successfully");
        navigate({ to: "/home" });
      } else {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error: any) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate({ to: "/login" });
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto px-4 py-8 pb-32 space-y-6 max-w-2xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-display font-extrabold tracking-tight">
            {hasCompletedOnboarding ? "Your CV & Profile" : "Create Your Technical CV"}
          </h1>
          {hasCompletedOnboarding && (
            <p className="text-sm text-muted-foreground">
              Keep your profile updated to match with the best scholarships and internships.
            </p>
          )}
        </div>

        {!isEditing ? (
          <div className="bg-card p-6 rounded-3xl shadow-sm border border-border space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="size-24 rounded-full overflow-hidden border border-border bg-muted shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-3xl font-bold">
                    {firstName ? firstName[0].toUpperCase() : session?.user.email?.[0].toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold font-display text-foreground">{firstName} {lastName}</h2>
                <p className="text-sm font-medium text-muted-foreground">{session?.user.email}</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="bg-muted px-3 py-1 rounded-full text-xs font-semibold">{age} years old</span>
                </div>
              </div>
              
              <Button onClick={() => setIsEditing(true)} variant="outline" className="shrink-0 rounded-xl">
                Edit Profile
              </Button>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileText className="size-5 text-primary" /> Technical Documents
              </h3>
              
              <div className="grid gap-3">
                <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-between bg-muted/30">
                  <div>
                    <p className="font-semibold text-sm">Resume / CV</p>
                    <p className="text-xs text-muted-foreground">Upload your latest PDF</p>
                  </div>
                  <Button variant="secondary" size="sm" className="rounded-lg"><Upload className="size-4 mr-2"/> Upload</Button>
                </div>
                
                <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-between bg-muted/30">
                  <div>
                    <p className="font-semibold text-sm">Diploma Certificate</p>
                    <p className="text-xs text-muted-foreground">Verify your technical degree</p>
                  </div>
                  <Button variant="secondary" size="sm" className="rounded-lg"><Upload className="size-4 mr-2"/> Upload</Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 bg-card p-6 rounded-3xl shadow-sm border border-border">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="size-24 rounded-full bg-muted overflow-hidden border border-border flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-muted-foreground">
                      {firstName ? firstName[0].toUpperCase() : session?.user.email?.[0].toUpperCase()}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="text-white size-8" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl">
                Change Photo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Ahmed" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Hassan" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="e.g. 19" value={age} onChange={(e) => setAge(e.target.value)} min={15} max={100} required className="rounded-xl" />
            </div>

            <div className="flex gap-3 pt-4">
              {hasCompletedOnboarding && (
                <Button type="button" variant="outline" className="w-full h-12 font-semibold rounded-xl" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
              <Button type="submit" className="w-full h-12 font-semibold rounded-xl bg-accent text-accent-foreground hover:bg-accent/90" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        )}

        <div className="pt-4 flex justify-center">
          <Button variant="ghost" className="text-muted-foreground hover:text-destructive rounded-xl" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
            {loggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
