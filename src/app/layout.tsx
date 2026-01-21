import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Lora, Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-admin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mon Remède - La Santé dans l'assiette",
  description: "30 jours pour guérir naturellement. Naturopathie et consultations en ligne avec Oum Soumayya.",
  metadataBase: new URL('https://monremede.com'),
  openGraph: {
    title: "Mon Remède - La Santé dans l'assiette",
    description: "30 jours pour guérir naturellement. Naturopathie et consultations en ligne avec Oum Soumayya.",
    siteName: "Mon Remède",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon Remède - La Santé dans l'assiette",
    description: "30 jours pour guérir naturellement. Naturopathie et consultations en ligne.",
  },
  other: {
    "theme-color": "#2D4A3E",
    "msapplication-TileColor": "#f7f4ed",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION_ID,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${playfairDisplay.variable} ${cormorantGaramond.variable} ${lora.variable} ${inter.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
