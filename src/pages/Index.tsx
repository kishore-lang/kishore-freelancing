import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { CodingStats } from "@/components/CodingStats";
import { Certifications } from "@/components/Certifications";
import { Social } from "@/components/Social";
import { CursorFollower } from "@/components/CursorFollower";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <CursorFollower />
      <Navigation />
      
      <main>
        <Hero />
        <About />
        <Projects />
        <CodingStats />
        <Certifications />
        <Social />
      </main>

      <footer className="py-6 sm:py-8 text-center text-muted-foreground border-t border-white/10 px-4">
        <p className="text-xs sm:text-sm">
          © 2024 Portfolio. Built with React, Three.js & Framer Motion
        </p>
      </footer>
    </div>
  );
};

export default Index;
