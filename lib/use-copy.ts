"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Copies text to the clipboard; `feedback` holds the message for an aria-live region (cleared after `ms`). */
export function useCopy(successMessage: string, ms = 2500) {
  const [feedback, setFeedback] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setFeedback(successMessage);
      } catch {
        setFeedback("Não foi possível copiar. Selecione o texto manualmente.");
      }
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setFeedback(""), ms);
    },
    [successMessage, ms],
  );

  return { copy, feedback, copied: feedback === successMessage };
}

/** True when the media query matches (false on the server and before hydration). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
