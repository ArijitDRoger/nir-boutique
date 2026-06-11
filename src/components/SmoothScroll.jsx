import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export default function SmoothScroll() {
  const location = useLocation();
  const lenisRef = useRef(null);

  // Create Lenis only once
  useEffect(() => {
    const isAdmin = location.pathname.startsWith("/admin");

    if (isAdmin) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.08,
    });

    lenisRef.current = lenis;

    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        immediate: true,
      });
    }
  }, [location.pathname]);

  return null;
}
