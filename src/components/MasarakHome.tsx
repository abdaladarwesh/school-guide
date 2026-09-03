import { Header } from "./masarak/Header";
import { Hero } from "./masarak/Hero";
import { StatsCounter } from "./masarak/StatsCounter";
import { FeaturedCategories } from "./masarak/FeaturedCategories";
import { OpportunitiesFeed } from "./masarak/OpportunitiesFeed";
import { AIBanner } from "./masarak/AIBanner";
import { Testimonials } from "./masarak/Testimonials";
import { Footer } from "./masarak/Footer";

export function MasarakHome() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <Header />
      <main className="flex-1">
        <Hero />
        <StatsCounter />
        <FeaturedCategories />
        <OpportunitiesFeed />
        <AIBanner />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
