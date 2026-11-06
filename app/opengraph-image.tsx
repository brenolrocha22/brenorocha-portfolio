import { ImageResponse } from "next/og";
import { readPortraitDataUri } from "@/lib/content/portrait";
import { getProfile } from "@/lib/content/profile";
import { ogColors, ogGridBackground, ogSize } from "@/lib/seo/og";

export const alt = "Breno Rocha: Analista de Dados Júnior, também Desenvolvedor Júnior";
export const size = ogSize;
export const contentType = "image/png";

const PHOTO_SIZE = 420;

/**
 * Site OG image (D22 palette). With public/images/breno.jpg present, the photo sits on the
 * right under a blue veil (Satori has no CSS filters/blend modes); without it,
 * the "BR" monogram stays next to the location line.
 */
export default async function OpengraphImage() {
  const profile = getProfile();
  const photo = await readPortraitDataUri();
  // profile.headline = "Analista de Dados Júnior · também Desenvolvedor Júnior"
  const [role = profile.shortName, alsoRole] = (profile.headline ?? "").split(" · ");

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
          backgroundColor: ogColors.bg,
          backgroundImage: `${ogColors.glow}, ${ogGridBackground.backgroundImage}`,
          backgroundSize: `100% 100%, ${ogGridBackground.backgroundSize}`,
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
            <div style={{ display: "flex", fontSize: photo ? 40 : 44, color: ogColors.accent }}>
              {role}
            </div>
            {alsoRole ? <div style={{ display: "flex", fontSize: 28, color: ogColors.muted }}>{alsoRole}</div> : null}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {["SQL", "Python", "Power BI", "Excel"].map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: `1px solid ${ogColors.border}`,
                    background: ogColors.surface,
                    fontSize: 24,
                    color: ogColors.text,
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", height: 4, width: 120, background: ogColors.accent, borderRadius: 2 }} />
        </div>

        {photo ? (
          <div style={{ display: "flex", position: "relative", width: PHOTO_SIZE, height: PHOTO_SIZE }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> only */}
            <img
              src={photo}
              alt=""
              width={PHOTO_SIZE}
              height={PHOTO_SIZE}
              style={{ width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: 8, objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: PHOTO_SIZE,
                height: PHOTO_SIZE,
                display: "flex",
                borderRadius: 8,
                background: ogColors.photoTint,
                border: `2px solid ${ogColors.accentLine}`,
              }}
            />
          </div>
        ) : null}
      </div>
    ),
    size,
  );
}
