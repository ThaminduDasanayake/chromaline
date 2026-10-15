import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chromaline · Tactile Line-Art Components for Modern React",
  description:
    "Vibrant, tactile line-art components and isometric figures with customizable colorways. Built for React, Next.js, and shadcn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light bg-white" style={{ colorScheme: "light" }}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-slate-200">
        {children}
      </body>
    </html>
  );
}
