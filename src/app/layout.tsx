import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AgentInteract from '@/components/AgentInteract';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KOSU",
  description: "Revolutionizing Hackathons",
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
      <Header/>
        {children}
      </body>
      <div className="container mx-auto py-8">

 <h1 className="text-2xl font-bold mb-6">AI Agent Dashboard</h1>

<AgentInteract />

</div>
    </html>
  );
}
