import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chromaline · Line-Art Components for Modern React",
  description:
    "Vibrant line-art components and isometric figures with customizable colorways. Built for React, Next.js, and shadcn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light bg-white" style={{ colorScheme: "light" }}>
      <body className="flex min-h-full flex-col bg-white font-sans text-slate-900 antialiased selection:bg-slate-200">
        {children}
      </body>
    </html>
  );
}
