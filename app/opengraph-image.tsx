import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content/profile";
import { ogColors, ogSize } from "@/lib/seo/og";

export const alt = "Breno Rocha: dados e IA generativa com Python";
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  const profile = getProfile();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: ogColors.bg,
          backgroundImage: `radial-gradient(${ogColors.border} 1.5px, transparent 1.5px)`,
          backgroundSize: "28px 28px",
          color: ogColors.text,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 12,
              background: ogColors.surface2,
              border: "2px solid rgba(224,164,88,0.4)",
              fontSize: 30,
            }}
          >
            BR
          </div>
          <div style={{ display: "flex", fontSize: 26, color: ogColors.muted, letterSpacing: 2 }}>
            {profile.location.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 80, lineHeight: 1.05 }}>{profile.shortName}</div>
          {profile.headline ? (
            <div style={{ display: "flex", fontSize: 40, color: ogColors.accent }}>{profile.headline}</div>
          ) : null}
          <div style={{ display: "flex", fontSize: 32, color: ogColors.muted, maxWidth: 1000, lineHeight: 1.3 }}>
            {profile.tagline}
          </div>
        </div>

        <div style={{ display: "flex", height: 6, width: 160, background: ogColors.accent, borderRadius: 3 }} />
      </div>
    ),
    size,
  );
}
