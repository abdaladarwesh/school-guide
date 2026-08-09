import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Star, Users, Calendar, Briefcase, MapPin, ArrowRight, Heart, MessageCircle, Plus } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useSchoolsStore } from "@/data/useSchoolsStore";
import { useUserStore } from "@/data/useUserStore";
import { useCommunityStore, initialPosts } from "@/data/useCommunityStore";
import type { School } from "@/data/schools";

export const Route = createFileRoute("/school/$schoolId")({
  loader: ({ params }) => {
    const school = useSchoolsStore.getState().schools.find((s) => s.id === params.schoolId);
    if (!school) throw notFound();
    return { school };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "School unavailable — School Guide" }, { name: "robots", content: "noindex" }] };
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



function SchoolPage() {
  const { school } = Route.useLoaderData() as { school: School };
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [isAsking, setIsAsking] = useState(false);
  const [questionBody, setQuestionBody] = useState("");
  const [questionTag, setQuestionTag] = useState("Admissions");
  const [communityFilter, setCommunityFilter] = useState("All");

  const navigate = Route.useNavigate();
  const isSubscribed = useUserStore((s) => s.tier !== 'none');
  
  const { postsBySchool, addPost } = useCommunityStore();
  const posts = postsBySchool[school.id] || initialPosts;

  const handleSubmitQuestion = () => {
    if (!questionBody.trim()) return;
    addPost(school.id, {
      author: "You",
      tag: questionTag,
      body: questionBody.trim(),
    });
    setQuestionBody("");
    setIsAsking(false);
  };

  const handleTabClick = (t: typeof tabs[number]) => {
    if (t === "Community" && !isSubscribed) {
      navigate({ to: "/prime" });
      return;
    }
    setTab(t);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background pb-24">
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
        {school.prime && (
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[image:var(--gradient-warm)] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-accent-foreground">
            <BadgeCheck className="size-3.5" /> Prime partner
          </span>
        )}
        <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
          <h1 className="font-display text-2xl font-extrabold">{school.name}</h1>
          <p className="flex items-center gap-1 text-xs text-primary-foreground/85">
            <MapPin className="size-3.5" /> {school.location}
          </p>
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
                <div key={label} className="rounded-2xl bg-card p-3 text-center shadow-[var(--shadow-card)]">
                  <Icon className="mx-auto size-4 text-framboise" />
                  <p className="mt-1 font-display text-lg font-extrabold text-foreground">{value}</p>
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
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-warm)] py-4 font-display text-lg font-extrabold text-accent-foreground shadow-[var(--shadow-float)]">
              Apply Now <ArrowRight className="size-5" />
            </button>
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

            {posts
              .filter(p => communityFilter === "All" || p.tag === communityFilter || (communityFilter === "Campus life" && p.tag === "ATS New Cairo"))
              .map((p) => (
              <article key={p.id || p.author} className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-nuage/60 font-display text-sm font-bold text-indigo">
                    {p.author.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm font-extrabold text-foreground">{p.author}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {p.tag} • {p.time} ago
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85">{p.body}</p>
                <div className="mt-3 flex gap-5 text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Heart className="size-4 text-framboise" /> {p.likes}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="size-4" /> {p.replies} replies
                  </span>
                </div>
              </article>
            ))}

            {isAsking ? (
              <div className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
                <h3 className="font-display text-lg font-extrabold text-foreground">Ask a question</h3>
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
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => setIsAsking(false)}
                    className="flex-1 rounded-xl bg-muted py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuestion}
                    className="flex-1 rounded-xl bg-indigo py-2.5 text-sm font-bold text-primary-foreground shadow-lg transition-transform active:scale-95"
                  >
                    Post Question
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAsking(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo py-3.5 font-display font-extrabold text-primary-foreground shadow-[var(--shadow-card)]"
              >
                <Plus className="size-5" /> Ask a question
              </button>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}