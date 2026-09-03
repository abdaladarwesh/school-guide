import { Building2, University, Wrench, Languages, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const categories = [
  {
    title: "ATS Scholarships",
    description: "Tailored for 3rd-year secondary technical students and graduates of Applied Technology Schools.",
    icon: <Building2 className="h-6 w-6" />,
    color: "bg-blue-50 text-blue-600",
    link: "/"
  },
  {
    title: "Technical University Scholarships",
    description: "Bachelor's and diploma transfer opportunities abroad for higher technical institutes.",
    icon: <University className="h-6 w-6" />,
    color: "bg-indigo-50 text-indigo-600",
    link: "/"
  },
  {
    title: "Vocational Internships",
    description: "Hands-on global training programs requiring practical experience over theoretical testing.",
    icon: <Wrench className="h-6 w-6" />,
    color: "bg-amber-50 text-amber-600",
    link: "/"
  },
  {
    title: "Language & Skill Prep Courses",
    description: "Free prep courses designed to get technical students ready for international applications.",
    icon: <Languages className="h-6 w-6" />,
    color: "bg-emerald-50 text-emerald-600",
    link: "/"
  }
];

export function FeaturedCategories() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Featured Educational & Career Categories
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore opportunities organized specifically around practical technical skill sets and vocational tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={index}
              to={category.link}
              className="group flex flex-col p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center ${category.color}`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-muted-foreground flex-grow mb-6">
                {category.description}
              </p>
              <div className="mt-auto flex items-center text-sm font-semibold text-primary">
                Explore Programs
                <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
