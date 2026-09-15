import { motion } from "framer-motion";
import { LucideIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  numericPrice?: number;
  icon: LucideIcon;
  isCustom?: boolean;
}

interface ServiceCardProps {
  service: ServiceItem;
  isSelected: boolean;
  onSelect: (service: ServiceItem) => void;
}

const getImageForService = (title: string, Icon: LucideIcon) => {
  const t = title.toLowerCase();
  const iconName = Icon?.displayName || Icon?.name || "";
  
  if (t.includes("app") || t.includes("mobile") || iconName.includes("Smartphone")) return "/service_app.jpg";
  if (t.includes("ui") || t.includes("ux") || t.includes("design") || iconName.includes("PenTool")) return "/service_ui.jpg";
  if (t.includes("data") || t.includes("seo") || t.includes("consulting") || iconName.includes("Trending")) return "/service_data.jpg";
  
  return "/service_web.jpg";
};

export const ServiceCard = ({ service, isSelected, onSelect }: ServiceCardProps) => {
  const navigate = useNavigate();
  const imageUrl = getImageForService(service.title, service.icon);

  const handleBookNow = () => {
    onSelect(service);
    navigate(`/booking?serviceId=${service.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`bg-zinc-900 border flex flex-col justify-between relative overflow-hidden transition-all duration-300 rounded-none shadow-xl ${
        isSelected
          ? "border-red-600 shadow-red-600/20"
          : "border-zinc-800 hover:border-red-600/50"
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 z-10 text-white bg-red-600 p-1 rounded-full shadow-lg">
          <CheckCircle2 size={24} />
        </div>
      )}

      {/* Image Header */}
      <div className="w-full h-48 relative border-b border-zinc-800 overflow-hidden group">
        <img 
          src={imageUrl} 
          alt={service.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
        <div className="absolute bottom-4 left-4 bg-black/80 p-2 border border-white/10 backdrop-blur-sm">
          <service.icon className="w-6 h-6 text-red-500" />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-black mb-3 text-white tracking-tight">{service.title}</h3>
        <p className="text-sm text-zinc-400 font-medium leading-relaxed mb-6 flex-grow">
          {service.description}
        </p>

        <div className="mt-auto pt-6 border-t border-zinc-800">
          <div className="flex items-baseline justify-between mb-6">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Starting at</span>
            <span className="text-2xl font-black text-white">
              {service.price}
            </span>
          </div>

          <Button
            onClick={handleBookNow}
            className={`w-full h-12 font-bold rounded-none transition-all duration-300 text-base ${
              isSelected
                ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30"
                : "bg-white text-black hover:bg-red-600 hover:text-white"
            }`}
          >
            {isSelected ? "Selected ✓" : "Book Now"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
