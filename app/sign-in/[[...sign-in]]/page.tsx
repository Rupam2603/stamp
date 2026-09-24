import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import DirectFastLogin from "@/components/DirectFastLogin";

export default function SignInPage() {
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
          Sign In to Your Digital Pass
        </h1>
        <p className="muted" style={{ fontSize: "0.88rem", maxWidth: "420px", margin: "0 auto" }}>
          Access your digital stamp progress, active rewards, and member benefits.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Direct Fast Login for Existing Customers - Zero Email Verification Links Required */}
        <DirectFastLogin redirectUrl="/activate" />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "20px 0",
            color: "#94a3b8",
            fontSize: "0.76rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          <span style={{ padding: "0 12px" }}>Or 1-Click Google / Password</span>
          <span style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <SignIn fallbackRedirectUrl="/activate" />
        </div>
      </div>

      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <Link href="/" style={{ color: "#94a3b8", fontSize: "0.84rem", textDecoration: "none" }}>
          ← Back to BHAAR MOSHAI Home
        </Link>
      </div>
    </main>
  );
}
