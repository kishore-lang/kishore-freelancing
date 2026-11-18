import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Social } from "@/components/Social";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Shield, Trophy, ExternalLink, Globe, ArrowRight, Sparkles } from "lucide-react";
import { PORTFOLIO_PROJECTS } from "@/data/portfolioData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-white">
      <Navigation />
      
      <main>
        <Hero />
        <About />

        {/* Featured Live Client Projects Section */}
        <section className="py-20 md:py-28 bg-black text-white border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Client Production Deployments
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
                  Featured <span className="text-red-600">Client Works</span>
                </h2>
                <p className="text-zinc-400 font-medium text-base mt-2 max-w-xl">
                  Explore real-world production websites built for corporate leaders, academies, and luxury service brands.
                </p>
              </div>

              <Link to="/our-works">
                <Button 
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-none uppercase text-xs tracking-wider shadow-lg shadow-red-600/30 h-11 px-6 flex items-center gap-2"
                >
                  <span>Explore All 9 Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* 6 Featured Client Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PORTFOLIO_PROJECTS.slice(0, 6).map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  {/* Window Bar */}
                  <div className="bg-zinc-900/80 px-3 py-2 border-b border-zinc-800 flex items-center justify-between text-xs select-none">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono truncate max-w-[180px]">
                      <Globe className="w-3 h-3 text-red-500" />
                      <span className="truncate">{project.url.replace("https://", "")}</span>
                    </div>
                    <span className="text-[10px] text-green-400 font-mono font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </span>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md border border-zinc-800 text-[10px] font-bold text-white uppercase">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-[11px] font-bold text-red-500 uppercase">{project.client}</p>
                      <h3 className="text-lg font-black text-white group-hover:text-red-500 transition-colors mt-0.5 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-900 flex items-center gap-2">
                      <a 
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button 
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-none h-8 flex items-center justify-center gap-1.5"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Visit Live Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>

                      <Link to="/our-works">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-zinc-800 text-zinc-300 hover:text-white text-xs rounded-none h-8 px-2.5"
                        >
                          Case Study
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Link to Full Portfolio */}
            <div className="mt-12 text-center">
              <Link to="/our-works">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-900 rounded-none text-xs font-bold uppercase tracking-wider px-8"
                >
                  View All 9 Live Client Websites with Tech Specs & Metrics <ArrowRight className="w-4 h-4 ml-2 text-red-500" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

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
