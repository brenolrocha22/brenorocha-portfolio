import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { BackToTop } from "@/components/chrome/BackToTop";
import { ContactFab } from "@/components/chrome/ContactFab";
import { Footer } from "@/components/chrome/Footer";
import { Header } from "@/components/chrome/Header";
import { ScrollBackdrop } from "@/components/chrome/ScrollBackdrop";
import { SectionRail } from "@/components/chrome/SectionRail";
import { SkipLink } from "@/components/layout/SkipLink";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { getProfile } from "@/lib/content/profile";
import { isIndexable, siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  // D22: display face for the hero name (Home H1/LCP) and section titles.
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: "%s | Breno Rocha",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: "Breno Lins Rocha" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  // Previews and local builds: noindex also in the meta tag (robots.txt alone does not deindex).
  robots: isIndexable ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#060b18",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = getProfile();

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="flex min-h-dvh flex-col font-sans">
        {/* Without JS, motion reveals stay visible (motion-system §7). */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <MotionProvider>
          <ScrollBackdrop />
          <SkipLink />
          <Header />
          <main
            id="conteudo"
            tabIndex={-1}
            className="flex-1 pt-(--header-height) pb-24 focus:outline-none lg:pb-0"
          >
            {children}
          </main>
          <Footer />
          <SectionRail />
          <BackToTop />
          <ContactFab email={profile.email} linkedin={profile.linkedin} github={profile.github} />
        </MotionProvider>
      </body>
    </html>
  );
}
