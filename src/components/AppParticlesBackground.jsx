import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const AppParticlesBackground = () => {
  const [init, setInit] = useState(false);

  // Ініціалізація двигуна один раз при монті компонента
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = {
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
        resize: true,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: ["#ffffff", "#cccccc", "#bbbbbb"] },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
      number: {
        density: { enable: true, area: 800 },
        value: 60,
      },
      opacity: {
        value: { min: 0.2, max: 0.5 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      shape: { type: "circle" },
      size: {
        value: { min: 0.2, max: 4 },
        animation: {
          enable: true,
          speed: 2,
          sync: false,
        },
      },
    },
    detectRetina: true,
    fullScreen: {
      enable: true,
      zIndex: -2,
    },
  };

  if (!init) return null;

  return <Particles id="tsparticles-app-background" options={options} />;
};

export default AppParticlesBackground;
