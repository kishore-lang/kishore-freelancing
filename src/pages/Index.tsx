import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Social } from "@/components/Social";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <Navigation />
      
      <main>
        <Hero />
        <About />
        <Social />
      </main>

      <footer className="py-6 sm:py-8 text-center text-muted-foreground border-t border-white/10 px-4">
        <p className="text-xs sm:text-sm">
          © 2024 K Freelancing. Professional Web Development Services.
        </p>
      </footer>
    </div>
  );
};

export default Index;
