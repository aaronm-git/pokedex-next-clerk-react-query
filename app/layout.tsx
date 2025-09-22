import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Press_Start_2P, Jersey_15_Charted } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start-2p",
  subsets: ["latin"],
});

const jersey15Charted = Jersey_15_Charted({
  weight: "400",
  variable: "--font-jersey-15-charted",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex | React Next.js Clerk MongoDB",
  description: "Pokédex App - Built with Next.js and Clerk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="">
        <head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body
          className={`${pressStart2P.variable} ${jersey15Charted.variable} antialiased relative`}
        >
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
