import { useState } from "react";
import { motion } from "framer-motion";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { CursorFollower } from "@/components/CursorFollower";
import { Navigation } from "@/components/Navigation";
import { ServiceCard, ServiceItem } from "@/components/ServiceCard";
import { FreelanceOrderForm } from "@/components/FreelanceOrderForm";
import {
  Globe,
  Code2,
  ShoppingCart,
  Layers,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";

const FREELANCE_SERVICES: ServiceItem[] = [
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    description:
      "Modern responsive portfolio website designed to showcase your skills, projects and professional profile.",
    price: "₹2,000",
    numericPrice: 2000,
    icon: Globe,
  },
  {
    id: "react-website",
    title: "React Website",
    description:
      "Modern responsive React website with clean UI, animations and professional design.",
    price: "₹3,000",
    numericPrice: 3000,
    icon: Code2,
  },
  {
    id: "e-commerce-website",
    title: "E-Commerce Website",
    description:
      "Full e-commerce website with product listing, cart, checkout and payment gateway integration.",
    price: "₹8,000",
    numericPrice: 8000,
    icon: ShoppingCart,
  },
  {
    id: "fullstack-application",
    title: "Full-Stack Web Application",
    description:
      "Custom web application with frontend, backend APIs and database integration.",
    price: "₹10,000",
    numericPrice: 10000,
    icon: Layers,
  },
  {
    id: "api-backend-integration",
    title: "API / Backend Integration",
    description:
      "REST API development, third-party API integration and backend functionality.",
    price: "₹4,000",
    numericPrice: 4000,
    icon: Server,
  },
  {
    id: "test-package",
    title: "Test Package",
    description:
      "A 5 Rs package for testing live payments and webhook integration.",
    price: "₹5",
    numericPrice: 5,
    icon: Zap,
  },
  {
    id: "custom-project",
    title: "Custom Project",
    description:
      "Have a different requirement? Tell me about your project and let's discuss it.",
    price: "Custom",
    icon: Sparkles,
    isCustom: true,
  },
];

const Freelancing = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    FREELANCE_SERVICES[0]
  );

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
            {FREELANCE_SERVICES.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedService?.id === service.id}
                onSelect={handleSelectService}
              />
            ))}
          </div>
        </section>

        {/* ORDER FORM SECTION */}
        <section className="max-w-4xl mx-auto">
          <FreelanceOrderForm
            selectedService={selectedService}
            services={FREELANCE_SERVICES}
            onSelectService={setSelectedService}
          />
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
