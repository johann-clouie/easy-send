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
  title: "Easy USDT BEP20 transaction online | Easy Send",
  description:
    "Send USDT on Binance Smart Chain (BEP20). Sign and broadcast Tether transfers easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] font-sans text-zinc-100 antialiased">
        <nav className="border-b border-zinc-800/80 bg-zinc-950/50 px-4 py-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <span className="text-lg font-semibold tracking-tight text-white">
              Easy Send
            </span>
            <span className="text-xs text-zinc-500">Multi-chain send</span>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
