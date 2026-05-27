import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Her-Ajo",
  description: "Financial empowerment for women",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
