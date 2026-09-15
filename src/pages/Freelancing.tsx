import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { ServiceCard, ServiceItem } from "@/components/ServiceCard";
import { FreelanceOrderForm } from "@/components/FreelanceOrderForm";
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
    <div className="relative min-h-screen bg-black text-white">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* HERO SECTION */}
        <section className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none border border-red-600 mb-6 text-xs sm:text-sm font-bold text-red-600 bg-red-600/10"
          >
            <Zap className="w-4 h-4 text-red-600 animate-pulse" />
            <span>Available for Hire & Custom Projects</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight"
          >
            <span className="text-white">
              Freelance <span className="text-red-600">Services</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl font-bold text-zinc-300 mb-4"
          >
            Let's build something amazing together.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-zinc-400 font-medium max-w-2xl mx-auto"
          >
            From stunning Landing Pages to complex Fullstack Applications. Choose a service below, check out the pricing, and let's get your project started.
          </motion.p>
        </section>

        {/* SERVICES GRID */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <section className="mb-24">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  onSelect={() => handleSelectService(service)}
                  isSelected={selectedService?.id === service.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* ORDER FORM SECTION */}
        <section id="order-form-section" className="max-w-4xl mx-auto scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">Start Your <span className="text-red-600">Project</span></h2>
              <p className="text-zinc-400 font-medium">Fill out the form below and we will get back to you within 24 hours.</p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 md:p-10 shadow-2xl">
              <FreelanceOrderForm initialService={selectedService} />
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Freelancing;
