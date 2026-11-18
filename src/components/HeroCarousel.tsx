import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Play, 
  Pause,
  Star,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export interface CarouselSlide {
  id: string;
  title: string;
  client: string;
  tagline: string;
  category: string;
  url: string;
  image: string;
  highlights: string[];
  metrics: { label: string; value: string };
  badge: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "ni-groups",
    title: "NI Groups Corporate Enterprise Hub",
    client: "NI Groups International",
    tagline: "Enterprise corporate digital portal unifying multi-divisional industrial operations, investor relations, and high-performance talent acquisition.",
    category: "Corporate Enterprise",
    url: "https://www.nigroups.com",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    highlights: ["React & TypeScript Architecture", "Cloudflare Edge Delivery", "Multi-Division Directory"],
    metrics: { label: "Performance Score", value: "99/100" },
    badge: "Featured Enterprise"
  },
  {
    id: "eve-snaps",
    title: "Eve Snaps Luxury Candid Events",
    client: "Eve Snaps Events",
    tagline: "High-end visual showcase and event planning portal with dynamic 4K galleries, package customizer, and automated WhatsApp inquiries.",
    category: "Luxury Events & Weddings",
    url: "https://www.evesnapsevents.com",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    highlights: ["4K Responsive Image Grid", "Instant WhatsApp Lead Engine", "+320% Inquiries"],
    metrics: { label: "Client Inquiries", value: "+320%" },
    badge: "Most Visited"
  },
  {
    id: "event-designerz",
    title: "Event Designerz Theme & Wedding Decor",
    client: "Event Designerz",
    tagline: "Bespoke luxury wedding production platform spotlighting destination mandaps, 3D theme concepts, and an interactive budget calculator.",
    category: "Theme Decor & Destination",
    url: "https://www.eventdesignerz.com",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    highlights: ["3D Theme Lookbook", "Destination Wedding Quoter", "5.0 ★ Google Rating"],
    metrics: { label: "Google Rating", value: "5.0 ★" },
    badge: "Top Rated"
  },
  {
    id: "womens-art",
    title: "Women's Art Institute Academy Portal",
    client: "Women's Art Institute",
    tagline: "Creative fine arts academy platform handling online admissions, certified masterclasses, student artwork showcases, and Razorpay fee checkout.",
    category: "Education & Art",
    url: "https://www.womensartinstitute.com",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Online Student Admissions", "Razorpay Automated Fees", "Digital Gallery Showcase"],
    metrics: { label: "Students Enrolled", value: "500+" },
    badge: "EdTech Innovation"
  },
  {
    id: "pixelrox",
    title: "PixelRox Digital Creative & Media Lab",
    client: "PixelRox Technologies",
    tagline: "Futuristic digital creative agency showroom featuring interactive 60FPS fluid physics, 3D canvas experiences, and dark cyberpunk aesthetics.",
    category: "Digital Agency & Tech",
    url: "https://www.pixelrox.com",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    highlights: ["60 FPS Fluid Canvas", "Dark Futuristic Aesthetic", "Interactive 3D Motion"],
    metrics: { label: "Frame Rate", value: "60 FPS" },
    badge: "Creative Lab"
  },
  {
    id: "happy-petals",
    title: "The Happy Petals Flower Boutique Storefront",
    client: "The Happy Petals Florals",
    tagline: "Artisan floral storefront featuring same-day delivery scheduling, bespoke bouquet customizer, live inventory catalog, and Razorpay UPI checkout.",
    category: "E-Commerce Boutique",
    url: "https://thehappypetalsflower.web.app",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Same-Day Slot Delivery", "Instant UPI / Card Payment", "94% Checkout Rate"],
    metrics: { label: "Checkout Rate", value: "94%" },
    badge: "Instant Checkout"
  },
  {
    id: "classic-rider",
    title: "Classic Rider Superbike & Royal Enfield Rentals",
    client: "Classic Rider Tours",
    tagline: "Premium motorcycle rental and roadtrip booking platform with live fleet availability calendar, security deposit handling, and digital KYC verification.",
    category: "Travel & Rentals",
    url: "https://classic-rider.web.app",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Live Fleet Calendar", "Online License KYC", "Security Deposit Escrow"],
    metrics: { label: "Fleet Utilization", value: "+45%" },
    badge: "Live Fleet Sync"
  }
];

export const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 5500;

  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const currentSlide = CAROUSEL_SLIDES[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <section 
      className="relative bg-black text-white py-12 sm:py-16 md:py-20 overflow-hidden border-b border-zinc-900"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Production Showcase
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
              Featured <span className="text-red-600">Client Deployments</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white text-xs h-8 px-2.5 rounded-none"
              title={isPlaying ? "Pause autoplay" : "Resume autoplay"}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 mr-1 text-red-500" />
                  <span className="text-[10px] font-mono">Autoplay ON</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1 text-green-500" />
                  <span className="text-[10px] font-mono">Paused</span>
                </>
              )}
            </Button>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-red-600 text-white hover:text-red-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Slide"
                className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 hover:border-red-600 text-white hover:text-red-500 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Stage */}
        <div className="relative border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] lg:min-h-[520px]"
            >
              {/* Left Column: Visual Mockup (7 Cols) */}
              <div className="lg:col-span-7 relative flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-zinc-900/40 border-b lg:border-b-0 lg:border-r border-zinc-800">
                {/* Browser bar */}
                <div className="bg-zinc-950 px-4 py-2.5 border border-zinc-800 flex items-center justify-between text-xs mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 rounded-sm">
                    <Globe className="w-3 h-3 text-red-500" />
                    <span>{currentSlide.url.replace("https://", "")}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-green-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>LIVE</span>
                  </div>
                </div>

                {/* Hero Image Container with scale & shine */}
                <div className="relative flex-1 min-h-[260px] sm:min-h-[300px] overflow-hidden border border-zinc-800 bg-black group">
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-red-600 text-white font-black text-[10px] uppercase tracking-wider shadow-lg">
                      {currentSlide.badge}
                    </span>
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md border border-zinc-800 text-zinc-300 font-bold text-[10px] uppercase">
                      {currentSlide.category}
                    </span>
                  </div>

                  {/* Quick Metric Badge in Image */}
                  <div className="absolute bottom-3 right-3 p-2.5 bg-black/90 backdrop-blur-md border border-zinc-800 text-right">
                    <p className="text-lg font-black text-green-400 font-mono leading-none">
                      {currentSlide.metrics.value}
                    </p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mt-1">
                      {currentSlide.metrics.label}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Slide Story & Actions (5 Cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black uppercase text-red-500 tracking-wider font-mono">
                      Client Spotlight #{currentIndex + 1}
                    </p>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {currentSlide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {currentSlide.tagline}
                  </p>

                  {/* Highlights checklist */}
                  <div className="space-y-2 pt-2 border-t border-zinc-900">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                      Architecture & Delivery Highlights:
                    </p>
                    {currentSlide.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="space-y-3 pt-6 border-t border-zinc-900">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={currentSlide.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1"
                    >
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-none text-xs uppercase tracking-wider h-11 flex items-center justify-center gap-2 shadow-lg shadow-red-600/30">
                        <Globe className="w-4 h-4" />
                        <span>Launch Live Website</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </a>

                    <Link to="/our-works" className="w-full sm:w-auto">
                      <Button 
                        variant="outline"
                        className="w-full border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-none text-xs font-bold h-11 px-5"
                      >
                        All 9 Case Studies
                      </Button>
                    </Link>
                  </div>

                  <p className="text-[10px] text-zinc-500 text-center font-mono">
                    Verified live production build with active DNS & SSL.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Progress / Thumbnails Footer Bar */}
          <div className="bg-zinc-900/80 px-4 py-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              {CAROUSEL_SLIDES.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`px-3 py-1 text-[11px] font-bold transition-all rounded-none flex items-center gap-1.5 ${
                      isActive
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                        : "bg-black/60 text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    <span>{idx + 1}.</span>
                    <span className="truncate max-w-[120px]">{slide.client.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
              <span>{currentIndex + 1} / {CAROUSEL_SLIDES.length}</span>
              <span className="text-zinc-600">•</span>
              <Link to="/our-works" className="text-red-500 hover:underline flex items-center gap-1">
                <span>View Full Showcase</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
