import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Download } from "lucide-react";
import { Button } from "./ui/button";

const handleResumeDownload = () => {
  // Updated to use the correct file name
  window.open("/kishore_cv%20(3).pdf", "_blank", "noopener,noreferrer");
};

const frontendSkills = [
  { name: "React.js", level: 80 },
  { name: "JavaScript / TypeScript", level: 80 },
  { name: "HTML", level: 95 },
  { name: "CSS / Tailwind", level: 75 },
  { name: "UI/UX", level: 70 },
];

const backendSkills = [
  { name: "Java (Spring Boot)", level: 80 },
  { name: "Python", level: 60 },
  { name: "DBMS (MySQL)", level: 95 },
  { name: "MongoDB", level: 85 },
  { name: "APIs / REST", level: 75 },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            About <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Us</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="glass-card p-6 sm:p-8 rounded-2xl">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 sm:mb-6">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="absolute inset-2 bg-background rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src="https://i.ibb.co/Jj0642Cg/Chat-GPT-Image-Sep-6-2026-12-31-25-PM.png"
                      alt="K Freelancing Logo"
                      className="w-full h-full object-cover rounded-full p-2 bg-black"
                    />
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                We are K Freelancing, a premier web development agency specializing in high-performance digital solutions. 
                Our team is dedicated to building scalable, interactive, and visually stunning web applications that elevate your brand and drive business growth. 
                From modern Frontend UI/UX to robust Backend architectures, we deliver excellence at every step.
                </p>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-background font-semibold shadow-[0_0_20px_rgba(0,240,255,0.5)] text-sm sm:text-base"
                    onClick={() => window.location.href = '/freelancing'}
                  >
                   Explore Our Services
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="space-y-4 sm:space-y-6"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center md:text-left">Skills & Expertise</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <h4 className="text-primary font-semibold mb-1">Frontend Dev</h4>
                  <p className="text-xs text-muted-foreground">React, Next.js, Framer Motion</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <h4 className="text-secondary font-semibold mb-1">Backend APIs</h4>
                  <p className="text-xs text-muted-foreground">Node.js, Express, Spring Boot</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <h4 className="text-accent font-semibold mb-1">Database Design</h4>
                  <p className="text-xs text-muted-foreground">PostgreSQL, MongoDB</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors">
                  <h4 className="text-emerald-400 font-semibold mb-1">Payment Gateways</h4>
                  <p className="text-xs text-muted-foreground">Razorpay, Stripe</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
    </section>
  );
};
