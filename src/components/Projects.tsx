import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "./ui/button";
import { ProjectDetails } from "./ProjectDetails";

const projects = [
  {
    title: "Yoga Instructor Application System",
    description:
      "Built a full-stack booking platform using React and Spring Boot, enabling instructor management, session scheduling, and secure user interactions with a MySQL backend.",
    tech: ["React", "Spring Boot", "MySQL"],
    gradient: "from-primary to-secondary",
    backgroundImage: "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop&q=80')",
    githubUrl: "https://github.com/kishore-lang/YogaInstructorAplication",
    screenshots: [
      "https://i.ibb.co/x8shqLTh/homepage.png",
      "https://i.ibb.co/FLQrZ99k/Instructor-application.png",
      "https://i.ibb.co/Z6Vbpn26/Instructor-details.png",
      "https://i.ibb.co/kswtPBYy/student-booking.png",
      "https://i.ibb.co/kVbQLm0r/Login-page.png",
      "https://i.ibb.co/0y8KYTtv/Payment-page.png",
      "https://i.ibb.co/XfxBtS7s/Yoga-instructor-details.png",
      "https://i.ibb.co/svFxbTYL/Admin-Dashboard.png",
    ],
  },
  {
    title: "Languge Learning Platform ",
    description:
      "Learn new languages through a lightweight Spring platform with easy course enrollment.",
    tech: ["Spring Boot", "MY SQL"],
    gradient: "from-secondary to-accent",
    backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop&q=80')",
    githubUrl: "https://github.com/kishore-lang/student.git",
  },
 
 
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <section id="projects" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Featured <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Projects</span>
          </motion.h2>

          <motion.p
            className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Some of my recent work and side projects
          </motion.p>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="glass-card p-5 sm:p-6 rounded-2xl h-full relative overflow-hidden"
                  style={
                    project.backgroundImage
                      ? { backgroundImage: project.backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : {}
                  }
                >
                  {/* Dark overlay for text readability */}
                  {project.backgroundImage && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl" />
                  )}
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors flex-1">
                        {project.title}
                      </h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <motion.a
                          href={project.githubUrl}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="GitHub"
                        >
                          <Github size={18} className="sm:w-5 sm:h-5" />
                        </motion.a>
                        <motion.a
                          href={project.demoUrl}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="Demo"
                        >
                          <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                        </motion.a>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 sm:px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-full border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {project.screenshots && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedProject(project)}
                          className="flex-1 px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                          View Screenshots
                        </motion.button>
                      )}
                      <motion.a
                        href={project.githubUrl}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-primary/50 text-primary hover:bg-primary/10 text-sm sm:text-base"
                        >
                          GitHub
                          <Github className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Background gradient */}
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};
