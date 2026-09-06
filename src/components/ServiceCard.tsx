import { motion } from "framer-motion";
import { LucideIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export const ServiceCard = ({ service, isSelected, onSelect }: ServiceCardProps) => {
  const Icon = service.icon;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border transition-all duration-300 ${
        isSelected
          ? "border-primary shadow-[0_0_30px_rgba(0,240,255,0.35)] ring-1 ring-primary bg-primary/5"
          : "border-white/10 hover:border-primary/50"
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 text-primary bg-primary/10 p-1.5 rounded-full border border-primary/30">
          <CheckCircle2 size={20} />
        </div>
      )}

      <div>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-5">
          <Icon className="w-6 h-6 text-primary" />
        </div>

        <h3 className="text-xl font-bold mb-2 text-foreground">{service.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {service.description}
        </p>
      </div>

      <div>
        <div className="mb-6 pt-4 border-t border-white/10 flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Starting at</span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {service.price}
          </span>
        </div>

        <Button
          onClick={() => onSelect(service)}
          className={`w-full font-semibold rounded-xl transition-all duration-300 ${
            isSelected
              ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              : "bg-gradient-to-r from-primary to-secondary text-background hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]"
          }`}
        >
          {isSelected ? "Selected ✓" : "Select Service"}
        </Button>
      </div>
    </motion.div>
  );
};
