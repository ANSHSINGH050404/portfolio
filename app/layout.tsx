import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Ansh Singh — Full-Stack & Agentic AI Engineer",
    template: "%s · Ansh Singh",
  },
  description:
    "Final-year CS student building production AI products. Full-stack developer specializing in agentic systems, Next.js, and scalable backends.",
  keywords: [
    "Ansh Singh",
    "Full-Stack Developer",
    "Agentic AI",
    "Next.js",
    "Portfolio",
    "LangChain",
    "TypeScript",
  ],
  authors: [{ name: "Ansh Kumar Singh" }],
  creator: "Ansh Kumar Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Ansh Singh — Full-Stack & Agentic AI Engineer",
    description:
      "I build scalable APIs, multi-step LLM workflows, and production-ready AI applications end-to-end.",
    siteName: "Ansh Singh Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ansh Singh — Full-Stack & Agentic AI Engineer",
    description:
      "I build scalable APIs, multi-step LLM workflows, and production-ready AI applications end-to-end.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
