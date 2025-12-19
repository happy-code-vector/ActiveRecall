"use client";

import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/AppContext";
import { GlobalModals } from "@/components/shared/GlobalModals";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Active Recall Learning App</title>
      </head>
      <body>
        <AppProvider>
          <div className="min-h-screen bg-[#121212] max-w-[480px] mx-auto relative">
            {children}
            <GlobalModals />
          </div>
          <Toaster richColors position="top-center" />
        </AppProvider>
      </body>
    </html>
  );
}
