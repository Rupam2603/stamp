import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import NavHeader from "@/components/NavHeader";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "BHAAR MOSHAI | চায়ের আড্ডার ঠিকানা · Authentic Clay Chai & Loyalty Rewards",
  description:
    "Welcome to BHAAR MOSHAI (ভাঁড় মশাই) — Experience authentic Kolkata clay-cup chai, delicious hot snacks, and rewarding tea adda. Collect digital stamps and unlock royal treats.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${outfit.variable}`}>
          <div className="shell">
            <NavHeader />
            <main>{children}</main>

            <footer className="site-footer">
              <div className="footer-container">
                <div className="footer-brand">
                  <div className="footer-logo-row">
                    <div className="footer-logo-frame">
                      <img
                        src="/logo.png"
                        alt="BHAAR MOSHAI Logo"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <div className="footer-brand-name">BHAAR MOSHAI</div>
                      <div className="footer-tagline">— চায়ের আড্ডার ঠিকানা —</div>
                    </div>
                  </div>
                  <p className="footer-desc">
                    Serving pure heritage in every earthen cup. Where conversations flow, friendships brew, and every clay-cup visit is rewarded with loyalty treats.
                  </p>
                </div>

                <div>
                  <div className="footer-col-title">Tea Club &amp; Rewards</div>
                  <ul className="footer-nav-list">
                    <li><a href="/activate">Activate Digital Card</a></li>
                    <li><a href="/loyalty">Check My Stamps</a></li>
                    <li><a href="/offers">Special Adda Offers</a></li>
                    <li><a href="/verify">Verify Mobile Pass</a></li>
                  </ul>
                </div>

                <div>
                  <div className="footer-col-title">Cafe &amp; Adda Hours</div>
                  <ul className="footer-nav-list">
                    <li><span>Sunday – Saturday: 5:00 PM – 11:00 PM</span></li>
                    <li><span>Serampore, Hooghly, West Bengal</span></li>
                  </ul>
                </div>
              </div>

              <div className="footer-bottom">
                <div>
                  © {new Date().getFullYear()} <strong>BHAAR MOSHAI</strong>. All rights reserved.
                </div>
                <div className="muted">
                  মাটির ভাঁড়ের খাঁটি চা · অরিজিনাল আড্ডা
                </div>
              </div>
            </footer>
          </div>
      </body>
    </html>
  );
}