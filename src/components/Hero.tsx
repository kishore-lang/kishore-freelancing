import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20 md:pt-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 md:gap-12 items-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-6 text-center md:text-left"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <img 
              src="/logo.jpg" 
              alt="K Freelancing Logo" 
              className="w-24 sm:w-32 md:w-40 rounded-xl mx-auto md:mx-0 shadow-lg border border-black/5"
            />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tighter"
          >
            <span className="text-black">
             K FREELANCING
            </span>
            <br />
            <span className="text-red-600">AGENCY</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-lg mx-auto md:mx-0 font-medium"
          >
            We build advanced, premium, and highly scalable web applications. Transform your digital presence with professional design and robust engineering.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center md:justify-start pt-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold shadow-xl shadow-red-600/20 text-sm sm:text-base rounded-none"
                onClick={() => window.location.href = '/freelancing'}
              >
                <ArrowRight className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                View Our Services
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] relative hidden md:flex items-center justify-center"
        >
          <img src="/web_dev.jpg" alt="Web Development" className="object-cover w-full h-full rounded-2xl shadow-2xl" />
        </motion.div>
      </div>
    </section>
  );
};
