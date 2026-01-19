import "./globals.css";
import { Outfit } from "next/font/google";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "CatUniverse | Everything About Cats",
  description: "Explore the fascinating world of cats, from history and breeds to behavior and premium products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {/* Adsterra Script Placement - Example */}
        <Script id="adsterra-script" strategy="afterInteractive">
          {`
            // Placeholder for Adsterra integration script
            // console.log("Adsterra Script Ready");
          `}
        </Script>
        <header className="main-header">
          <nav className="nav-container">
            <div className="logo">Cat<span>Universe</span></div>
            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/history">History</a></li>
              <li><a href="/breeds">Breeds</a></li>
              <li><a href="/behavior">Behavior</a></li>
              <li><a href="/shop">Shop</a></li>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <p>&copy; 2026 CatUniverse. Crafted for Cat Lovers.</p>
        </footer>
      </body>
    </html>
  );
}
