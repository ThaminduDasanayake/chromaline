import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('chromaline-theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&p)){document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-white font-sans text-slate-900 antialiased transition-colors duration-200 selection:bg-slate-200 dark:bg-[#09090b] dark:text-zinc-100 dark:selection:bg-zinc-800">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
