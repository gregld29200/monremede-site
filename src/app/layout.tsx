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
  description: "Découvrez la naturopathie avec Oum Soumayya : livre 'La Santé dans l'assiette - 30 jours pour guérir naturellement', consultations en ligne personnalisées, articles et recettes santé.",
  metadataBase: new URL('https://www.monremede.com'),
  openGraph: {
    title: "Mon Remède - La Santé dans l'assiette",
    description: "Découvrez la naturopathie avec Oum Soumayya : livre, consultations en ligne personnalisées, articles et recettes santé.",
    siteName: "Mon Remède",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/Hero.png",
        width: 1200,
        height: 630,
        alt: "Mon Remède - Naturopathie avec Oum Soumayya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon Remède - La Santé dans l'assiette",
    description: "Découvrez la naturopathie avec Oum Soumayya : livre, consultations et recettes santé.",
    images: ["/images/Hero.png"],
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-forest focus:text-cream focus:px-4 focus:py-2 focus:rounded"
        >
          Aller au contenu principal
        </a>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
