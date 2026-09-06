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
            About <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Me</span>
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
                      src="https://i.ibb.co/whhMXRhK/IMG-2374.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                Hi, I’m Kishore J, a passionate 3rd-year B.E. Computer Science and Engineering student at Sri Krishna College of Technology (SKCT), Coimbatore.
                I love building interactive, visually engaging, and high-performance web applications. My interests revolve around Frontend Development, Creative UI/UX and modern JavaScript frameworks.
                </p>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-background font-semibold shadow-[0_0_20px_rgba(0,240,255,0.5)] text-sm sm:text-base"
                    onClick={handleResumeDownload}
                  >
                    <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                   Resume at a Glance
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

              <div className="grid md:grid-cols-2 gap-6">
                {/* Frontend & 3D */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Frontend & 3D</h4>
                  {frontendSkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.8 + index * 0.08 }}
                      className="space-y-2 mb-3"
                    >
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-foreground">{skill.name}</span>
                        <span className="text-primary">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: 0.8 + index * 0.08 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Backend */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Backend</h4>
                  {backendSkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.8 + index * 0.08 }}
                      className="space-y-2 mb-3"
                    >
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-foreground">{skill.name}</span>
                        <span className="text-primary">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: 0.8 + index * 0.08 }}
                        />
                      </div>
                    </motion.div>
                  ))}
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
