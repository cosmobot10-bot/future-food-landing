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
  title: "JewberEats | Eat for cheap like a member of the tribe",
  description:
    "JewberEats: low prices, loaded plates, and meals that feel basically free.",
  openGraph: {
    title: "JewberEats",
    description:
      "Low prices, loaded plates, and meals that feel basically free. Join now for early access.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JewberEats",
    description:
      "Low prices, loaded plates, and meals that feel basically free. Join now for early access.",
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
