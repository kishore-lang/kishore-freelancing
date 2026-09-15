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
    <section id="about" className="py-12 sm:py-16 md:py-20 relative overflow-hidden bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-8 sm:mb-10 md:mb-12 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            About <span className="text-red-600">Us</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-none">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 sm:mb-6">
                  <div className="absolute inset-0 border-2 border-red-600 p-2">
                    <img
                      src="/logo.jpg"
                      alt="K Freelancing Logo"
                      className="w-full h-full object-cover bg-white"
                    />
                  </div>
                </div>

                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-4 sm:mb-6 font-medium">
                We are K Freelancing, a premier web development agency specializing in high-performance digital solutions. 
                Our team is dedicated to building scalable, interactive, and visually stunning web applications that elevate your brand and drive business growth. 
                From modern Frontend UI/UX to robust Backend architectures, we deliver excellence at every step.
                </p>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold shadow-xl shadow-red-600/20 text-sm sm:text-base rounded-none"
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
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-none hover:border-red-600 transition-colors">
                  <h4 className="text-red-500 font-semibold mb-1">Frontend Dev</h4>
                  <p className="text-xs text-zinc-400">React, Next.js, Framer Motion</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-none hover:border-red-600 transition-colors">
                  <h4 className="text-red-500 font-semibold mb-1">Backend APIs</h4>
                  <p className="text-xs text-zinc-400">Node.js, Express, Spring Boot</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-none hover:border-red-600 transition-colors">
                  <h4 className="text-red-500 font-semibold mb-1">Database Design</h4>
                  <p className="text-xs text-zinc-400">PostgreSQL, MongoDB</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-none hover:border-red-600 transition-colors">
                  <h4 className="text-red-500 font-semibold mb-1">Payment Gateways</h4>
                  <p className="text-xs text-zinc-400">Razorpay, Stripe</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

    </section>
  );
};
