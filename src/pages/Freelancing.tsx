import * as LucideIcons from "lucide-react";
import { Zap } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Freelancing = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/services`);
        const data = await res.json();
        
        if (data.success && data.services) {
          const mappedServices = data.services.map((s: any) => {
            // Dynamically select icon, fallback to Sparkles
            const IconComponent = (LucideIcons as any)[s.icon] || LucideIcons.Sparkles;
            
            return {
              id: s.service_key,
              title: s.service_name,
              description: s.description || "Premium freelance service",
              price: s.price ? `₹${Number(s.price).toLocaleString()}` : "Custom",
              numericPrice: s.price ? Number(s.price) : 0,
              icon: IconComponent,
              isCustom: !s.price
            };
          });
          setServices(mappedServices);
          if (mappedServices.length > 0) {
            setSelectedService(mappedServices[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    const element = document.getElementById("order-form-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <CursorFollower />
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-primary/30 mb-6 text-xs sm:text-sm font-medium text-primary"
          >
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span>Available for Hire & Custom Projects</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Freelance Services
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground/90 mb-4"
          >
            Let's build something amazing together.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
          >
            Select a service package below to suit your project needs or specify custom requirements. Submit your details to request an order.
          </motion.p>
        </section>

        {/* SERVICES CARDS GRID */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Select a Package
            </h2>
            <span className="text-xs sm:text-sm text-muted-foreground">
              6 Packages Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <LucideIcons.Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-4" />
                <p className="text-zinc-400">Loading live products...</p>
              </div>
            ) : (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedService?.id === service.id}
                  onSelect={handleSelectService}
                />
              ))
            )}
          </div>
        </section>

        {/* ORDER FORM SECTION */}
        <section className="max-w-4xl mx-auto">
          {services.length > 0 && (
            <FreelanceOrderForm
              selectedService={selectedService}
              services={services}
              onSelectService={setSelectedService}
            />
          )}
        </section>
      </main>

      <footer className="py-6 sm:py-8 text-center text-muted-foreground border-t border-white/10 px-4">
        <p className="text-xs sm:text-sm">
          © 2024 Portfolio. Built with React, Three.js & Framer Motion
        </p>
      </footer>
    </div>
  );
};

export default Freelancing;
