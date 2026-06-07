"use client";

import { useEffect } from "react";

export function HomeHashHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
