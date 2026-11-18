import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { PORTFOLIO_PROJECTS, ProjectItem } from "@/data/portfolioData";
import { 
  ExternalLink, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  Star, 
  Layers, 
  TrendingUp, 
  Eye, 
  X,
  MessageCircle,
  FileText,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "All",
  "Corporate & Enterprise",
  "Events & Weddings",
  "E-Commerce & Retail",
  "Education & Art",
  "Travel & Rentals",
  "Fashion & Beauty"
] as const;

export default function OurWorks() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const filteredProjects = PORTFOLIO_PROJECTS.filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch = 
      project.title.toLowerCase().includes(q) ||
      project.client.toLowerCase().includes(q) ||
      project.tagline.toLowerCase().includes(q) ||
      project.description.toLowerCase().includes(q) ||
      project.techStack.some(t => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-red-600 selection:text-white">
      <Navigation />

      <main className="pt-24 sm:pt-28 pb-20">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-black to-black py-16 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-600/10 via-transparent to-transparent pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Verified Client Production Portfolio
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-tight"
            >
              Real Projects. <span className="text-red-600">Real Impact.</span>
              <br />
              <span className="text-zinc-400 text-2xl sm:text-4xl lg:text-5xl font-extrabold normal-case">
                Live Platforms Engineered for Growth
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-sm sm:text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              Browse our portfolio of live client websites, enterprise platforms, luxury event portfolios, and boutique e-commerce engines. Every site is in production with 100% verified uptime.
            </motion.p>

            {/* Quick Metrics Ribbon */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-zinc-900 max-w-3xl mx-auto"
            >
              {[
                { label: "Production Websites", value: "9+ Live" },
                { label: "Average Performance", value: "99/100" },
                { label: "Client Satisfaction", value: "5.0 ★" },
                { label: "Platform Uptime", value: "99.9%" }
              ].map((stat, idx) => (
                <div key={idx} className="p-3 bg-zinc-950/60 border border-zinc-900">
                  <p className="text-xl sm:text-2xl font-black text-white font-mono">{stat.value}</p>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= FILTER & SEARCH BAR ================= */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const count = cat === "All" 
                  ? PORTFOLIO_PROJECTS.length 
                  : PORTFOLIO_PROJECTS.filter(p => p.category === cat).length;
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all rounded-none flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                        : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-900 hover:border-zinc-800"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? "bg-red-800 text-white" : "bg-zinc-900 text-zinc-500"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] sm:min-w-[300px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search projects or tech (e.g. React, Events)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-950 border-zinc-800 pl-9 text-xs rounded-none h-9 text-white placeholder:text-zinc-600 focus:border-red-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-zinc-500 font-mono">
            <span>Showing {filteredProjects.length} of {PORTFOLIO_PROJECTS.length} client projects</span>
            {selectedCategory !== "All" && (
              <button 
                onClick={() => setSelectedCategory("All")}
                className="text-red-500 hover:underline flex items-center gap-1"
              >
                Clear filter
              </button>
            )}
          </div>
        </section>

        {/* ================= PROJECTS GRID ================= */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group flex flex-col bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Browser Window Bar Mockup */}
                  <div className="bg-zinc-900/90 px-3 py-2 border-b border-zinc-800/80 flex items-center justify-between text-xs select-none">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono bg-black/60 px-2 py-0.5 rounded-sm max-w-[200px] truncate border border-zinc-800">
                      <Globe className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="truncate">{project.url.replace("https://", "")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-green-400 font-mono font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </div>
                  </div>

                  {/* Thumbnail / Image with overlay */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-900">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                      loading="lazy"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-black/80 backdrop-blur-md border border-zinc-800 text-[10px] font-bold text-white uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-md border border-zinc-800 text-[11px] font-bold text-amber-400 font-mono">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{project.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider">
                        {project.client}
                      </p>
                      <h3 className="text-lg font-black text-white group-hover:text-red-500 transition-colors mt-0.5 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Performance Metrics Pills */}
                    <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-zinc-900">
                      {project.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="p-1.5 bg-black/60 border border-zinc-900 text-center">
                          <p className="text-xs font-black text-green-400 font-mono truncate">{m.value}</p>
                          <p className="text-[9px] text-zinc-500 uppercase truncate mt-0.5">{m.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.techStack.slice(0, 4).map((tech, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="px-2 py-0.5 bg-zinc-900 border border-zinc-800/80 text-[10px] font-mono text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-zinc-500 font-mono">
                          +{project.techStack.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-zinc-900 flex items-center gap-2">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button 
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-none shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 h-9"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Visit Live Site</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                        </Button>
                      </a>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveProject(project)}
                        className="border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 text-xs rounded-none h-9 px-3 shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                        Case Study
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <Layers className="w-12 h-12 text-zinc-700 mx-auto" />
              <h3 className="text-xl font-bold text-white">No projects found</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                No matching client websites found for "{searchQuery}". Try searching for another keyword or select "All".
              </p>
              <Button
                variant="outline"
                onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                className="border-zinc-800 text-white rounded-none"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </section>

        {/* ================= HIGH-IMPACT CLIENT CTA ================= */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24">
          <div className="border border-red-600/30 bg-gradient-to-r from-zinc-950 via-red-950/20 to-zinc-950 p-8 sm:p-12 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> High-Performance Engineering
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Want to launch a scalable web platform like these for your business?
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We design and engineer bespoke web systems, e-commerce storefronts, and automated client portals with embedded payments and 100% responsive performance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link to="/freelancing" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold rounded-none uppercase tracking-wider text-xs shadow-lg shadow-red-600/30 h-11 px-6"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View All Services
                </Button>
              </Link>

              <Link to="/booking" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-zinc-700 text-white hover:bg-zinc-900 rounded-none text-xs font-bold h-11 px-6"
                >
                  <FileText className="w-4 h-4 mr-2 text-red-500" />
                  Book Project Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ================= CASE STUDY DETAIL MODAL ================= */}
      <Dialog open={!!activeProject} onOpenChange={(open) => !open && setActiveProject(null)}>
        {activeProject && (
          <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-3xl p-0 overflow-hidden rounded-none max-h-[90vh] flex flex-col">
            {/* Modal Header Image */}
            <div className="relative h-48 sm:h-60 w-full bg-zinc-900 shrink-0">
              <img 
                src={activeProject.image} 
                alt={activeProject.title}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-red-600 text-[10px] font-black uppercase text-white tracking-wider">
                    {activeProject.category}
                  </span>
                  <span className="text-zinc-400 text-xs font-mono">
                    Client: {activeProject.client}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {activeProject.title}
                </h2>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto pr-4">
              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1.5">
                  Project Overview
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {activeProject.description}
                </p>
              </div>

              {/* Challenge & Solution Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                  <h5 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> The Client Challenge
                  </h5>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {activeProject.challenge}
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-1.5">
                  <h5 className="text-xs font-black uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> The Engineering Solution
                  </h5>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {activeProject.solution}
                  </p>
                </div>
              </div>

              {/* Key Deliverables */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2.5">
                  Engineered Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeProject.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 p-2 bg-black border border-zinc-900 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2.5">
                  Performance & Business Results
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {activeProject.metrics.map((stat, sIdx) => (
                    <div key={sIdx} className="p-3 bg-black border border-zinc-900 text-center">
                      <p className="text-base sm:text-lg font-black text-green-400 font-mono">{stat.value}</p>
                      <p className="text-[10px] text-zinc-500 uppercase mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeProject.techStack.map((tech, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-3 shrink-0">
              <a
                href={activeProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-none text-xs h-10 flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Open Live Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={() => setActiveProject(null)}
                className="border-zinc-700 text-zinc-300 hover:text-white rounded-none text-xs h-10 px-4"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 text-center text-zinc-500 bg-black border-t border-zinc-900 px-4">
        <p className="text-xs">
          © 2024 K Freelancing. All client project links are verified live deployments.
        </p>
      </footer>
    </div>
  );
}
