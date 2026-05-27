import { AppProvider } from "@/context/AppContext";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Her-Ajo",
  description: "Sovereign privacy dollar savings infrastructure",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#03000a] text-zinc-100 antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
