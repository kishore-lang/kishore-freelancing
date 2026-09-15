import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Social } from "@/components/Social";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Shield, Trophy } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-white">
      <Navigation />
      
      <main>
        <Hero />
        <About />

        {/* Why Choose Us Section - White Background */}
        <section className="py-16 md:py-24 bg-white text-black border-t border-black/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
                Why <span className="text-red-600">Choose Us</span>
              </h2>
              <p className="text-zinc-600 font-medium text-lg">
                We deliver premium corporate web solutions designed to scale your business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Optimized performance and rapid delivery timelines." },
                { icon: Shield, title: "Secure Architecture", desc: "Enterprise-grade security for your data and users." },
                { icon: Trophy, title: "Premium Quality", desc: "Award-winning design aesthetics and seamless UX." },
                { icon: CheckCircle2, title: "24/7 Support", desc: "Dedicated maintenance and reliable uptime." }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 border border-black/10 bg-zinc-50 hover:border-red-600 transition-colors"
                >
                  <div className="w-12 h-12 bg-red-600/10 text-red-600 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-zinc-600 font-medium text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Social />
      </main>

      <footer className="py-8 text-center text-zinc-400 bg-black border-t border-zinc-800 px-4">
        <p className="text-sm font-medium">
          © 2024 K Freelancing. Professional Web Development Services.
        </p>
      </footer>
    </div>
  );
};

export default Index;
