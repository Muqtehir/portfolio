import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";

export default function GlobalEffects() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    const progress = document.querySelector(".scroll-progress");
    const spotlight = document.querySelector(".cursor-spotlight");
    const pointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const updateScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = root.scrollHeight - window.innerHeight;
        const progressValue = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        progress?.style.setProperty("transform", `scaleX(${progressValue})`);
        root.style.setProperty("--ambient-parallax-y", `${-window.scrollY * 0.035}px`);
        document.querySelector(".dark-hero-scene")?.style.setProperty(
          "--hero-parallax-y",
          `${-window.scrollY * 0.04}px`,
        );
      });
    };

    const updatePointer = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      spotlight?.style.setProperty("--cursor-x", `${pointerX}px`);
      spotlight?.style.setProperty("--cursor-y", `${pointerY}px`);
    };

    if (!reduceMotion) {
      window.addEventListener("scroll", updateScroll, { passive: true });
      updateScroll();
    }

    if (!reduceMotion && pointerMedia.matches) {
      window.addEventListener("pointermove", updatePointer, { passive: true });
      updatePointer({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      root.style.removeProperty("--ambient-parallax-y");
      document.querySelector(".dark-hero-scene")?.style.removeProperty("--hero-parallax-y");
    };
  }, [reduceMotion]);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="cursor-spotlight" aria-hidden="true" />
    </>
  );
}
