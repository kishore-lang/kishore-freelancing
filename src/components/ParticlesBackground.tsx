import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export const ParticlesBackground = () => {
  const [particleCount, setParticleCount] = useState(80);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });

    // Set particle count based on screen size
    const updateParticleCount = () => {
      setParticleCount(window.innerWidth < 768 ? 40 : 80);
    };

    updateParticleCount();
    window.addEventListener('resize', updateParticleCount);

    return () => {
      window.removeEventListener('resize', updateParticleCount);
    };
  }, []);

  const options = useMemo(() => ({
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: {
              enable: true,
            } as any,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#00f0ff", "#b537f2", "#ff2e97"],
          },
          links: {
            color: "#00f0ff",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: "none" as const,
            enable: true,
            outModes: {
              default: "bounce" as const,
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: particleCount,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
  }), [particleCount]);

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 -z-10"
    />
  );
};
