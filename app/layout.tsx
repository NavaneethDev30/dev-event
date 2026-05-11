import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import NavBar from "@/components/NavBar";

const SchibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-Schibsted_Grotesk",
  subsets: ["latin"],
});

const MartianMono = Martian_Mono({
  variable: "--font-Martian-Mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for every Dev you shouldn't miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${SchibstedGrotesk.variable} ${MartianMono.variable} min-h-screen antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavBar/>
            <div className="absolute z-[-1] inset-0  ">
            <LightRays
              raysOrigin="top-center"
              raysColor="#59deca"
              raysSpeed={1}
              lightSpread={1}
              rayLength={3}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0}
              distortion={0}
              className="custom-rays"
              pulsating={false}
              fadeDistance={1}
              saturation={1}
          />
          </div>
          <main>
            {children}
          </main>
        </body>
    </html>
  );
}
