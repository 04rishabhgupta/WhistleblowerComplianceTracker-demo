import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "TARI Ethics | Whistleblower & Compliance Platform",
  description: "Internal Case Management Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body>
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
