import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TripCraft — AI Family Trip Planner",
  description: "AI-powered family itineraries with nap optimization, hidden gems, and real budget estimates. Plan your perfect family trip in 30 seconds.",
  openGraph: {
    title: "TripCraft — AI Family Trip Planner",
    description: "Plan your perfect family trip in 30 seconds with AI-powered itineraries.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
