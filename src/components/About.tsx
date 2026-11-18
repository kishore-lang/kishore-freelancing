import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { 
  Download, 
  CheckCircle2, 
  Code2, 
  Server, 
  Database, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Award, 
  Globe, 
  Briefcase, 
  Sparkles,
  ArrowRight,
  UserCheck,
  Terminal,
  Cpu
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeTab, setActiveTab] = useState<"story" | "skills" | "principles" | "founder">("story");

  const handleResumeDownload = () => {
    window.open("/kishore_cv%20(3).pdf", "_blank", "noopener,noreferrer");
  };

  const skillCategories = [
    {
      category: "Frontend Engineering",
      icon: Code2,
      skills: [
        { name: "React.js & Next.js", level: 95 },
        { name: "TypeScript & Modern ES6+", level: 90 },
        { name: "Tailwind CSS & Responsive UI", level: 95 },
        { name: "Framer Motion & Micro-Interactions", level: 88 },
        { name: "Three.js & Interactive Canvas", level: 75 },
      ]
    },
    {
      category: "Backend & Cloud Architecture",
      icon: Server,
      skills: [
        { name: "Java & Spring Boot Framework", level: 85 },
        { name: "Node.js & Express REST APIs", level: 92 },
        { name: "Razorpay & Stripe Payment Integration", level: 95 },
        { name: "Firebase Authentication & Cloud Functions", level: 90 },
        { name: "Cloudflare CDN & Edge Routing", level: 85 },
      ]
    },
    {
      category: "Databases & Systems",
      icon: Database,
      skills: [
        { name: "PostgreSQL & Schema Optimization", level: 92 },
        { name: "MySQL Relational Design", level: 90 },
        { name: "MongoDB NoSQL Collections", level: 88 },
        { name: "Firebase Firestore & Realtime DB", level: 92 },
      ]
    }
  ];

  const milestones = [
    { year: "2023", title: "Freelancing Genesis", desc: "Started architecting custom full-stack web platforms and Spring Boot backend microservices." },
    { year: "2024", title: "Agency Expansion", desc: "Delivered scalable production platforms across E-Commerce, Art Academies, and Event Management." },
    { year: "2025", title: "Enterprise Scalability", desc: "Engineered high-performance web systems for NI Groups, Eve Snaps, and PixelRox with sub-second performance." },
    { year: "2026", title: "Full-Stack Agency & Deals Hub", desc: "Automated client proposal generators, Razorpay deposits, and 9+ verified live production deployments." },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 relative overflow-hidden bg-black text-white border-t border-zinc-900">
      {/* Background radial accent */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> High-Performance Engineering Agency
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-tight">
            About <span className="text-red-600">K Freelancing</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg mt-3">
            We bridge the gap between creative visual aesthetics and robust full-stack software architecture to engineer client experiences that convert.
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-10">
            {[
              { label: "Live Client Sites", value: "9+", icon: Globe },
              { label: "Client Satisfaction", value: "5.0 ★", icon: Trophy },
              { label: "Code Ownership", value: "100%", icon: ShieldCheck },
              { label: "Uptime Reliability", value: "99.9%", icon: Zap },
            ].map((stat, idx) => (
              <div key={idx} className="p-4 bg-zinc-950 border border-zinc-800 text-center hover:border-red-600/50 transition-colors">
                <stat.icon className="w-5 h-5 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-black text-white font-mono">{stat.value}</p>
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tab Selection Navigation */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
          {[
            { id: "story", label: "Agency Story & Vision", icon: Briefcase },
            { id: "skills", label: "Skills & Tech Stack", icon: Terminal },
            { id: "principles", label: "Our Core Principles", icon: ShieldCheck },
            { id: "founder", label: "Founder & Leadership", icon: UserCheck },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 text-xs font-bold whitespace-nowrap rounded-none transition-all flex items-center gap-2 border ${
                  isActive
                    ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Content Area */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {/* ================= TAB 1: AGENCY STORY ================= */}
            {activeTab === "story" && (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase">
                    From Code to Business Results
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Building Scalable Web Engines That Drive Direct Revenue
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    K Freelancing was established with a singular mission: to provide high-growth businesses, luxury studios, and corporate enterprises with Silicon Valley-grade digital engineering without agency red tape or bloated overheads.
                  </p>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    We treat every project as a strategic business asset. Whether it is architecting an enterprise conglomerate portal like <span className="text-white font-bold">NI Groups</span>, a 4K visual event production system for <span className="text-white font-bold">Eve Snaps</span>, or an automated fee payment gateway for <span className="text-white font-bold">Women's Art Institute</span>, we ensure sub-second response times, rock-solid security, and intuitive user journeys.
                  </p>

                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Link to="/our-works">
                      <Button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-none h-11 px-6 flex items-center gap-2">
                        <span>Explore Our 9 Client Works</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Link to="/freelancing">
                      <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white rounded-none text-xs font-bold h-11 px-6">
                        Catalog of Services
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 font-mono">
                      Our Agency Journey & Milestones
                    </h4>
                    <div className="space-y-4">
                      {milestones.map((m, idx) => (
                        <div key={idx} className="flex items-start gap-3 relative">
                          <div className="w-7 h-7 rounded-none bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold flex items-center justify-center shrink-0 font-mono">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{m.title}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">({m.year})</span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{m.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ================= TAB 2: SKILLS & TECH STACK ================= */}
            {activeTab === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h3 className="text-2xl font-black text-white">Full-Stack Technical Proficiency</h3>
                  <p className="text-xs text-zinc-400">
                    Modern battle-tested technologies engineered for maintainability, speed, and real-time reliability.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {skillCategories.map((cat, idx) => (
                    <div key={idx} className="p-6 bg-zinc-900/40 border border-zinc-800 space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                        <div className="w-8 h-8 rounded-none bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center">
                          <cat.icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-white text-sm">{cat.category}</h4>
                      </div>

                      <div className="space-y-3">
                        {cat.skills.map((skill, sIdx) => (
                          <div key={sIdx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-zinc-300 font-medium">{skill.name}</span>
                              <span className="text-red-400 font-mono font-bold">{skill.level}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-800 rounded-none overflow-hidden">
                              <motion.div 
                                className="h-full bg-red-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 0.8, delay: sIdx * 0.1 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ================= TAB 3: OUR CORE PRINCIPLES ================= */}
            {activeTab === "principles" && (
              <motion.div
                key="principles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {[
                  {
                    title: "100% Code Ownership & No Vendor Lock-In",
                    desc: "You retain full IP rights, source code repository access, and database ownership. Everything is packaged so your team can self-host or scale without friction.",
                    icon: ShieldCheck,
                    badge: "Security & Freedom"
                  },
                  {
                    title: "Sub-Second Performance & SEO Architecture",
                    desc: "Every website is tuned to hit 95+ Google Lighthouse scores with lazy-loaded media, WebP/AVIF compression, and edge caching via Cloudflare and Firebase.",
                    icon: Zap,
                    badge: "Blazing Speed"
                  },
                  {
                    title: "Transparent Milestones & 50% Advance Model",
                    desc: "Clear milestones with structured deliverables checklist. No surprise charges; 50% commitment deposit through Razorpay and balance paid only upon staging sign-off.",
                    icon: Award,
                    badge: "Zero Risk"
                  },
                  {
                    title: "30-Day Post-Launch Hypercare Warranty",
                    desc: "We stand firmly behind our engineering. Receive 30 days of complimentary bug fixes, performance monitoring, and DNS/SSL configuration support.",
                    icon: CheckCircle2,
                    badge: "Post-Launch Warranty"
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-zinc-900/40 border border-zinc-800 hover:border-red-600/50 transition-colors space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-none bg-red-600/10 border border-red-500/30 text-red-500 flex items-center justify-center">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 bg-black px-2 py-0.5 border border-zinc-800">
                        {item.badge}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ================= TAB 4: FOUNDER & LEADERSHIP ================= */}
            {activeTab === "founder" && (
              <motion.div
                key="founder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
              >
                <div className="md:col-span-4 text-center md:text-left space-y-4">
                  <div className="relative w-44 h-44 mx-auto md:mx-0 border-2 border-red-600 p-1.5 bg-zinc-900 shadow-xl">
                    <img
                      src="/logo.jpg"
                      alt="Kishore - K Freelancing"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-red-600 text-white font-mono text-[10px] font-black uppercase">
                      Lead Architect
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-white">Kishore</h4>
                    <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Founder & Lead Full-Stack Architect</p>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Specialized in Spring Boot, React, and Modern Web Systems</p>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-4">
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    With a background in enterprise Java (Spring Boot) and modern React/TypeScript ecosystems, Kishore heads every technical delivery at K Freelancing. Having designed, deployed, and scaled client portals across education, retail, automotive, and media, he blends clean backend architecture with polished frontend design.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-black border border-zinc-800">
                      <p className="text-xs font-bold text-white">Full-Stack Specialization</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">React, Next.js, Java Spring Boot, PostgreSQL, Razorpay</p>
                    </div>
                    <div className="p-3 bg-black border border-zinc-800">
                      <p className="text-xs font-bold text-white">Proven Track Record</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">9+ live client production deployments with 100% verified uptime</p>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <Button
                      onClick={handleResumeDownload}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-none h-10 px-5 flex items-center gap-2 shadow-lg shadow-red-600/30"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Resume (CV)</span>
                    </Button>

                    <Link to="/booking">
                      <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white rounded-none text-xs font-bold h-10 px-5">
                        Schedule Discovery Call
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
