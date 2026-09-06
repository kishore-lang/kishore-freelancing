import { motion } from "framer-motion";
import { Scene3D } from "./Scene3D";
import { Download, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const handleResumeDownload = () => {
  // Updated to use the correct file name
  window.open("/kishore_cv%20(3).pdf", "_blank", "noopener,noreferrer");
};

export const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 md:gap-12 items-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-6 text-center md:text-left"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <img 
              src="https://i.ibb.co/Jj0642Cg/Chat-GPT-Image-Sep-6-2026-12-31-25-PM.png" 
              alt="K Freelancing Logo" 
              className="w-24 sm:w-32 md:w-40 rounded-2xl mx-auto md:mx-0 shadow-2xl border border-white/10"
            />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
             K FREELANCING
            </span>
            <br />
            <span className="text-foreground">AGENCY</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto md:mx-0"
          >
            We build advanced, premium, and highly scalable web applications. Transform your digital presence with professional design and robust engineering.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center md:justify-start"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary text-background font-semibold shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] text-sm sm:text-base"
                onClick={() => window.location.href = '/freelancing'}
              >
                <ArrowRight className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                View Our Services
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10 text-sm sm:text-base"
                onClick={() => window.location.href = '/our-work'}
              >
                View Our Work
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] relative hidden md:block"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl" />
          <Scene3D />
        </motion.div>
      </div>

      {/* Animated gradient orbs - smaller on mobile */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
    </section>
  );
};
