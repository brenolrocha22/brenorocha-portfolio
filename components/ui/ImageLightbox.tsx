"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

export type LightboxImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  mat?: "paper";
};

type ImageLightboxProps = {
  image: LightboxImage | null;
  onClose: () => void;
};

/**
 * Full image in a native <dialog> (title, close button, Esc; focus returns to the trigger,
 * handled by the caller). On wide screens a click toggles 1× ↔ 2× around the clicked point.
 */
export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (image && !dialog.open) dialog.showModal();
    if (!image && dialog.open) dialog.close();
  }, [image]);

  function toggleZoom(event: MouseEvent<HTMLDivElement>) {
    if (window.innerWidth < 1024) return;
    if (zoom) {
      setZoom(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="lightbox-title"
      onClose={() => {
        setZoom(null);
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      className="lightbox m-auto max-h-[92svh] w-[min(1200px,94vw)] max-w-none overflow-hidden rounded-lg border border-border-strong bg-surface p-0 text-foreground"
    >
      {image ? (
        <div className="flex max-h-[92svh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2">
            <h2 id="lightbox-title" className="text-small font-medium">
              {image.title}
            </h2>
            <span className="flex items-center gap-1">
              <span aria-hidden="true" className="hidden text-muted-foreground lg:inline-flex">
                {zoom ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
              </span>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="inline-flex size-11 items-center justify-center rounded-md transition-colors duration-(--duration-fast) hover:bg-surface-2"
              >
                <X aria-hidden="true" className="size-5" />
                <span className="sr-only">Fechar imagem</span>
              </button>
            </span>
          </div>
          <div
            className={cn("min-h-0 flex-1 overflow-auto", image.mat === "paper" && "bg-paper p-3")}
            onClick={toggleZoom}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 1280px) 94vw, 1200px"
              className={cn(
                "h-auto w-full transition-transform duration-(--duration-base) ease-out-expo lg:cursor-zoom-in",
                zoom && "lg:cursor-zoom-out",
              )}
              style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
