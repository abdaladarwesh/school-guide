import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { AppShell } from "@/components/AppShell";
import { useUserStore } from "@/data/useUserStore";
import { useSchoolsStore } from "@/data/useSchoolsStore";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Loader2, LogOut, Camera, Check, ChevronsUpDown, Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const { session, logout, hasCompletedOnboarding, tier } = useUserStore();
  const { schools, fetchSchools } = useSchoolsStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
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

    if (schools.length === 0) {
      fetchSchools();
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("first_name, last_name, age, school_id, avatar_url")
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
          setSchoolId(data.school_id);

          // Fallback to Google avatar if none in DB
          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url);
          } else if (session.user.user_metadata?.avatar_url) {
            setAvatarUrl(session.user.user_metadata.avatar_url);
          }

          if (!data.first_name) {
            setIsEditing(true);
            setTimeout(() => {
              toast.info("First time here? Let's get to know you!", {
                description: "You must enter your details below before you can explore schools.",
                duration: 6000,
              });
            }, 500);
          }
        } else {
          setIsEditing(true);
          setTimeout(() => {
            toast.info("First time here? Let's get to know you!", {
              description: "You must enter your details below before you can explore schools.",
              duration: 6000,
            });
          }, 500);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session, navigate, fetchSchools, schools.length]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${session?.user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setAvatarUrl(publicUrlData.publicUrl);
      toast.success("Photo uploaded successfully");
    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
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
          school_id: schoolId === "none" ? null : schoolId,
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
      console.error("Error updating profile:", error.message);
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
        <div className="mx-auto space-y-6 px-4 py-8 pb-32">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
            <div className="h-5 w-64 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Profile Card Skeleton (Defaults to standard tier layout) */}
          <div className="relative flex flex-col items-center space-y-6 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
            
            {/* Avatar Skeleton */}
            <div className="mt-4 size-24 shrink-0 animate-pulse rounded-full border-2 border-border bg-muted" />

            {/* Name & Age Skeleton */}
            <div className="flex w-full flex-col items-center space-y-2">
              <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
            </div>

            {/* School Section Skeleton */}
            <div className="w-full border-t border-border pt-4">
              <div className="mb-3 h-5 w-16 animate-pulse rounded-md bg-muted" />
              <div className="h-[68px] w-full animate-pulse rounded-xl border border-border bg-muted/30" />
            </div>

            {/* Edit Button Skeleton */}
            <div className="mt-2 h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>

          {/* Logout Button Skeleton */}
          <div className="flex justify-center pt-4">
            <div className="h-10 w-32 animate-pulse rounded-md bg-muted/50" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto px-4 py-8 pb-32 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            {hasCompletedOnboarding ? "Your Profile" : "Welcome to School Guide!"}
          </h1>
          {hasCompletedOnboarding && (
            <p className="text-sm text-muted-foreground">
              Manage your personal information and preferences.
            </p>
          )}
        </div>

        {!hasCompletedOnboarding && (
          <div className="rounded-xl border-2 border-indigo/50 bg-indigo/10 p-4 text-center shadow-sm">
            <h3 className="font-display font-bold text-indigo">
              First time here? Let's get to know you!
            </h3>
            <p className="mt-1 text-sm font-medium text-indigo/80">
              You must enter your details below for the first time before you can explore schools and start your journey.
            </p>
          </div>
        )}

        {!isEditing ? (
          <div
            className={cn(
              "p-6 rounded-2xl shadow-sm space-y-6 flex flex-col items-center relative overflow-hidden transition-all",
              tier === "max"
                ? "bg-[image:var(--gradient-hero)] text-primary-foreground border-0 shadow-[var(--shadow-float)]"
                : tier === "plus"
                  ? "bg-card border-2 border-indigo/30 shadow-md"
                  : "bg-card border border-border",
            )}
          >
            {tier === "max" && (
              <div className="absolute top-4 right-4">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-md shadow-lg border border-white/10">
                  <Crown className="size-3 text-or" /> Max Member
                </span>
              </div>
            )}
            {tier === "plus" && (
              <div className="absolute top-4 right-4">
                <span className="bg-indigo/10 text-indigo px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-indigo/20">
                  <Sparkles className="size-3" /> Plus Member
                </span>
              </div>
            )}

            <div
              className={cn(
                "size-24 rounded-full overflow-hidden flex items-center justify-center relative mt-4",
                tier === "max"
                  ? "border-4 border-or/80 shadow-[0_0_20px_rgba(255,165,0,0.5)] bg-white/10"
                  : tier === "plus"
                    ? "border-4 border-indigo/60 shadow-[0_0_20px_rgba(99,102,241,0.4)] bg-muted"
                    : "border-2 border-border bg-muted",
              )}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span
                  className={cn(
                    "text-4xl font-bold",
                    tier === "max" ? "text-primary-foreground" : "text-muted-foreground",
                  )}
                >
                  {firstName ? firstName[0].toUpperCase() : session?.user.email?.[0].toUpperCase()}
                </span>
              )}
            </div>

            <div className="text-center space-y-1">
              <h2
                className={cn(
                  "text-xl font-bold font-display",
                  tier === "max" ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {firstName} {lastName}
              </h2>
              <p
                className={cn(
                  "text-sm font-medium",
                  tier === "max" ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {age} years old
              </p>
            </div>

            <div
              className={cn(
                "w-full pt-4 border-t",
                tier === "max" ? "border-white/20" : "border-border",
              )}
            >
              <h3
                className={cn(
                  "text-sm font-medium mb-3",
                  tier === "max" ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                School
              </h3>
              {schoolId ? (
                <div
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border",
                    tier === "max" ? "bg-white/10 border-white/10" : "bg-muted/30 border-border",
                  )}
                >
                  {schools.find((s) => s.id === schoolId)?.logo && (
                    <img
                      src={schools.find((s) => s.id === schoolId)?.logo}
                      alt="School Logo"
                      className="w-10 h-10 object-contain rounded-md bg-white border border-border/50 shrink-0"
                    />
                  )}
                  <span className="font-semibold">
                    {schools.find((s) => s.id === schoolId)?.name}
                  </span>
                </div>
              ) : (
                <div
                  className={cn(
                    "p-3 rounded-xl border text-sm text-center font-medium",
                    tier === "max"
                      ? "bg-white/10 border-white/10 text-primary-foreground/80"
                      : "bg-muted/30 border-border text-muted-foreground",
                  )}
                >
                  Still searching for a school
                </div>
              )}
            </div>

            <Button
              className={cn(
                "w-full mt-2 font-semibold",
                tier === "max" ? "bg-white/20 hover:bg-white/30 text-white" : "",
              )}
              variant={tier === "max" ? "ghost" : "default"}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="space-y-6 bg-card p-6 rounded-2xl shadow-sm border border-border"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="size-24 rounded-full bg-muted overflow-hidden border-2 border-border flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-muted-foreground">
                      {firstName
                        ? firstName[0].toUpperCase()
                        : session?.user.email?.[0].toUpperCase()}
                    </span>
                  )}

                  <div
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="text-white size-8" />
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g. 15"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={5}
                max={100}
                required
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <Label htmlFor="school">Your School</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="school"
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between font-normal h-auto py-2.5",
                      !schoolId && "text-muted-foreground",
                    )}
                  >
                    {schoolId ? (
                      <div className="flex items-center gap-2 overflow-hidden text-left">
                        {schools.find((s) => s.id === schoolId)?.logo && (
                          <img
                            src={schools.find((s) => s.id === schoolId)?.logo}
                            alt="Logo"
                            className="w-6 h-6 object-contain rounded-md border border-border/50 shrink-0 bg-white"
                          />
                        )}
                        <span className="truncate">
                          {schools.find((s) => s.id === schoolId)?.name}
                        </span>
                      </div>
                    ) : (
                      "Select a school"
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Search schools..." />
                    <CommandList>
                      <CommandEmpty>No school found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="I'm still searching"
                          onSelect={() => {
                            setSchoolId(null);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 shrink-0",
                              schoolId === null ? "opacity-100" : "opacity-0",
                            )}
                          />
                          I'm still searching
                        </CommandItem>
                        {schools.map((school) => (
                          <CommandItem
                            value={school.name}
                            key={school.id}
                            onSelect={() => {
                              setSchoolId(school.id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                school.id === schoolId ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {school.logo && (
                              <img
                                src={school.logo}
                                alt="Logo"
                                className="w-6 h-6 object-contain mr-2 rounded-md border border-border/50 shrink-0 bg-white"
                              />
                            )}
                            <span className="truncate">{school.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-3 pt-2">
              {hasCompletedOnboarding && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 font-semibold"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" className="w-full h-12 font-semibold" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        )}

        <div className="pt-4 flex justify-center">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            {loggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
