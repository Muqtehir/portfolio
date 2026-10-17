import { animate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const stageNames = ["Design", "Build", "Refine"];

function stageAt(progress) {
  if (progress >= 1.5) return 3;
  if (progress >= 0.5) return 2;
  return 1;
}

export default function useStageLoop(containerRef, interactionPaused) {
  const reduceMotion = useReducedMotion();
  const targetProgress = useMotionValue(0);
  const progress = useSpring(targetProgress, { stiffness: 190, damping: 28 });
  const [stage, setStage] = useState(1);
  const [inView, setInView] = useState(
    () => !("IntersectionObserver" in window),
  );
  const [tabVisible, setTabVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [jumpPaused, setJumpPaused] = useState(false);
  const jumpTimerRef = useRef(0);

  useEffect(() => {
    const updateStage = (value) => setStage(stageAt(value));
    updateStage(progress.get());
    return progress.on("change", updateStage);
  }, [progress]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [containerRef]);

  useEffect(() => {
    const updateVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (reduceMotion || interactionPaused || !inView || !tabVisible || jumpPaused) {
      return undefined;
    }

    let timer = 0;
    let animation;
    let cancelled = false;

    const scheduleNext = () => {
      if (cancelled) return;
      const current = progress.get();
      const leavingRefine = current >= 2 && current < 3;
      timer = window.setTimeout(async () => {
        let position = targetProgress.get();
        if (position >= 2.9) {
          targetProgress.jump(0);
          progress.jump(0);
          position = 0;
        }
        const next = position >= 1.5 ? 3 : position >= 0.5 ? 2 : 1;
        animation = animate(targetProgress, next, {
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        });
        await animation;
        scheduleNext();
      }, leavingRefine ? 2000 : 2300);
    };

    scheduleNext();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      animation?.stop();
    };
  }, [inView, interactionPaused, jumpPaused, progress, reduceMotion, tabVisible, targetProgress]);

  useEffect(() => () => {
    window.clearTimeout(jumpTimerRef.current);
    targetProgress.stop();
    progress.stop();
  }, [progress, targetProgress]);

  const jumpTo = useCallback((nextStage) => {
    const stageIndex = typeof nextStage === "number"
      ? nextStage - 1
      : stageNames.findIndex((name) => name.toLowerCase() === String(nextStage).toLowerCase());
    if (!Number.isInteger(stageIndex) || stageIndex < 0 || stageIndex > 2) return;

    setJumpPaused(true);
    window.clearTimeout(jumpTimerRef.current);
    targetProgress.stop();
    animate(targetProgress, stageIndex, {
      duration: reduceMotion ? 0.2 : 1.2,
      ease: [0.22, 1, 0.36, 1],
    });
    jumpTimerRef.current = window.setTimeout(() => setJumpPaused(false), 6000);
  }, [reduceMotion, targetProgress]);

  return {
    stage,
    progress,
    jumpTo,
    paused: Boolean(reduceMotion || interactionPaused || !inView || !tabVisible || jumpPaused),
    inView,
    tabVisible,
  };
}
