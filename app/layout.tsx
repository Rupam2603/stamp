import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "BHAAR MOSHAI | চায়ের আড্ডার ঠিকানা · Authentic Clay Chai & Loyalty Rewards",
  description:
    "Welcome to BHAAR MOSHAI (ভাঁড় মশাই) — Experience authentic Kolkata clay-cup chai, delicious hot snacks, and rewarding tea adda. Collect digital stamps and unlock royal treats.",
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
      <body>
        <ClerkProvider>
          <div className="shell">
            <header className="nav-header">
              <div className="nav-container">
                <Link className="brand-link" href="/">
                  <div className="brand-logo-frame">
                    <Image
                      src="/logo.png"
                      alt="BHAAR MOSHAI Logo"
                      width={44}
                      height={44}
                      priority
                    />
                  </div>
                  <div className="brand-meta">
                    <span className="brand-title">BHAAR MOSHAI</span>
                    <span className="brand-bengali">ভাঁড় মশাই · চায়ের আড্ডা</span>
                  </div>
                </Link>

                <nav className="nav-links">
                  <Link className="nav-item" href="/activate">
                    Activate Card
                  </Link>
                  <Link className="nav-item" href="/loyalty">
                    My Loyalty
                  </Link>
                  <Link className="nav-item" href="/offers">
                    Offers
                  </Link>

                  <div className="auth-controls">
                    <Show when="signed-out">
                      <SignInButton mode="modal">
                        <button className="auth-btn-ghost">Sign In</button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="auth-btn-primary">Join Club</button>
                      </SignUpButton>
                    </Show>
                    <Show when="signed-in">
                      <UserButton />
                    </Show>
                  </div>
                </nav>
              </div>
            </header>

            <main>{children}</main>

            <footer className="site-footer">
              <div className="footer-container">
                <div className="footer-brand">
                  <div className="footer-logo-row">
                    <div className="footer-logo-frame">
                      <Image
                        src="/logo.png"
                        alt="BHAAR MOSHAI Logo"
                        width={38}
                        height={38}
                      />
                    </div>
                    <div>
                      <div className="footer-brand-name">BHAAR MOSHAI</div>
                      <div className="footer-tagline">— চায়ের আড্ডার ঠিকানা —</div>
                    </div>
                  </div>
                  <p className="footer-desc">
                    Serving pure heritage in every earthen cup. Where conversations flow, friendships brew, and every clay-cup visit is rewarded with loyalty treats.
                  </p>
                </div>

                <div>
                  <div className="footer-col-title">Tea Club & Rewards</div>
                  <ul className="footer-nav-list">
                    <li><Link href="/activate">Activate Digital Card</Link></li>
                    <li><Link href="/loyalty">Check My Stamps</Link></li>
                    <li><Link href="/offers">Special Adda Offers</Link></li>
                    <li><Link href="/verify">Verify Mobile Pass</Link></li>
                  </ul>
                </div>

                <div>
                  <div className="footer-col-title">Cafe & Adda Hours</div>
                  <ul className="footer-nav-list">
                    <li><span>Sunday – Saturday: 5:00 PM – 11:00 PM</span></li>
                    <li><span>Evening Adda Hours: 5:00 PM – 11:00 PM</span></li>
                    <li><span>Hot Singara & Snacks: Fresh every evening</span></li>
                    <li><span>Kolkata, West Bengal</span></li>
                  </ul>
                </div>
              </div>

              <div className="footer-bottom-row">
                <div>
                  © {new Date().getFullYear()} <strong>BHAAR MOSHAI</strong> (ভাঁড় মশাই). All rights reserved.
                </div>
                <div className="footer-tagline">
                  মাটির ভাঁড়ের খাঁটি চা · অরিজিনাল আড্ডা
                </div>
              </div>
            </footer>
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}