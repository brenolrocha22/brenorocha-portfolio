import { ImageResponse } from "next/og";
import { readPortraitDataUri } from "@/lib/content/portrait";
import { getProfile } from "@/lib/content/profile";
import { ogColors, ogGridBackground, ogSize } from "@/lib/seo/og";

export const alt = "Breno Rocha: dados e IA generativa com Python";
export const size = ogSize;
export const contentType = "image/png";

const PHOTO_SIZE = 420;

/**
 * Site OG image (design-refresh §4.4). With public/images/breno.jpg present, the photo
 * (in color: Satori does not apply CSS filters reliably) sits on the right; without it,
 * the "BR" monogram stays next to the location line.
 */
export default async function OpengraphImage() {
  const profile = getProfile();
  const photo = await readPortraitDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 48,
          padding: 72,
          background: ogColors.bg,
          ...ogGridBackground,
          color: ogColors.text,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {photo ? null : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 72,
                  height: 72,
                  borderRadius: 12,
                  background: ogColors.surface2,
                  border: `2px solid ${ogColors.accentLine}`,
                  fontSize: 30,
                }}
              >
                BR
              </div>
            )}
            <div style={{ display: "flex", fontSize: 22, color: ogColors.muted, letterSpacing: 2 }}>
              {`${profile.location.toUpperCase()} · DISPONÍVEL`}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", fontSize: 80, lineHeight: 1.05 }}>{profile.shortName}</div>
            {profile.headline ? (
              <div style={{ display: "flex", fontSize: photo ? 36 : 40, color: ogColors.accent }}>
                {profile.headline}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                fontSize: photo ? 30 : 32,
                color: ogColors.muted,
                maxWidth: photo ? 640 : 1000,
                lineHeight: 1.3,
              }}
            >
              {profile.tagline}
            </div>
          </div>

          <div style={{ display: "flex", height: 4, width: 120, background: ogColors.accent, borderRadius: 2 }} />
        </div>

        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> only
          <img
            src={photo}
            alt=""
            width={PHOTO_SIZE}
            height={PHOTO_SIZE}
            style={{
              width: PHOTO_SIZE,
              height: PHOTO_SIZE,
              borderRadius: 12,
              border: `2px solid ${ogColors.accentLine}`,
              objectFit: "cover",
            }}
          />
        ) : null}
      </div>
    ),
    size,
  );
}
