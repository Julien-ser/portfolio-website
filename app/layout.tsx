import type { Metadata } from "next";
import "./globals.css";
import { WindowManagerProvider } from "@/lib/windows/WindowManager";
import { ProcessRegistryProvider } from "@/lib/windows/processRegistry";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Portfolio Terminal",
  description: "Interactive terminal portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <WindowManagerProvider>
          <ProcessRegistryProvider>
            {children}
          </ProcessRegistryProvider>
        </WindowManagerProvider>
        <Analytics />
      </body>
    </html>
  );
}