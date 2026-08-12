import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Star,
  Users,
  Calendar,
  Briefcase,
  MapPin,
  ArrowRight,
  Heart,
  MessageCircle,
  Plus,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BottomNav } from "@/components/BottomNav";
import { useSchoolsStore } from "@/data/useSchoolsStore";
import { useUserStore } from "@/data/useUserStore";
import { supabase } from "@/lib/supabase";
import { Camera, Image as ImageIcon } from "lucide-react";
import { SchoolForm } from "@/components/admin/SchoolForm";
import {
  useCommunityPosts,
  useAddPost,
  useLikePost,
  useUnlikePost,
  useReplies,
  useAddReply,
  Reply,
} from "@/data/useCommunityStore";
import { useLikedPostsStore } from "@/data/useLikedPostsStore";
import type { School } from "@/data/schools";
import { toast } from "sonner";

export const Route = createFileRoute("/school/$schoolId")({
  loader: async ({ params }) => {
    let schools = useSchoolsStore.getState().schools;
    
    // If store is empty, fetch schools first to prevent 404 on direct valid URL visits
    if (schools.length === 0) {
      await useSchoolsStore.getState().fetchSchools();
      schools = useSchoolsStore.getState().schools;
    }

    const school = schools.find((s) => s.id === params.schoolId);
    if (!school) {
      throw redirect({
        to: "/search",
      });
    }
    return { school };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "School unavailable — School Guide" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { school } = loaderData;
    const title = `${school.name} — School Guide`;
    const description = `${school.name} in ${school.location}: ${school.specializations
      .map((s) => s.name)
      .join(", ")}. Partner: ${school.partner}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SchoolPage,
});

const tabs = ["Overview", "Specializations", "Careers", "Admission", "Community"] as const;

function UserProfilePopup({
  profiles,
  children,
}: {
  profiles?: { first_name: string; last_name: string; avatar_url: string | null; age: string | null; school_id: string | null; };
  children: React.ReactNode;
}) {
  const schools = useSchoolsStore((s) => s.schools);
  const schoolName = profiles?.school_id ? schools.find(s => s.id === profiles.school_id)?.name || "Unknown School" : "Not specified";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-left hover:opacity-80 transition-opacity">
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl border-border bg-card">
        <div className="flex items-center gap-3 mb-3">
          {profiles?.avatar_url ? (
            <img src={profiles.avatar_url} alt={profiles.first_name} className="size-12 rounded-full object-cover shrink-0 shadow-sm" />
          ) : (
            <div className="grid size-12 place-items-center rounded-full bg-nuage/60 font-display text-lg font-bold text-indigo shrink-0">
              {profiles?.first_name?.slice(0, 2) || "??"}
            </div>
          )}
          <div>
            <p className="font-display text-base font-extrabold text-foreground">
              {profiles?.first_name} {profiles?.last_name}
            </p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-foreground/85">
          <p className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground w-12">Age:</span>
            {profiles?.age || "Not specified"}
          </p>
          <p className="flex items-start gap-2">
            <span className="font-semibold text-muted-foreground w-12 shrink-0">School:</span>
            <span className="line-clamp-2">{schoolName}</span>
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ReplyItem({
  reply,
  replies,
  depth = 0,
  postId,
  replyingTo,
  setReplyingTo,
  schoolAdmins,
}: {
  reply: Reply;
  replies: Reply[];
  depth?: number;
  postId: string;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  schoolAdmins?: School["school_admins"];
}) {
  const { mutate: addReply, isPending } = useAddReply();
  const [replyBody, setReplyBody] = useState("");

  const children = replies.filter((r) => r.parent_id === reply.id);

  const handleSubmit = () => {
    if (!replyBody.trim()) return;
    addReply(
      { postId, body: replyBody.trim(), parentId: reply.id },
      {
        onSuccess: () => {
          setReplyBody("");
          setReplyingTo(null);
        },
      },
    );
  };

  return (
    <div className={`mt-3 ${depth > 0 ? "ml-8 border-l-2 border-border pl-3" : ""}`}>
      <div className="flex gap-3">
        <UserProfilePopup profiles={reply.profiles}>
          {reply.profiles?.avatar_url ? (
            <img src={reply.profiles.avatar_url} alt={reply.profiles.first_name} className="size-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="grid size-8 place-items-center rounded-full bg-nuage/60 font-display text-xs font-bold text-indigo shrink-0">
              {reply.profiles?.first_name?.slice(0, 2) || "??"}
            </div>
          )}
        </UserProfilePopup>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <UserProfilePopup profiles={reply.profiles}>
              <p className="font-display text-xs font-bold text-foreground flex items-center gap-1.5">
                {reply.profiles?.first_name} {reply.profiles?.last_name}
                {schoolAdmins?.some(a => a.profiles?.email === reply.profiles?.email) && (
                  <span className="text-[9px] bg-indigo text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">Admin</span>
                )}
              </p>
            </UserProfilePopup>
          </div>
          <p className="text-xs text-foreground/85 mt-1">{reply.body}</p>
          <div className="mt-1 flex items-center gap-3">
            <button
              onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
              className="text-[10px] font-bold text-muted-foreground hover:text-indigo transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {replyingTo === reply.id && (
        <div className="mt-2 ml-11 flex gap-2">
          <input
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={!replyBody.trim() || isPending}
            className="bg-indigo text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 flex items-center gap-1"
          >
            {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
            Reply
          </button>
        </div>
      )}

      {children.map((child) => (
        <ReplyItem
          key={child.id}
          reply={child}
          replies={replies}
          depth={depth + 1}
          postId={postId}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          schoolAdmins={schoolAdmins}
        />
      ))}
    </div>
  );
}

function PostReplies({ postId, schoolAdmins }: { postId: string, schoolAdmins?: School["school_admins"] }) {
  const { data: replies = [], isLoading } = useReplies(postId);
  const { mutate: addReply, isPending } = useAddReply();
  const [replyBody, setReplyBody] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!replyBody.trim()) return;
    addReply(
      { postId, body: replyBody.trim() },
      {
        onSuccess: () => setReplyBody(""),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="w-4 h-4 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  const topLevelReplies = replies.filter((r) => !r.parent_id);

  return (
    <div className="mt-4 border-t border-border pt-4 space-y-2">
      {topLevelReplies.map((reply) => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          replies={replies}
          postId={postId}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          schoolAdmins={schoolAdmins}
        />
      ))}
      <div className="flex gap-2 pt-2">
        <input
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          placeholder="Write a reply..."
          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo"
        />
        <button
          onClick={handleSubmit}
          disabled={!replyBody.trim() || isPending}
          className="bg-indigo text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-1"
        >
          {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
          Reply
        </button>
      </div>
    </div>
  );
}

function SchoolPage() {
  const { school } = Route.useLoaderData();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [isAsking, setIsAsking] = useState(false);
  
  const { session } = useUserStore();
  const { updateSchool } = useSchoolsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = school.school_admins?.some(admin => admin.profiles?.email === session?.user?.email);

  const handleEditSubmit = async (
    data: School,
    imageFile?: File,
    logoFile?: File,
    galleryFiles?: File[],
  ) => {
    try {
      setIsSubmitting(true);
      await updateSchool(school.id, data, imageFile, logoFile, galleryFiles);
      toast.success("School updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update school");
    } finally {
      setIsSubmitting(false);
    }
  };

  // State to simulate a loading transition between schools (since TanStack loader is fast);
  const [questionBody, setQuestionBody] = useState("");
  const [questionTag, setQuestionTag] = useState("Admissions");
  const [communityFilter, setCommunityFilter] = useState("All");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [postImageFiles, setPostImageFiles] = useState<File[]>([]);
  const [postImagePreviews, setPostImagePreviews] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [fullscreenPostImages, setFullscreenPostImages] = useState<string[] | null>(null);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number>(0);

  const navigate = Route.useNavigate();
  const isSubscribed = useUserStore((s) => s.tier !== "none");
  const isLoading = useSchoolsStore((s) => s.isLoading);

  const { data: posts = [], isLoading: isPostsLoading } = useCommunityPosts(school.id);
  const { mutate: addPost, isPending: isAddingPost } = useAddPost();
  const { mutate: likePost } = useLikePost();
  const { mutate: unlikePost } = useUnlikePost();
  const { hasLiked, addLikedPost, removeLikedPost } = useLikedPostsStore();

  const handleSubmitQuestion = async () => {
    if (!questionBody.trim() && postImageFiles.length === 0) return;

    let image_urls: string[] = [];
    if (postImageFiles.length > 0) {
      try {
        setIsUploadingImage(true);
        const uploadPromises = postImageFiles.map(async (file, index) => {
          const fileExt = file.name.split(".").pop();
          const fileName = `${school.id}-post-${Date.now()}-${index}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from("school-images").upload(fileName, file);
          if (uploadError) throw uploadError;
          const { data: publicUrlData } = supabase.storage.from("school-images").getPublicUrl(fileName);
          return publicUrlData.publicUrl;
        });
        image_urls = await Promise.all(uploadPromises);
      } catch (error: any) {
        console.error("Error uploading image:", error.message);
        toast.error("Failed to upload image.");
        setIsUploadingImage(false);
        return;
      } finally {
        setIsUploadingImage(false);
      }
    }

    addPost({
      school_id: school.id,
      tag: questionTag,
      body: questionBody.trim(),
      image_urls: image_urls.length > 0 ? image_urls : undefined,
    });
    setQuestionBody("");
    setPostImageFiles([]);
    setPostImagePreviews([]);
    setIsAsking(false);
  };

  const handlePostImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setPostImageFiles((prev) => [...prev, ...files]);
      setPostImagePreviews((prev) => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    }
  };

  const handleTabClick = (t: (typeof tabs)[number]) => {
    if (t === "Community" && !isSubscribed) {
      toast.info("You must pay to use the community");
      navigate({ to: "/prime" });
      return;
    }
    setTab(t);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (school.gallery && selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % school.gallery.length);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (school.gallery && selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(
        (selectedPhotoIndex - 1 + school.gallery.length) % school.gallery.length,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen w-full bg-background pb-24">
        {/* Hero Image Skeleton */}
        <div className="relative h-60 w-full animate-pulse bg-muted">
          {/* Back Button Skeleton */}
          <div className="absolute left-4 top-4 size-10 rounded-full bg-background/40" />
          {/* Badge Skeleton */}
          <div className="absolute right-4 top-4 h-6 w-28 rounded-full bg-background/40" />
          {/* Title & Location Skeleton */}
          <div className="absolute bottom-4 left-4 right-4 space-y-2.5">
            <div className="h-7 w-2/3 rounded-lg bg-background/50" />
            <div className="h-4 w-1/3 rounded-md bg-background/50" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="-mx-0 flex gap-1 overflow-hidden border-b border-border bg-card/95 px-3 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-muted" />
          ))}
        </div>

        <div className="space-y-5 px-4 py-5">
          {/* Industry Partner Skeleton */}
          <div className="flex animate-pulse items-center gap-3 rounded-3xl bg-muted/40 p-4">
            <div className="size-12 rounded-2xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded-md bg-muted" />
              <div className="h-5 w-40 rounded-md bg-muted" />
            </div>
            <div className="h-6 w-14 rounded-full bg-muted" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex animate-pulse flex-col items-center justify-center space-y-2.5 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <div className="size-4 rounded-full bg-muted" />
                <div className="h-5 w-12 rounded-md bg-muted" />
                <div className="h-3 w-16 rounded-md bg-muted" />
              </div>
            ))}
          </div>

          {/* About Section Skeleton */}
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-1/3 rounded-md bg-muted" />
            <div className="space-y-2.5 pt-1">
              <div className="h-3.5 w-full rounded-md bg-muted" />
              <div className="h-3.5 w-[90%] rounded-md bg-muted" />
              <div className="h-3.5 w-[75%] rounded-md bg-muted" />
            </div>
          </div>

          {/* Bottom Rating Skeleton */}
          <div className="flex animate-pulse items-center gap-3 rounded-2xl bg-muted/40 p-4">
            <div className="size-5 shrink-0 rounded-full bg-muted" />
            <div className="h-4 w-64 rounded-md bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="mx-auto min-h-screen w-full bg-background pb-24">
      <div className="relative">
        <img
          src={school.image}
          alt={school.name}
          width={1024}
          height={640}
          className="h-60 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
        <Link
          to="/search"
          aria-label="Back to schools"
          className="absolute left-4 top-4 grid size-10 place-items-center rounded-full bg-card/90 text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        {isAdmin && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute left-16 top-4 flex h-10 items-center justify-center gap-2 rounded-full bg-card/90 px-4 font-bold text-foreground"
          >
            <Pencil className="size-4" /> Edit
          </button>
        )}
        {school.prime && (
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[image:var(--gradient-warm)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-accent-foreground">
            <BadgeCheck className="size-3.5" /> Prime partner
          </span>
        )}
        <div className="absolute bottom-4 left-4 right-4 text-primary-foreground flex gap-3 items-end">
          {school.logo && (
            <div className="bg-white p-1 rounded-xl shadow-lg shrink-0">
              <img
                src={school.logo}
                alt={`${school.name} Logo`}
                className="size-16 object-contain rounded-lg"
              />
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl font-extrabold">{school.name}</h1>
            {school.main_field_of_study && (
              <p className="text-sm font-semibold text-primary-foreground/90 mt-0.5">
                {school.main_field_of_study}
              </p>
            )}
            <p className="flex items-center gap-1 text-xs text-primary-foreground/85 mt-1">
              <MapPin className="size-3.5" /> {school.location}
            </p>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-20 -mx-0 flex gap-1 overflow-x-auto border-b border-border bg-card/95 px-3 py-2 backdrop-blur">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => handleTabClick(t)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-bold transition-colors ${
              tab === t ? "bg-indigo text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-5 px-4 py-5">
        {tab === "Overview" && (
          <>
            <section className="flex items-center gap-3 rounded-3xl bg-nuage/30 p-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-card font-display text-lg font-extrabold text-indigo">
                {school.partner.slice(0, 1)}
              </span>
              <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-indigo">
                  Industry partner
                </p>
                <p className="font-display text-base font-extrabold text-foreground">
                  {school.partner}
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-bold text-abricot">
                <Star className="size-3.5 fill-current" /> {school.partnerRating}
              </span>
            </section>

            <section className="grid grid-cols-3 gap-3">
              {[
                { icon: Users, value: school.students, label: "Students" },
                { icon: Calendar, value: school.established, label: "Established" },
                { icon: Briefcase, value: school.hired, label: "Hired grads" },
              ].map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl bg-card p-3 text-center shadow-[var(--shadow-card)]"
                >
                  <Icon className="mx-auto size-4 text-framboise" />
                  <p className="mt-1 font-display text-lg font-extrabold text-foreground">
                    {value}
                  </p>
                  <p className="text-[10px] font-semibold text-muted-foreground">{label}</p>
                </div>
              ))}
            </section>

            <section>
              <h2 className="font-display text-lg font-extrabold text-foreground">
                About the school
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{school.about}</p>
            </section>

            <section className="flex items-center gap-2 rounded-2xl bg-blush/50 p-4">
              <Star className="size-5 shrink-0 fill-current text-abricot" />
              <p className="text-sm font-semibold text-framboise">
                Rated {school.rating} / 5 by current students and graduates
              </p>
            </section>

            {school.gallery && school.gallery.length > 0 && (
              <section>
                <h2 className="font-display text-lg font-extrabold text-foreground mb-3">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {school.gallery.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`${school.name} Gallery ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-xl shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedPhotoIndex(idx)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {tab === "Specializations" && (
          <section className="space-y-3">
            {school.specializations.map((sp) => (
              <div
                key={sp.name}
                className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blush/60 text-xl">
                  {sp.emoji}
                </span>
                <div>
                  <p className="font-display text-base font-extrabold text-foreground">{sp.name}</p>
                  <p className="text-xs text-muted-foreground">{sp.detail}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === "Careers" && (
          <section className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Where graduates of each specialization end up, with typical starting salary ranges.
            </p>
            {school.careers.map((c) => (
              <div key={c.role} className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-base font-extrabold text-foreground">{c.role}</p>
                  <span className="shrink-0 rounded-full bg-nuage/40 px-2.5 py-1 text-xs font-bold text-indigo">
                    {c.salary}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">From {c.from}</p>
              </div>
            ))}
          </section>
        )}

        {tab === "Admission" && (
          <section className="space-y-3">
            {[
              { label: "Minimum grade", value: school.admission.minGrade },
              { label: "Background", value: school.admission.background },
              { label: "Age range", value: school.admission.age },
              { label: "Interview", value: school.admission.interview },
            ].map((r) => (
              <div key={r.label} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                <p className="text-[11px] font-bold uppercase tracking-widest text-framboise">
                  {r.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{r.value}</p>
              </div>
            ))}
            {/* <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-warm)] py-4 font-display text-lg font-extrabold text-accent-foreground shadow-[var(--shadow-float)]">
              Apply Now <ArrowRight className="size-5" />
            </button> */}
          </section>
        )}

        {tab === "Community" && (
          <div className="space-y-5">
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
              {["All", "Admissions", "Specializations", "Careers", "Campus life"].map((t) => (
                <button
                  key={t}
                  onClick={() => setCommunityFilter(t)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    t === communityFilter
                      ? "bg-framboise text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {isPostsLoading ? (
              <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <div className="flex animate-pulse flex-col space-y-3 mt-2">
                  <div className="flex justify-between gap-4">
                    <div className="h-5 w-1/2 rounded-md bg-muted"></div>
                    <div className="h-5 w-1/6 rounded-md bg-muted"></div>
                  </div>
                  <div className="h-3 w-1/3 rounded-md bg-muted"></div>
                  <div className="h-3 w-1/2 rounded-md bg-muted"></div>
                  <div className="h-3 w-full rounded-md bg-muted"></div>
                </div>
              </div>
            ) : (
              posts
                .filter(
                  (p) =>
                    communityFilter === "All" ||
                    p.tag === communityFilter ||
                    (communityFilter === "Campus life" && p.tag === "ATS New Cairo"),
                )
                .map((p) => {
                  const isLiked = hasLiked(p.id);
                  return (
                    <article
                      key={p.id || p.author_id}
                      className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]"
                    >
                      <div className="flex items-center gap-3">
                        <UserProfilePopup profiles={p.profiles}>
                          {p.profiles?.avatar_url ? (
                            <img src={p.profiles.avatar_url} alt={p.profiles.first_name} className="size-10 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="grid size-10 place-items-center rounded-full bg-nuage/60 font-display text-sm font-bold text-indigo shrink-0">
                              {p.profiles?.first_name?.slice(0, 2) || "??"}
                            </div>
                          )}
                        </UserProfilePopup>
                        <div className="flex-1">
                          <UserProfilePopup profiles={p.profiles}>
                            <p className="font-display text-sm font-extrabold text-foreground flex items-center gap-1.5">
                              {p.profiles?.first_name} {p.profiles?.last_name}
                              {school.school_admins?.some(a => a.profiles?.email === p.profiles?.email) && (
                                <span className="text-[9px] bg-indigo text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold">Admin</span>
                              )}
                            </p>
                          </UserProfilePopup>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {p.tag} • {p.time} ago
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/85">{p.body}</p>
                      {p.image_urls && p.image_urls.length > 0 && (
                        <div className="mt-3 -mx-4 px-4 flex gap-2 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                          {p.image_urls.map((url, idx) => (
                            <div key={idx} className="shrink-0 w-[85%] snap-center cursor-pointer" onClick={() => {
                              setFullscreenPostImages(p.image_urls!);
                              setFullscreenImageIndex(idx);
                            }}>
                              <img src={url} alt={`Post image ${idx + 1}`} className="w-full h-72 object-cover rounded-2xl border border-border" />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex gap-5 text-xs font-bold text-muted-foreground">
                        <button
                          onClick={() => {
                            if (isLiked) {
                              unlikePost(p.id);
                              removeLikedPost(p.id);
                            } else {
                              likePost(p.id);
                              addLikedPost(p.id);
                            }
                          }}
                          className={`flex items-center gap-1.5 transition-colors active:scale-95 ${isLiked ? "text-framboise" : "hover:text-framboise text-muted-foreground"}`}
                        >
                          <Heart
                            className={`size-4 ${isLiked ? "fill-current text-framboise" : "text-framboise"}`}
                          />{" "}
                          {p.likes}
                        </button>
                        <button
                          onClick={() => setExpandedPostId(expandedPostId === p.id ? null : p.id)}
                          className="flex items-center gap-1.5 hover:text-indigo transition-colors active:scale-95"
                        >
                          <MessageCircle className="size-4" /> {p.replies} replies
                        </button>
                      </div>
                      {expandedPostId === p.id && <PostReplies postId={p.id} schoolAdmins={school.school_admins} />}
                    </article>
                  );
                })
            )}

            {isAsking ? (
              <div className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-lg font-extrabold text-foreground">
                  Create a post
                </h3>
                <select
                  value={questionTag}
                  onChange={(e) => setQuestionTag(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo"
                >
                  <option>Admissions</option>
                  <option>Specializations</option>
                  <option>Careers</option>
                  <option>Campus life</option>
                </select>
                <textarea
                  value={questionBody}
                  onChange={(e) => setQuestionBody(e.target.value)}
                  placeholder="What's on your mind?"
                  className="mt-3 h-24 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo"
                />
                
                {postImagePreviews.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2 snap-x hide-scrollbar">
                    {postImagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative inline-block shrink-0 snap-center">
                        <img src={preview} alt="Preview" className="h-28 w-28 rounded-lg object-cover" />
                        <button 
                          onClick={() => {
                            setPostImageFiles(prev => prev.filter((_, i) => i !== idx));
                            setPostImagePreviews(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center justify-center p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors text-muted-foreground hover:text-foreground">
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handlePostImageChange} />
                      <ImageIcon className="w-5 h-5" />
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsAsking(false);
                        setPostImageFiles([]);
                        setPostImagePreviews([]);
                      }}
                      className="px-4 py-2 rounded-xl bg-muted text-sm font-bold text-muted-foreground transition-colors hover:bg-muted/80"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitQuestion}
                      disabled={isAddingPost || isUploadingImage || (!questionBody.trim() && postImageFiles.length === 0)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {(isAddingPost || isUploadingImage) ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAsking(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo py-3.5 font-display font-extrabold text-primary-foreground shadow-[var(--shadow-card)]"
              >
                <Plus className="size-5" /> Create a post
              </button>
            )}
          </div>
        )}
      </div>
      <BottomNav />

      {selectedPhotoIndex !== null && school.gallery && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPhotoIndex(null);
            }}
          >
            <X className="size-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              className="absolute left-4 p-3 text-white/70 hover:text-white transition-colors bg-black/70 hover:bg-black/60 rounded-full z-10"
              onClick={handlePrevPhoto}
            >
              <ChevronLeft className="size-8" />
            </button>

            <img
              src={school.gallery[selectedPhotoIndex]}
              alt="Gallery Photo"
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-4 p-3 text-white/70 hover:text-white transition-colors bg-black/40 hover:bg-black/60 rounded-full z-10"
              onClick={handleNextPhoto}
            >
              <ChevronRight className="size-8" />
            </button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-semibold text-sm bg-black/40 px-3 py-1.5 rounded-full">
            {selectedPhotoIndex + 1} / {school.gallery.length}
          </div>
        </div>
      )}

      {fullscreenPostImages !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setFullscreenPostImages(null)}
        >
          <button
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenPostImages(null);
            }}
          >
            <X className="size-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button
              className="absolute left-4 p-3 text-white/70 hover:text-white transition-colors bg-black/70 hover:bg-black/60 rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImageIndex((prev) => (prev - 1 + fullscreenPostImages.length) % fullscreenPostImages.length);
              }}
            >
              <ChevronLeft className="size-8" />
            </button>

            <img
              src={fullscreenPostImages[fullscreenImageIndex]}
              alt="Fullscreen Post Image"
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="absolute right-4 p-3 text-white/70 hover:text-white transition-colors bg-black/40 hover:bg-black/60 rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImageIndex((prev) => (prev + 1) % fullscreenPostImages.length);
              }}
            >
              <ChevronRight className="size-8" />
            </button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 font-semibold text-sm bg-black/40 px-3 py-1.5 rounded-full">
            {fullscreenImageIndex + 1} / {fullscreenPostImages.length}
          </div>
        </div>
      )}
    </div>
    
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Edit School Information</DialogTitle>
        </DialogHeader>
        <SchoolForm initialData={school} onSubmit={handleEditSubmit} isLoading={isSubmitting} />
      </DialogContent>
    </Dialog>
    </>
  );
}
