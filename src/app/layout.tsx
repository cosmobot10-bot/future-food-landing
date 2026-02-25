import type { Metadata } from "next";
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
  title: "Future Food Club | The future of not paying for food is here",
  description:
    "Join Future Food Club and unlock premium meals through community missions, city drops, and partner venues.",
  openGraph: {
    title: "Future Food Club",
    description:
      "The future of not paying for food is here. Join now for early member access.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Future Food Club",
    description:
      "The future of not paying for food is here. Join now for early access.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
