import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Award, Book, Briefcase, Users, FileText, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  category: "coursera" | "infosys" | "internship" | "workshop" | "project" | "achievement";
  date: string;
  credentialUrl: string;
  description: string;
  icon: React.ReactNode;
  backgroundImage?: string;
}

const certificates: Certificate[] = [
  // Infosys Springboard
  {
    id: "infosys-1",
    title: "JavaScript: Getting Started with JavaScript Programming",
    issuer: "Infosys Springboard",
    category: "infosys",
    date: "November 13, 2025",
    credentialUrl: "https://i.ibb.co/3yJkbDwD/1-4fa2a531-4f9e-438a-b795-225b0528b927.jpg",
    description: "JavaScript (JS) is one of the core technologies of the web, alongside HTML and CSS. It allows you to create interactive, dynamic pages and is also used on servers, mobile apps, desktop apps, and more.",
    icon: <Users className="w-5 h-5" />,
    backgroundImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
  },
  // Internship Certificate
  {
    id: "internship-1",
    title: "Internship Certificate",
    issuer: "CodeBinding Coimbatore",
    category: "internship",
    date: "2 June 2025-16 June 2025",
    credentialUrl: "https://i.ibb.co/1tdJQctb/IMG-E2900.jpg",
    description: "A 14-day web development internship covering HTML, CSS, JavaScript, backend, database, and deployment.",
    icon: <Briefcase className="w-5 h-5" />,
    backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
  },
  // Workshop Certificate
  {
    id: "workshop-1",
    title: " E-Commerce Workshop Certificate",
    issuer: "CodeBinding Coimbatore",
    category: "workshop",
    date: "16 June 2025",
    credentialUrl: "https://i.ibb.co/S7J9v37n/IMG-E2896.jpg",
    description: "By the One day, participants will learn to build and deploy a functional e-commerce web application using modern web technologies (HTML, CSS, JavaScript, backend basics, database, and payment workflow).",
    icon: <Trophy className="w-5 h-5" />,
    backgroundImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
  },
  // Project Completion Certificate
  {
    id: "project-1",
    title: "Project Completion Certificate",
    issuer: "CodeBinding Coimbatore",
    category: "project",
    date: "2 June 2025-16 June 2025",
    credentialUrl: "https://i.ibb.co/vCf6DJCt/IMG-E2899.jpg",
    description: "Projecton Online Food Delivery application using HTML, CSS, JavaScript,PHP",
    icon: <FileText className="w-5 h-5" />,
    backgroundImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
  },
  // Achievement: National Level Hackathon
  {
    id: "achievement-1",
    title: "National Level Hackathon Winner",
    issuer: "PSG iTech Yukta 26",
    category: "achievement",
    date: "March 2026",
    credentialUrl: "#",
    description: "Won 1st prize in the National Level Hackathon conducted by PSG iTech Yukta 26, showcasing innovative problem-solving and technical skills.",
    icon: <Trophy className="w-5 h-5" />,
    backgroundImage: "https://images.unsplash.com/photo-1554188248-986adbb73c67?w=800&h=600&fit=crop",
  },
];

const categoryConfig = {
  coursera: { label: "Coursera Courses", color: "from-blue-500 to-cyan-500", bgColor: "bg-blue-500/10" },
  infosys: { label: "Infosys Springboard", color: "from-purple-500 to-pink-500", bgColor: "bg-purple-500/10" },
  internship: { label: "Internship", color: "from-green-500 to-emerald-500", bgColor: "bg-green-500/10" },
  workshop: { label: "Workshop", color: "from-orange-500 to-red-500", bgColor: "bg-orange-500/10" },
  project: { label: "Project Completion", color: "from-yellow-500 to-orange-500", bgColor: "bg-yellow-500/10" },
  achievement: { label: "Achievement", color: "from-purple-500 to-pink-500", bgColor: "bg-purple-500/10" },
};

export const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [filter, setFilter] = useState<"all" | Certificate["category"]>("all");

  const filteredCerts =
    filter === "all"
      ? certificates
      : certificates.filter((cert) => cert.category === filter);

  const categories = Object.entries(categoryConfig).map(([key]) => key as Certificate["category"]);

  return (
    <section id="certifications" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Certifications
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Professional certifications and training courses completed across various platforms
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            }`}
          >
            All ({certificates.length})
          </motion.button>

          {categories.map((category) => {
            const count = certificates.filter((c) => c.category === category).length;
            return (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === category
                    ? `bg-gradient-to-r ${categoryConfig[category].color} text-white`
                    : "bg-white/5 text-muted-foreground hover:bg-white/10"
                }`}
              >
                {categoryConfig[category].label} ({count})
              </motion.button>
            );
          })}
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert, index) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedCert(cert)}
                className="group cursor-pointer"
              >
                <div
                  className={`h-full rounded-lg border border-white/10 ${categoryConfig[cert.category].bgColor} 
                    backdrop-blur-sm p-5 sm:p-6 transition-all duration-300 hover:border-white/20 hover:shadow-lg relative overflow-hidden`}
                  style={{
                    backgroundImage: cert.backgroundImage ? `url(${cert.backgroundImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {cert.backgroundImage && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                  )}
                  <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-br ${categoryConfig[cert.category].color} 
                          text-white flex-shrink-0`}
                      >
                        {cert.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                          {cert.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {categoryConfig[cert.category].label}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">
                      {cert.issuer}
                    </p>

                    <p className="text-xs text-muted-foreground mb-4">{cert.date}</p>

                    <div className="flex items-center justify-between">
                      <a
                        href={cert.credentialUrl}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors"
                      >
                        View Certificate
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">No certificates found in this category</p>
          </motion.div>
        )}
      </div>

      {/* Certificate Detail Dialog */}
      <AnimatePresence>
        {selectedCert && (
          <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${categoryConfig[selectedCert.category].color} 
                      text-white`}
                  >
                    {selectedCert.icon}
                  </div>
                  {selectedCert.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Category
                  </label>
                  <p className="text-sm font-medium">
                    {categoryConfig[selectedCert.category].label}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Issuer
                  </label>
                  <p className="text-sm font-medium">{selectedCert.issuer}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Date Completed
                  </label>
                  <p className="text-sm font-medium">{selectedCert.date}</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Description
                  </label>
                  <p className="text-sm text-muted-foreground">{selectedCert.description}</p>
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Full Certificate
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
};
