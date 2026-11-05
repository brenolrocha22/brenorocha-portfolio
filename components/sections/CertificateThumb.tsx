"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { ImageLightbox, type LightboxImage } from "@/components/ui/ImageLightbox";

type CertificateThumbProps = { image: LightboxImage };

/** Certificate thumbnail (fixed aspect ratio from the real file); click opens the lightbox. */
export function CertificateThumb({ image }: CertificateThumbProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full max-w-[360px] overflow-hidden rounded-md border border-border"
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 360px, 90vw"
          className="object-cover transition-transform duration-[400ms] ease-out-expo group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
        <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-sm bg-background/85 px-2 py-1 text-mono-xs text-foreground">
          <Expand aria-hidden="true" className="size-3.5" />
          Ampliar
        </span>
      </button>
      <ImageLightbox
        image={open ? image : null}
        onClose={() => {
          setOpen(false);
          buttonRef.current?.focus();
        }}
      />
    </>
  );
}
