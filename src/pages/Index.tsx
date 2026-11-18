import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HeroCarousel } from "@/components/HeroCarousel";
import { About } from "@/components/About";
import { Social } from "@/components/Social";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Zap, 
  Shield, 
  Trophy, 
  ExternalLink, 
  Globe, 
  ArrowRight, 
  Sparkles,
  Calculator,
  MessageSquareQuote,
  Star,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Clock,
  Send,
  IndianRupee,
  FileText
} from "lucide-react";
import { PORTFOLIO_PROJECTS } from "@/data/portfolioData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  // Live Cost Estimator State
  const [projectType, setProjectType] = useState<"corporate" | "ecommerce" | "saas" | "booking">("corporate");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["razorpay", "auth"]);
  const [deliverySpeed, setDeliverySpeed] = useState<"standard" | "express">("standard");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Estimator Calculations
  const BASE_PRICES = {
    corporate: 25000,
    ecommerce: 40000,
    saas: 55000,
    booking: 35000
  };

  const ADDONS = [
    { id: "razorpay", name: "Razorpay / UPI Payment Gateway", price: 6000 },
    { id: "auth", name: "User Auth & Client Dashboard", price: 8000 },
    { id: "whatsapp", name: "Automated WhatsApp Lead Bot", price: 4500 },
    { id: "admin", name: "Full Super-Admin Control Panel", price: 10000 },
    { id: "seo", name: "SEO Optimization & Performance 95+", price: 5000 }
  ];

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const calculatedBase = BASE_PRICES[projectType];
  const calculatedAddons = selectedAddons.reduce((sum, id) => {
    const addon = ADDONS.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);
  const speedMultiplier = deliverySpeed === "express" ? 1.2 : 1.0;
  const estimatedTotal = Math.round((calculatedBase + calculatedAddons) * speedMultiplier);
  const estimatedDeposit = Math.round(estimatedTotal * 0.5);

  const FAQS = [
    {
      q: "How long does a typical custom web development project take?",
      a: "Standard bespoke web projects take between 7 to 14 days from initial scoping to staging demo. Express 7-day delivery is also available for time-sensitive launches."
    },
    {
      q: "How does the 50% advance commitment deposit work?",
      a: "Upon approving the structured proposal and milestones, you pay a 50% advance deposit via our integrated Razorpay payment gateway to authorize sprint initiation. The remaining 50% balance is payable only after staging sign-off."
    },
    {
      q: "Do I get full ownership of the source code and database?",
      a: "Yes, 100%. Upon project completion, full repository ownership (GitHub), database credentials, and cloud deployment keys are transferred to you with zero vendor lock-in."
    },
    {
      q: "What post-launch support and warranty is included?",
      a: "Every project comes standard with 30 days of hypercare warranty covering bug fixes, performance monitoring, and SSL/DNS maintenance at no additional charge."
    },
    {
      q: "Can you build integrations like Razorpay, WhatsApp, or Google Sheets?",
      a: "Yes. All our production platforms feature integrated payment gateways (Razorpay/Stripe), automated WhatsApp notifications, and live PostgreSQL/Firebase databases."
    }
  ];

  const CLIENT_REVIEWS = [
    {
      client: "Director, NI Groups International",
      role: "Corporate Conglomerate",
      site: "nigroups.com",
      quote: "K Freelancing engineered our multi-vertical corporate hub with flawless 99/100 performance and edge routing. Truly world-class full-stack software delivery.",
      rating: 5.0
    },
    {
      client: "Founder, Eve Snaps Luxury Events",
      role: "Candid Photography & Decor",
      site: "evesnapsevents.com",
      quote: "Our visual portfolio loads 4K galleries in half a second, and our client WhatsApp lead inquiries increased by over 300%. The best web investment we made.",
      rating: 5.0
    },
    {
      client: "Dean, Women's Art Institute",
      role: "Fine Arts Academy",
      site: "womensartinstitute.com",
      quote: "The automated student admissions workflow and integrated Razorpay tuition checkout saved our administrative staff over 15 hours each week.",
      rating: 5.0
    }
  ];

  return (
    <div className="relative min-h-screen bg-white text-zinc-900 selection:bg-red-600 selection:text-white">
      <Navigation />
      
      <main>
        {/* 1. Hero Introduction */}
        <Hero />

        {/* 2. Interactive Image Carousel of Flagship Client Works */}
        <HeroCarousel />

        {/* 3. Upgraded Interactive 4-Tab About Section */}
        <About />

        {/* 4. Curated 6-Card Featured Client Production Projects */}
        <section className="py-20 md:py-28 bg-black text-white border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Client Production Deployments
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
                  Featured <span className="text-red-600">Client Works</span>
                </h2>
                <p className="text-zinc-400 font-medium text-base mt-2 max-w-xl">
                  Explore real-world production websites built for corporate leaders, academies, and luxury service brands.
                </p>
              </div>

              <Link to="/our-works">
                <Button 
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-none uppercase text-xs tracking-wider shadow-lg shadow-red-600/30 h-11 px-6 flex items-center gap-2"
                >
                  <span>Explore All 9 Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* 6 Featured Client Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PORTFOLIO_PROJECTS.slice(0, 6).map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  {/* Window Bar */}
                  <div className="bg-zinc-900/80 px-3 py-2 border-b border-zinc-800 flex items-center justify-between text-xs select-none">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono truncate max-w-[180px]">
                      <Globe className="w-3 h-3 text-red-500" />
                      <span className="truncate">{project.url.replace("https://", "")}</span>
                    </div>
                    <span className="text-[10px] text-green-400 font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </span>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md border border-zinc-800 text-[10px] font-bold text-white uppercase">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-[11px] font-bold text-red-500 uppercase">{project.client}</p>
                      <h3 className="text-lg font-black text-white group-hover:text-red-500 transition-colors mt-0.5 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 flex items-center gap-2">
                      <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button 
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-none h-8 flex items-center justify-center gap-1.5"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Visit Live Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>

                      <Link to="/our-works">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-zinc-800 text-zinc-300 hover:text-white text-xs rounded-none h-8 px-2.5"
                        >
                          Case Study
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/our-works">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-900 rounded-none text-xs font-bold uppercase tracking-wider px-8"
                >
                  View All 9 Live Client Websites with Tech Specs & Metrics <ArrowRight className="w-4 h-4 ml-2 text-red-500" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Interactive 4-Step Engineering Sprint Roadmap */}
        <section className="py-20 md:py-28 bg-zinc-950 text-white border-t border-zinc-900 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Clock className="w-3.5 h-3.5" /> Proven Delivery Methodology
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
                How We <span className="text-red-600">Ship Fast & Flawlessly</span>
              </h2>
              <p className="text-zinc-400 text-base mt-2">
                A transparent, step-by-step sprint roadmap that takes your project from concept to live production in 14 days.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Strategic Discovery & Architecture",
                  timeline: "Days 1–3",
                  desc: "Comprehensive requirement scoping, database schema design, and technical feasibility alignment with tailored proposal sign-off.",
                  deliverable: "System architecture blueprint & milestone roadmap"
                },
                {
                  step: "02",
                  title: "High-Fidelity UI/UX & Prototyping",
                  timeline: "Days 4–6",
                  desc: "Pixel-perfect responsive design tailored to your brand identity, mobile layouts, and interactive design system components.",
                  deliverable: "Interactive design mockups with verified user journeys"
                },
                {
                  step: "03",
                  title: "Full-Stack Agile Engineering",
                  timeline: "Days 7–11",
                  desc: "Clean component development (React/Next.js), Spring Boot or Node.js backend endpoints, Razorpay/UPI gateway, and cloud database setup.",
                  deliverable: "Functional staging environment with real-time test data"
                },
                {
                  step: "04",
                  title: "QA, Security & Production Launch",
                  timeline: "Days 12–14",
                  desc: "Rigorous cross-device testing, 95+ Lighthouse speed optimization, custom domain SSL linkage, and 30-day warranty activation.",
                  deliverable: "Live production URL, repository IP transfer & warranty"
                },
              ].map((phase, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="p-6 bg-black border border-zinc-800 hover:border-red-600 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-red-600 font-mono group-hover:scale-110 transition-transform">
                        {phase.step}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 border border-zinc-800">
                        {phase.timeline}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-snug">
                      {phase.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {phase.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-900">
                    <p className="text-[10px] uppercase font-bold text-red-500 font-mono">Deliverable:</p>
                    <p className="text-[11px] text-zinc-300 font-medium mt-0.5">{phase.deliverable}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Interactive Live Project Cost & Deposit Estimator */}
        <section className="py-20 md:py-28 bg-black text-white border-t border-zinc-900 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Calculator className="w-3.5 h-3.5" /> Instant Investment Calculator
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
                Estimate Your <span className="text-red-600">Project Budget</span>
              </h2>
              <p className="text-zinc-400 text-base mt-2">
                Configure your required scope and see an immediate estimate of total investment and 50% advance deposit.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Estimator Configuration (7 Cols) */}
              <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-6">
                {/* 1. Project Type Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    1. Select Project Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "corporate", label: "Corporate Enterprise", price: "₹25,000" },
                      { id: "booking", label: "Service & Booking Engine", price: "₹35,000" },
                      { id: "ecommerce", label: "E-Commerce Storefront", price: "₹40,000" },
                      { id: "saas", label: "Full SaaS MVP Platform", price: "₹55,000" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setProjectType(type.id as any)}
                        className={`p-3 text-left border transition-all text-xs ${
                          projectType === type.id
                            ? "bg-red-600/10 border-red-500 text-white shadow-md shadow-red-600/20"
                            : "bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <p className="font-bold text-white">{type.label}</p>
                        <p className="text-[10px] text-red-400 font-mono mt-0.5">From {type.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Feature Add-ons Checkboxes */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    2. Select Architecture Add-ons
                  </label>
                  <div className="space-y-2">
                    {ADDONS.map((addon) => {
                      const isSelected = selectedAddons.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`p-2.5 border cursor-pointer transition-all flex items-center justify-between text-xs select-none ${
                            isSelected
                              ? "bg-red-950/30 border-red-500/60 text-white"
                              : "bg-black border-zinc-800/80 text-zinc-400 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                              isSelected ? "bg-red-600 border-red-500 text-white" : "border-zinc-700 bg-zinc-900"
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span className="font-medium text-white">{addon.name}</span>
                          </div>
                          <span className="text-red-400 font-mono font-bold shrink-0">
                            +₹{addon.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Delivery Speed Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    3. Delivery Speed Timeline
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliverySpeed("standard")}
                      className={`p-2.5 border text-xs font-bold transition-all text-center ${
                        deliverySpeed === "standard"
                          ? "bg-red-600 border-red-500 text-white"
                          : "bg-black border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      Standard (14 Days)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliverySpeed("express")}
                      className={`p-2.5 border text-xs font-bold transition-all text-center ${
                        deliverySpeed === "express"
                          ? "bg-red-600 border-red-500 text-white"
                          : "bg-black border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      ⚡ Express Rush (7 Days)
                    </button>
                  </div>
                </div>
              </div>

              {/* Instant Estimate Breakdown (5 Cols) */}
              <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-6 sticky top-24">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-zinc-900 px-2 py-0.5 border border-zinc-800">
                    Commercial Summary
                  </span>
                  <h3 className="text-xl font-black text-white mt-2">
                    Estimated Project Investment
                  </h3>
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-800 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Base Architecture:</span>
                    <span className="font-mono text-white">₹{calculatedBase.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Selected Add-ons ({selectedAddons.length}):</span>
                    <span className="font-mono text-white">+₹{calculatedAddons.toLocaleString("en-IN")}</span>
                  </div>
                  {deliverySpeed === "express" && (
                    <div className="flex items-center justify-between text-amber-400">
                      <span>Express 7-Day Rush (20%):</span>
                      <span className="font-mono">+₹{Math.round((calculatedBase + calculatedAddons) * 0.2).toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="p-4 bg-black border border-zinc-800 space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-zinc-400">Total Investment</span>
                      <span className="text-2xl font-black text-white font-mono">
                        ₹{estimatedTotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                      <span className="text-xs text-green-400 font-bold">50% Advance Commitment:</span>
                      <span className="text-lg font-black text-green-400 font-mono">
                        ₹{estimatedDeposit.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link to="/booking">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-none uppercase text-xs tracking-wider h-11 shadow-lg shadow-red-600/30 flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Lock in This Scope / Book Now</span>
                    </Button>
                  </Link>

                  <p className="text-[10px] text-zinc-500 text-center font-mono">
                    Instant Razorpay checkout with official GST tax invoice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Verified Client Reviews & Testimonials */}
        <section className="py-20 md:py-28 bg-zinc-950 text-white border-t border-zinc-900 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
                <MessageSquareQuote className="w-3.5 h-3.5" /> Client Trust & Verified Feedback
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
                What Our <span className="text-red-600">Clients Say</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CLIENT_REVIEWS.map((rev, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-black border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed italic">
                      "{rev.quote}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{rev.client}</p>
                      <p className="text-[10px] text-zinc-500">{rev.role}</p>
                    </div>
                    <span className="text-[10px] text-red-400 font-mono bg-zinc-900 px-2 py-0.5 border border-zinc-800">
                      {rev.site}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Frequently Asked Questions (FAQ) Accordion */}
        <section className="py-20 md:py-28 bg-black text-white border-t border-zinc-900 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                Frequently Asked <span className="text-red-600">Questions</span>
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                Everything you need to know about working with K Freelancing on your next digital platform.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className="border border-zinc-800 bg-zinc-950/60 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 select-none hover:bg-zinc-900/40 transition-colors"
                    >
                      <span className="font-bold text-white text-sm sm:text-base">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-red-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9. Social & Footer */}
        <Social />
      </main>

      <footer className="py-8 text-center text-zinc-400 bg-black border-t border-zinc-800 px-4">
        <p className="text-sm font-medium">
          © 2024 K Freelancing. High-Performance Digital Solutions & Full-Stack Web Development.
        </p>
      </footer>
    </div>
  );
}
