import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Mail, Twitter, Instagram, Phone } from "lucide-react";

const socials = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/kishore-lang",
    color: "from-primary to-primary",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/kishore-jagadesan/",
    color: "from-secondary to-secondary",
  },
  {
    name: "Phone",
    icon: Phone,
    url: "tel:+916379311955",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/kishorx.__/#",
    color: "from-accent to-primary",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:kishorekishore0783@gmail.com",
    color: "from-primary to-secondary",
  },
];

export const Social = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Let's <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Connect</span>
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Feel free to reach out for collaborations or just a friendly hello
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {socials.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{
                  scale: 1.2,
                  rotate: 5,
                }}
                whileTap={{ scale: 0.9 }}
                className="relative group"
                aria-label={social.name}
              >
                <div className="glass-card p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-20 rounded-xl sm:rounded-2xl transition-opacity duration-300`}
                  />
                  <social.icon
                    size={24}
                    className="sm:w-8 sm:h-8 text-foreground group-hover:text-primary transition-colors relative z-10"
                  />
                </div>

                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${social.color} blur-xl opacity-0 group-hover:opacity-50 -z-10 rounded-xl sm:rounded-2xl`}
                  initial={false}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9 }}
            className="mt-8 sm:mt-10 md:mt-12 glass-card p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Available for Opportunities</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Currently open to freelance projects and full-time positions.
              Let's build something amazing together!
            </p>
            <motion.a
              href="https://wa.me/916379311955?text=hello%20Kishore"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-full shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-shadow"
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
    </section>
  );
};
