import type { Metadata } from "next";
import { Outfit, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "N&N Poultry Palace — Fresh Eggs, Manure & Ex-Layer Hens in Machakos",
    template: "%s — N&N Poultry Palace",
  },
  description:
    "Fresh and Nutritious — your trusted source for farm-fresh eggs in Machakos. Collected at 2 PM, packed by 5 PM, on your doorstep before noon.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-dark font-display">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
