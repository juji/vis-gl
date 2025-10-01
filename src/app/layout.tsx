import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "sanitize.css";
import "sanitize.css/forms.css";
import "sanitize.css/typography.css";
import "sanitize.css/assets.css";
import "./globals.css";
import "sanitize.css/reduce-motion.css";

import Sidebar from "../components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vis.gl example",
  description: "Example of drawing google maps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="main-layout">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
