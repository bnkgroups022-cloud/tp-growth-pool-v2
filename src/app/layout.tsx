import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TP Growth Pool",
  description: "TP Growth Pool v2.0 — member platform for Trading Point.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
