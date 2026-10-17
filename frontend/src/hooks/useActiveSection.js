import { useCallback, useEffect, useRef, useState } from "react";

export default function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || "home");
  const setActiveSectionRef = useRef(setActiveSection);
  const navigateRef = useRef(() => {});

  useEffect(() => {
    let frame = 0;
    let finishTimer = 0;
    let programmaticScroll = false;
    let pendingTarget = "";
    let lastSyncedHash = window.location.hash;
    const sections = () => sectionIds
      .map((id) => document.getElementById(id))
      .filter((element) => element?.matches("section"));

    const setActive = (id) => {
      setActiveSectionRef.current((current) => current === id ? current : id);
    };

    const getActiveFromScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop <= 2) return sectionIds[0] || "home";

      const lastSection = sections().at(-1);
      const documentBottom = document.documentElement.scrollHeight;
      if (scrollTop + window.innerHeight >= documentBottom - 2 && lastSection) {
        return lastSection.id;
      }

      const referenceLine = scrollTop + window.innerHeight * 0.35;
      const passedSections = sections().filter(
        (section) => section.getBoundingClientRect().top + scrollTop <= referenceLine,
      );
      return passedSections.at(-1)?.id || sectionIds[0] || "home";
    };

    const syncFromScroll = () => {
      if (!programmaticScroll && !pendingTarget) setActive(getActiveFromScroll());
    };

    const scheduleScrollSync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        syncFromScroll();
      });
    };

    const finishProgrammaticScroll = () => {
      if (!programmaticScroll) return;
      window.clearTimeout(finishTimer);
      finishTimer = 0;
      programmaticScroll = false;
      pendingTarget = "";
      syncFromScroll();
    };

    const beginProgrammaticScroll = (id) => {
      const target = document.getElementById(id);
      if (!target?.matches("section")) {
        pendingTarget = id;
        return;
      }

      pendingTarget = "";
      programmaticScroll = true;
      window.clearTimeout(finishTimer);
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth";
      if (id === "home") {
        window.scrollTo({ top: 0, behavior });
      } else {
        target.scrollIntoView({ behavior, block: "start" });
      }
      finishTimer = window.setTimeout(finishProgrammaticScroll, 900);
    };

    const navigate = (id, updateHistory = false) => {
      if (!sectionIds.includes(id)) return;
      setActive(id);
      if (updateHistory && window.location.hash !== `#${id}`) {
        window.history.pushState(null, "", `#${id}`);
        lastSyncedHash = window.location.hash;
      }
      beginProgrammaticScroll(id);
    };
    navigateRef.current = navigate;

    const syncFromLocation = () => {
      if (window.location.hash === lastSyncedHash) return;
      lastSyncedHash = window.location.hash;
      const id = window.location.hash.slice(1);
      if (sectionIds.includes(id)) {
        navigate(id);
      } else {
        syncFromScroll();
      }
    };

    const handleScrollEnd = () => finishProgrammaticScroll();
    const mutationObserver = new MutationObserver(() => {
      if (pendingTarget && document.getElementById(pendingTarget)?.matches("section")) {
        beginProgrammaticScroll(pendingTarget);
      } else {
        syncFromScroll();
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", scheduleScrollSync, { passive: true });
    window.addEventListener("resize", scheduleScrollSync);
    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);
    document.addEventListener("scrollend", handleScrollEnd);

    const initialId = window.location.hash.slice(1);
    if (sectionIds.includes(initialId)) {
      navigate(initialId);
    } else {
      syncFromScroll();
    }

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener("scroll", scheduleScrollSync);
      window.removeEventListener("resize", scheduleScrollSync);
      window.removeEventListener("hashchange", syncFromLocation);
      window.removeEventListener("popstate", syncFromLocation);
      document.removeEventListener("scrollend", handleScrollEnd);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(finishTimer);
      navigateRef.current = () => {};
    };
  }, [sectionIds]);

  const navigateToSection = useCallback((id, updateHistory = true) => {
    navigateRef.current(id, updateHistory);
  }, []);

  return { activeSection, navigateToSection };
}
