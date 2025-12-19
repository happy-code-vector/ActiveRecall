"use client";

import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

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
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
