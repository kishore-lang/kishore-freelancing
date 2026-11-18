export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  tagline: string;
  url: string;
  category: "Corporate & Enterprise" | "Events & Weddings" | "E-Commerce & Retail" | "Education & Art" | "Travel & Rentals" | "Fashion & Beauty";
  image: string;
  description: string;
  challenge: string;
  solution: string;
  metrics: {
    label: string;
    value: string;
  }[];
  techStack: string[];
  deliverables: string[];
  rating: number;
  featured: boolean;
  accentColor: string;
}

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: "ni-groups",
    title: "NI Groups Corporate Enterprise Hub",
    client: "NI Groups International",
    tagline: "Diversified Business Operations & Enterprise Portal",
    url: "https://www.nigroups.com",
    category: "Corporate & Enterprise",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    description: "Enterprise digital portal designed for a multi-division conglomerate, uniting industrial operations, corporate governance, investor relations, and high-performance talent acquisition under a unified scalable design system.",
    challenge: "NI Groups required a unified corporate platform to present their diverse business verticals with enterprise-grade security, lightning-fast global load times, and structured corporate inquiry workflows.",
    solution: "Engineered a high-performance modern web architecture featuring automated division showcases, dynamic career application routing, and Cloudflare edge caching for sub-second global delivery.",
    metrics: [
      { label: "Performance Score", value: "99/100" },
      { label: "First Contentful Paint", value: "0.4s" },
      { label: "Global Availability", value: "99.9%" }
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Cloudflare CDN", "SEO Schema"],
    deliverables: [
      "Multi-Vertical Architecture",
      "Investor & Career Inquiry Engine",
      "Executive Team & Governance Showcase",
      "Automated Corporate Contact Pipelines"
    ],
    rating: 5.0,
    featured: true,
    accentColor: "from-blue-600 to-indigo-600"
  },
  {
    id: "eve-snaps-events",
    title: "Eve Snaps Luxury Candid Photography & Events",
    client: "Eve Snaps Events",
    tagline: "High-End Event Production & Candid Wedding Photography",
    url: "https://www.evesnapsevents.com",
    category: "Events & Weddings",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    description: "Visually captivating event management and candid photography showcase equipped with 4K high-resolution responsive galleries, dynamic wedding package pricing, and automated WhatsApp lead generation.",
    challenge: "The studio needed a portfolio that loads heavy 4K photography effortlessly on mobile connections without compromising visual clarity or lagging.",
    solution: "Implemented Cloudinary progressive image optimization, responsive picture tags with lazy loading, and an interactive WhatsApp quote scheduler that increased lead inquiries by over 300%.",
    metrics: [
      { label: "Lead Inquiries", value: "+320%" },
      { label: "Image Load Speed", value: "< 0.5s" },
      { label: "Mobile Engagement", value: "88%" }
    ],
    techStack: ["Next.js", "Framer Motion", "Cloudinary CDN", "Tailwind CSS", "WhatsApp Business API"],
    deliverables: [
      "Ultra-Fast 4K Masonry Gallery",
      "Wedding Package Pricing Calculator",
      "Instant WhatsApp Inquiry Engine",
      "Client Testimonials & Video Stories"
    ],
    rating: 5.0,
    featured: true,
    accentColor: "from-amber-500 to-red-600"
  },
  {
    id: "event-designerz",
    title: "Event Designerz Luxury Theme & Wedding Decor",
    client: "Event Designerz",
    tagline: "Bespoke Event Production, Theme Decor & Destination Weddings",
    url: "https://www.eventdesignerz.com",
    category: "Events & Weddings",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    description: "Sophisticated luxury event production platform spotlighting destination weddings, grand entrance installations, 3D theme concepts, and an interactive decor estimate calculator.",
    challenge: "High-net-worth clients wanted to visualize custom themes and request tailored quotes for multi-day destination weddings effortlessly.",
    solution: "Crafted a luxury editorial aesthetics website with interactive theme lookbooks, date availability calendar inquiries, and instant quote estimations.",
    metrics: [
      { label: "Client Satisfaction", value: "100%" },
      { label: "Google Rating", value: "5.0 ★" },
      { label: "Avg Consultation Time", value: "-45%" }
    ],
    techStack: ["React", "Tailwind CSS", "Framer Motion", "Node.js", "PostgreSQL", "Lucide Icons"],
    deliverables: [
      "Bespoke Theme Lookbook",
      "Interactive Wedding Decor Estimator",
      "Destination Wedding Consultation Scheduler",
      "High-Resolution Photo Walkthroughs"
    ],
    rating: 5.0,
    featured: true,
    accentColor: "from-rose-500 to-purple-600"
  },
  {
    id: "womens-art-institute",
    title: "Women's Art Institute Academy Portal",
    client: "Women's Art Institute",
    tagline: "Empowering Creative Fine Arts, Masterclasses & Admissions",
    url: "https://www.womensartinstitute.com",
    category: "Education & Art",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    description: "Educational academy platform facilitating online admissions, certified masterclass enrollments, student art exhibition showcases, and automated tuition payment processing.",
    challenge: "The institute was handling admissions and workshop fees manually through bank transfers and spreadsheets, causing student onboarding delays.",
    solution: "Architected a streamlined online admissions and student onboarding workflow powered by Firebase authentication and automated Razorpay fee checkout.",
    metrics: [
      { label: "Students Enrolled", value: "500+" },
      { label: "Payment Automation", value: "100%" },
      { label: "Admin Time Saved", value: "15 hrs/wk" }
    ],
    techStack: ["React", "Firebase Auth", "Firestore", "Razorpay Gateway", "Tailwind CSS", "PDF Invoicing"],
    deliverables: [
      "Student Enrollment & Registration System",
      "Masterclass Curriculum Downloads",
      "Razorpay Tuition & Workshop Checkout",
      "Digital Student Art Showcase Gallery"
    ],
    rating: 5.0,
    featured: true,
    accentColor: "from-pink-500 to-rose-600"
  },
  {
    id: "the-happy-petals",
    title: "The Happy Petals Flower Boutique Storefront",
    client: "The Happy Petals Florals",
    tagline: "Artisan Floral Arrangements, Exotic Bouquets & Same-Day Gifting",
    url: "https://thehappypetalsflower.web.app",
    category: "E-Commerce & Retail",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80",
    description: "Boutique floral storefront featuring real-time bouquet personalization, same-day delivery slot booking, fresh flower catalog sync, and friction-free UPI/Razorpay checkout.",
    challenge: "Floral products require same-day freshness handling, precise delivery slot management, and fast mobile checkout without cart abandonment.",
    solution: "Built a rapid single-page e-commerce flow with delivery pincode validation, custom gift message attachments, and 1-tap UPI instant payments.",
    metrics: [
      { label: "Checkout Completion", value: "94%" },
      { label: "Same-Day Delivery Accuracy", value: "99.8%" },
      { label: "Page Load Speed", value: "0.3s" }
    ],
    techStack: ["React", "Firebase Hosting", "Firebase Firestore", "Razorpay UPI", "Tailwind CSS"],
    deliverables: [
      "Artisan Bouquet Customizer",
      "Pincode & Delivery Time Slot Scheduler",
      "Integrated UPI & Card Payment Gateway",
      "Automated Order Confirmation via WhatsApp"
    ],
    rating: 5.0,
    featured: true,
    accentColor: "from-emerald-500 to-teal-600"
  },
  {
    id: "classic-rider",
    title: "Classic Rider Superbike & Royal Enfield Rentals",
    client: "Classic Rider Tours & Rentals",
    tagline: "Premium Motorcycle Fleet Rentals, Guided Roadtrips & KYC Verification",
    url: "https://classic-rider.web.app",
    category: "Travel & Rentals",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
    description: "Premium motorcycle rental and roadtrip booking platform equipped with real-time fleet availability calendars, security deposit calculation, and digital driving license KYC verification.",
    challenge: "Handling rental security deposits, vehicle schedules, and customer KYC manually led to double-bookings and booking delays.",
    solution: "Designed an automated fleet reservation portal with live calendar blocking, security deposit escrow workflows, and instant confirmation SMS.",
    metrics: [
      { label: "Fleet Utilization", value: "+45%" },
      { label: "Booking Time", value: "< 2 mins" },
      { label: "Uptime", value: "100%" }
    ],
    techStack: ["React", "Vite", "Firebase", "Tailwind CSS", "Razorpay Checkout", "Lucide Icons"],
    deliverables: [
      "Real-Time Motorcycle Fleet Availability",
      "Trip Duration & Security Deposit Calculator",
      "Online KYC License Upload & Verification",
      "Automated Trip Confirmation Slips"
    ],
    rating: 5.0,
    featured: false,
    accentColor: "from-amber-600 to-orange-600"
  },
  {
    id: "fun-teddy-events",
    title: "Fun Teddy Kids Party Entertainment & Mascots",
    client: "Fun Teddy Events",
    tagline: "Magical Kids Parties, Cartoon Mascots & Joyful Celebrations",
    url: "https://funteddyevents.web.app",
    category: "Events & Weddings",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
    description: "Vibrant, playful family entertainment website highlighting character mascot rental packages, magic shows, party games coordination, and instant party booking estimates.",
    challenge: "Parents needed an easy, visually engaging way to choose mascot packages and get quick quotes for birthday parties.",
    solution: "Engineered an upbeat, animated web experience with character mascot previews, transparent package comparisons, and direct WhatsApp booking.",
    metrics: [
      { label: "Parties Hosted", value: "250+" },
      { label: "Parent Inquiries", value: "+180%" },
      { label: "Customer Happiness", value: "5/5 ★" }
    ],
    techStack: ["React", "Framer Motion", "Firebase", "Tailwind CSS", "Lucide Icons"],
    deliverables: [
      "Animated Mascot Character Catalog",
      "Party Package Comparison & Add-ons",
      "1-Click WhatsApp Booking Dispatch",
      "Joyful Photo & Video Highlight Reels"
    ],
    rating: 5.0,
    featured: false,
    accentColor: "from-yellow-500 to-red-500"
  },
  {
    id: "sai-keerthana-bridal",
    title: "Sai Keerthana Luxury Bridal Studio & Makeover",
    client: "Sai Keerthana Bridal",
    tagline: "Bespoke Bridal Makeovers, HD Airbrush Styling & Draping",
    url: "https://saikeerthanabridal.web.app",
    category: "Fashion & Beauty",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    description: "Luxury bridal studio makeover portfolio featuring high-definition before/after transformation galleries, muhurtham styling packages, trial session scheduler, and client reviews.",
    challenge: "Brides required confidence in makeover artistry with verified real wedding portfolios, transparent pricing, and instant date lock-in.",
    solution: "Created an elegant, luxury editorial portfolio with split before/after sliders, wedding date inquiry calendar, and direct bridal consultation booking.",
    metrics: [
      { label: "Bridal Bookings", value: "+210%" },
      { label: "Lookbook Views", value: "50K+" },
      { label: "Google Review Rating", value: "5.0 ★" }
    ],
    techStack: ["React", "Firebase", "Framer Motion", "Tailwind CSS", "Cloudinary"],
    deliverables: [
      "HD Bridal Transformation Lookbook",
      "Muhurtham & Reception Package Comparison",
      "Trial Session Slot Scheduler",
      "Direct WhatsApp Consultation Gateway"
    ],
    rating: 5.0,
    featured: false,
    accentColor: "from-rose-600 to-pink-600"
  },
  {
    id: "pixelrox",
    title: "PixelRox Digital Creative Agency & Media Lab",
    client: "PixelRox Technologies",
    tagline: "Cutting-Edge Digital Media, Branding & Web Innovation",
    url: "https://www.pixelrox.com",
    category: "Corporate & Enterprise",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    description: "Futuristic digital creative agency website demonstrating award-winning branding, commercial motion design, bespoke web engineering, and enterprise AI transformation services.",
    challenge: "The agency needed a cutting-edge, tech-forward digital showroom that highlights their creative capability to international enterprise clients.",
    solution: "Engineered a dark cyberpunk-inspired modern web experience with fluid 60FPS motion physics, interactive case study deep-dives, and instant project quote generator.",
    metrics: [
      { label: "Brand Recognition", value: "+400%" },
      { label: "Animation Frame Rate", value: "60 FPS" },
      { label: "Client Retainer Rate", value: "95%" }
    ],
    techStack: ["React", "TypeScript", "Three.js / Canvas", "Tailwind CSS", "Node.js", "Vite"],
    deliverables: [
      "Futuristic Dark Aesthetic Design System",
      "Interactive 3D / Motion Graphics Showcase",
      "Enterprise Tech Consultation Funnel",
      "Global Client Portfolio Case Studies"
    ],
    rating: 5.0,
    featured: true,
    accentColor: "from-cyan-500 to-blue-600"
  }
];
