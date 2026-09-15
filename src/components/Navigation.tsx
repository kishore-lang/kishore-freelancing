import { motion } from "framer-motion";
import { NavLink } from "@/components/NavLink";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/#about" },
    { name: "Services", path: "/freelancing" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/10 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <motion.a
          href="/"
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-sm" />
          <span className="text-xl sm:text-2xl font-black text-black">
            K <span className="text-red-600">Freelancing</span>
          </span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.path}
              className="relative text-sm lg:text-base font-bold text-black/70 hover:text-red-600 transition-colors"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              {item.name}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="text-black p-2 hover:bg-black/5 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-black/10 shadow-lg"
        >
          <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className="text-base font-bold text-black/80 hover:text-red-600 transition-colors py-2 border-b border-black/5 last:border-0"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
