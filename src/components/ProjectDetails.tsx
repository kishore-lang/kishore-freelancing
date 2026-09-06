import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface ProjectDetailsProps {
  project: {
    title: string;
    description: string;
    tech: string[];
    screenshots: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetails = ({ project, isOpen, onClose }: ProjectDetailsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.screenshots.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold">{project.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Overview</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm font-mono bg-primary/10 text-primary rounded-full border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Screenshots ({project.screenshots.length})</h3>
            
            {project.screenshots.length > 0 && (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                  <motion.img
                    key={currentImageIndex}
                    src={project.screenshots[currentImageIndex]}
                    alt={`Screenshot ${currentImageIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={prevImage}
                    className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={project.screenshots.length <= 1}
                  >
                    ← Previous
                  </button>

                  <div className="text-sm text-muted-foreground">
                    {currentImageIndex + 1} / {project.screenshots.length}
                  </div>

                  <button
                    onClick={nextImage}
                    className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    disabled={project.screenshots.length <= 1}
                  >
                    Next →
                  </button>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {project.screenshots.map((screenshot, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-primary scale-105"
                          : "border-border hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={screenshot}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
