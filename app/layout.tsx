import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Databuddy } from "@databuddy/sdk/react";
import { SITE } from "../constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s · Ansh Singh",
  },
  description: SITE.description,
  keywords: [
    "Ansh Singh",
    "Full-Stack Developer",
    "Agentic AI",
    "Next.js",
    "Portfolio",
    "LangChain",
    "TypeScript",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
    siteName: "Ansh Singh Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/**
 * Person schema, so search engines and answer engines can resolve who this
 * page is about and link it to the profiles that prove it. `sameAs` is the
 * part that matters — it ties the site to the GitHub, LinkedIn and X
 * accounts the work is actually published under.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  alternateName: SITE.shortName,
  url: SITE.url,
  jobTitle: "Full-Stack & Agentic AI Engineer",
  description: SITE.description,
  email: `mailto:${SITE.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.location,
  },
  knowsAbout: [
    "Agentic AI",
    "Large Language Models",
    "Next.js",
    "TypeScript",
    "Model Context Protocol",
    "Real-time applications",
    "PostgreSQL",
    "Redis",
  ],
  sameAs: [
    SITE.socials.github,
    SITE.socials.linkedin,
    SITE.socials.twitter,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          // Static, author-controlled object literal — no user input reaches it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Databuddy
          clientId={process.env.NEXT_PUBLIC_DATABUDDY_CLIENT_ID}
          trackWebVitals
          trackErrors
          trackOutgoingLinks
        />
        {children}
      </body>
    </html>
  );
}
