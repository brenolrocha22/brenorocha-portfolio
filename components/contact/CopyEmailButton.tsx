"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyEmailButtonProps = { email: string };

/** Copies the e-mail address; feedback is announced via a polite live region. */
export function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [feedback, setFeedback] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setFeedback("E-mail copiado.");
    } catch {
      setFeedback("Não foi possível copiar. Selecione o endereço manualmente.");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(""), 3000);
  }

  const copied = feedback === "E-mail copiado.";

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors duration-(--duration-fast) hover:bg-surface-2 hover:text-foreground"
        aria-label="Copiar e-mail"
      >
        {copied ? (
          <Check aria-hidden="true" className="size-4 text-success" />
        ) : (
          <Copy aria-hidden="true" className="size-4" />
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {feedback}
      </span>
    </>
  );
}
