import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Her-Ajo",
  description: "Sovereign freedom-tech dollar savings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
