import { Navigation } from "@/components/Navigation";
import { About } from "@/components/About";
import { Social } from "@/components/Social";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="pt-20">
        <About />
        <Social />
      </main>
      <footer className="py-8 text-center text-zinc-500 bg-black border-t border-zinc-900 px-4">
        <p className="text-xs">
          © 2024 K Freelancing. Full-Stack Web Development & High-Performance Digital Solutions.
        </p>
      </footer>
    </div>
  );
}
