"use client";

import type { ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { useCopy } from "@/lib/use-copy";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  text: string;
  /** Accessible label (also the visible text when `children` is absent and `iconOnly` is false). */
  label: string;
  successMessage: string;
  className?: string;
  iconOnly?: boolean;
  children?: ReactNode;
};

/** Copies `text`; the icon turns into a check and the result is announced in a polite live region. */
export function CopyButton({ text, label, successMessage, className, iconOnly = false, children }: CopyButtonProps) {
  const { copy, feedback, copied } = useCopy(successMessage);

  return (
    <>
      <button
        type="button"
        onClick={() => copy(text)}
        aria-label={iconOnly ? label : undefined}
        className={cn("inline-flex items-center justify-center gap-2", className)}
      >
        {copied ? (
          <Check aria-hidden="true" className="size-4 shrink-0 text-success" />
        ) : (
          <Copy aria-hidden="true" className="size-4 shrink-0" />
        )}
        {iconOnly ? null : (children ?? label)}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {feedback}
      </span>
    </>
  );
}
