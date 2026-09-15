import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { FreelanceOrderForm } from "@/components/FreelanceOrderForm";
import { ServiceItem } from "@/components/ServiceCard";
import * as LucideIcons from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceId = searchParams.get("serviceId");
  
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          
          const matchedService = mappedServices.find((s: ServiceItem) => s.id === serviceId);
          if (matchedService) {
            setSelectedService(matchedService);
          } else if (mappedServices.length > 0) {
            setSelectedService(mappedServices[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch service:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, [serviceId]);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-8 hover:bg-black/5 rounded-none font-bold"
          onClick={() => navigate('/freelancing')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Complete Your <span className="text-red-600">Booking</span>
            </h1>
            <p className="text-zinc-600 font-medium">
              {isLoading 
                ? "Loading service details..." 
                : selectedService 
                  ? `You are booking: ${selectedService.title}` 
                  : "Fill out the form below to get started."}
            </p>
          </div>
          
          <div className="bg-zinc-50 border border-black/10 p-6 sm:p-8 md:p-10 shadow-2xl">
            <FreelanceOrderForm 
              selectedService={selectedService} 
              services={services} 
              onSelectService={setSelectedService} 
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
