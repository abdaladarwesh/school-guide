import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold">
                M
              </div>
              <span className="font-display text-2xl font-bold text-white tracking-tight">MASARAK</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The premier platform dedicated to empowering technical and vocational education students in the MENA region. Discover scholarships, internships, and build your future.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Browse by School Type */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Browse by School Type</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">Applied Technology Schools (ATS)</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent transition-colors">Technical Schools (3 & 5 Years)</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent transition-colors">Advanced Technical Institutes</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent transition-colors">Technological Universities</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Application Tools */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Application Tools</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">Technical CV Builder</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent transition-colors">Motivation Letter Guides</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent transition-colors">MASARAK AI Assistant</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent transition-colors">Portfolio Templates</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to get the latest technical scholarships directly in your inbox.
            </p>
            <div className="flex mt-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full rounded-l-lg bg-slate-800 border-none px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <Button className="rounded-l-none rounded-r-lg bg-accent text-accent-foreground hover:bg-accent/90 px-4 h-auto">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MASARAK. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
