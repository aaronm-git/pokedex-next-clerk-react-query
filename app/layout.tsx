import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Press_Start_2P, Jersey_15_Charted } from "next/font/google";
import "./globals.css";
import DevTools from "@/components/web/DevTools";

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
  title: "Pokedex",
  description: "Pokedex App - Built with Next.js and Clerk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${pressStart2P.variable} ${jersey15Charted.variable} antialiased relative`}
        >
          <main>{children}</main>
          {/* <DevTools /> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
