import { createFileRoute } from "@tanstack/react-router";
import { MasarakHome } from "@/components/MasarakHome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MASARAK — Scholarships & Opportunities for Technical Education" },
      {
        name: "description",
        content:
          "The largest scholarship and career opportunity platform for technical and vocational education students in the MENA region.",
      },
      { property: "og:title", content: "MASARAK — Your Tech Journey Starts Here" },
      {
        property: "og:description",
        content:
          "Discover scholarships and practical internships abroad specifically designed for your certificates and practical experience.",
      },
    ],
  }),
  component: MasarakHome,
});
