import React, { useCallback } from "react";
import { Particles } from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Використовуйте 'tsparticles-slim' для меншого розміру bundle

const AppParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // Ця функція викликається, коли частинки повністю завантажені
    // console.log("Particles container loaded", container);
  }, []);

  // Налаштування частинок для інтерактивного фону
  const options = {
    particles: {
      number: {
        value: 60, // Кількість частинок
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        // Кольори частинок. Можна використовувати CSS-змінні для інтеграції з темою,
        // але для цього потрібно буде передавати тему сюди або отримати її іншим способом.
        // Для простоти зараз використовую фіксовані кольори.
        value: ["#ffffff", "#cccccc", "#bbbbbb"],
      },
      shape: {
        type: "circle", // Форма частинок
        stroke: {
          width: 0,
          color: "#000000",
        },
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.2,
          sync: false,
        },
      },
      size: {
        value: 4, // Розмір частинок
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.2,
          sync: false,
        },
      },
      line_linked: {
        enable: false, // Не з'єднувати частинки лініями, щоб фон був чистішим
      },
      move: {
        enable: true,
        speed: 1, // Загальна швидкість руху
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detect_on: "canvas", // Взаємодія буде детектуватися на полотні
      events: {
        onhover: {
          enable: true, // Включити реакцію на наведення курсора
          mode: "repulse", // Режим: частинки відштовхуються від курсора
        },
        onclick: {
          enable: true, // Включити реакцію на клік
          mode: "push", // Режим: додати нові частинки при кліку
        },
        resize: true, // Перерахувати частинки при зміні розміру вікна
      },
      modes: {
        repulse: {
          distance: 100, // Відстань, на якій частинки відштовхуються
          duration: 0.4,
        },
        push: {
          particles_nb: 4, // Кількість частинок, які додаються за клік
        },
        // Інші режими, якщо потрібні: grab, bubble, remove
      },
    },
    retina_detect: true,
    background: {
      color: {
        value: "transparent", // Фон буде встановлюватися за допомогою CSS на `body`
      },
    },
  };

  return (
    <Particles
      id="tsparticles-app-background"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -2, // Переміщуємо на задній план, щоб не перекривати UI
      }}
    />
  );
};

export default AppParticlesBackground;
