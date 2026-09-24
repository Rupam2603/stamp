import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main
      className="main-section"
      style={{
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div
          style={{
            width: "58px",
            height: "58px",
            margin: "0 auto 12px",
            borderRadius: "16px",
            background: "#1c202d",
            border: "1px solid var(--border-highlight)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <Image
            src="/logo.png"
            alt="BHAAR MOSHAI Logo"
            width={46}
            height={46}
          />
        </div>
        <span className="section-label">BHAAR MOSHAI TEA CLUB</span>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "4px 0", color: "#ffffff" }}>
          Join the Club & Activate Pass
        </h1>
        <p className="muted" style={{ fontSize: "0.88rem", maxWidth: "420px", margin: "0 auto" }}>
          Create your account to activate your 3-stamp digital loyalty card and start earning royal treats.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <SignUp fallbackRedirectUrl="/activate" />
      </div>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <Link href="/" style={{ color: "#94a3b8", fontSize: "0.84rem", textDecoration: "none" }}>
          ← Back to BHAAR MOSHAI Home
        </Link>
      </div>
    </main>
  );
}
