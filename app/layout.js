import "./globals.css";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import AdManager from "@/components/AdManager";
import CatExpertAI from "@/components/CatExpertAI";

const outfit = Outfit({ subsets: ["latin"] });
export const metadata = {
  title: "CatUniverse | The Ultimate Guide to Feline Royalty",
  description: "Explore cat breeds, history, behavior, and health tips. The most comprehensive resource for cat lovers featuring a name generator, product guides, and more.",
  keywords: "cats, cat breeds, cat behavior, cat health, cat history, cat name generator, cat supplies",
  authors: [{ name: "CatUniverse Team" }],
  openGraph: {
    title: "CatUniverse | Everything About Cats",
    description: "Your one-stop guide for everything feline.",
    url: "https://catuniverse.com",
    siteName: "CatUniverse",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <AuthProvider>
          <AdManager />
          <Navbar />
          <main>{children}</main>
          <CatExpertAI />
          <footer className="footer">
            <p>&copy; 2026 CatUniverse. Crafted for Cat Lovers.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
