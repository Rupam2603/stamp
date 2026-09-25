import Link from 'next/link';
import Image from 'next/image';
import StampSimulator from '../components/StampSimulator';

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-wrapper">
        <div className="hero-grid">
          <div>
            <div className="hero-badge-tag">
              <span className="hero-badge-dot"></span>
              <span>BHAAR MOSHAI · চায়ের আড্ডার ঠিকানা · Sun – Sat: 5:00 PM – 11:00 PM</span>
            </div>

            <h1 className="hero-headline">
              Every Sip of Bhar Chai, Deserves a{' '}
              <span className="hero-gradient-text">Royal Reward</span>.
            </h1>

            <p className="hero-subtext">
              Step into <strong>BHAAR MOSHAI (ভাঁড় মশাই)</strong> for authentic Bengali-style earthen-pot tea, steaming snacks, and endless adda. Collect 3 digital stamps every time you visit, and unlock exiting offers on the 3rd visit — card automatically resets for your next rewards!
            </p>

            <div className="hero-cta-group">
              <Link className="btn-primary" href="/activate">
                <span>🍵</span>
                <span>Activate Your Digital Card</span>
              </Link>
              <Link className="btn-secondary" href="/offers">
                <span>✨</span>
                <span>Explore Adda Offers</span>
              </Link>
            </div>

            <div className="hero-perks">
              <div className="perk-item">
                <div className="perk-icon-wrap">⏰</div>
                <span>Sun – Sat: 5 PM – 11 PM</span>
              </div>
              <div className="perk-item">
                <div className="perk-icon-wrap">☕</div>
                <span>Min ₹50 = 1 Stamp</span>
              </div>
              <div className="perk-item">
                <div className="perk-icon-wrap">🎁</div>
                <span>Get exiting Offers on 3rd visit</span>
              </div>
              <div className="perk-item">
                <div className="perk-icon-wrap">🍪</div>
                <span>Surprise Snack Drops</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-card">
            <div className="logo-showcase-box">
              <div className="hero-main-logo">
                <Image
                  src="/logo.png"
                  alt="BHAAR MOSHAI - ভাঁড় মশাই Logo"
                  width={220}
                  height={220}
                  priority
                />
              </div>
              <h2 className="showcase-title">BHAAR MOSHAI</h2>
              <div className="showcase-bengali-tagline">— চায়ের আড্ডার ঠিকানা —</div>
              <p className="showcase-sub">
                Handcrafted Clay-Cup Chai, Golden Bengali Snacks & Digital Rewards for true tea lovers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE STAMP CARD SIMULATOR */}
      <section className="main-section" style={{ paddingTop: 20 }}>
        <div className="section-header">
          <span className="section-label">LIVE INTERACTIVE PREVIEW</span>
          <h2 className="section-title">See How Your Digital Pass Works</h2>
          <p className="section-desc">
            Tap the button or stamps below to test how your digital loyalty card updates when you visit BHAAR MOSHAI.
          </p>
        </div>

        <StampSimulator />
      </section>

      {/* CORE EXPERIENCE / FEATURES */}
      <section className="main-section">
        <div className="section-header">
          <span className="section-label">WHY YOU&apos;LL LOVE BHAAR MOSHAI</span>
          <h2 className="section-title">Authentic Flavors, Seamless Rewards</h2>
          <p className="section-desc">
            We blend Bengali's timeless adda culture with effortless digital rewards designed around your daily chai cravings.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-badge">🏺</div>
            <h3 className="feature-title">Authentic Clay Cups</h3>
            <div className="feature-bengali-label">মাটির খাঁটি ভাঁড়ের সোঁদা গন্ধ</div>
            <p className="feature-desc">
              Every brew is poured fresh into handmade terracotta cups (মাটির ভাঁড়) that release an unforgettable earthy aroma with every hot sip.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge">📲</div>
            <h3 className="feature-title">Digital Stamp Pass</h3>
            <div className="feature-bengali-label">ফোন নম্বর বললেই স্ট্যাম্প যোগ</div>
            <p className="feature-desc">
              No paper cards or bulky apps. Just share your mobile number at the counter to collect stamps instantly on your phone.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge">🍪</div>
            <h3 className="feature-title">Edible Tea Cups</h3>
            <div className="feature-bengali-label">বিস্কুটের চায়ের কাপ</div>
            <p className="feature-desc">
              Enjoy our signature hot chai in delicious biscuit cups that you can eat! Zero waste and perfectly paired with your tea.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-badge">🌆</div>
            <h3 className="feature-title">Evening Adda Perks</h3>
            <div className="feature-bengali-label">সন্ধ্যার আড্ডায় স্পেশাল মেম্বার ডিসকাউন্ট</div>
            <p className="feature-desc">
              Members enjoy special happy hour pricing between 4:30 PM and 8:30 PM, bonus stamps on snack combos, and early taste-tests of new blends.
            </p>
          </div>
        </div>
      </section>

      {/* POPULAR MENU SHOWCASE */}
      <section className="main-section" style={{ background: 'rgba(20, 24, 34, 0.4)', borderRadius: '32px', margin: '40px auto' }}>
        <div className="section-header">
          <span className="section-label">FAVOURITE BREWS & TREATS</span>
          <h2 className="section-title">What Locals Sip & Crunch On</h2>
          <p className="section-desc">
            Pair your daily adda with our signature handcrafted tea and classic Kolkata accompaniments.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>☕</span>
              <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
                1 STAMP
              </span>
            </div>
            <h3 className="feature-title">Special Bhar Masala Chai</h3>
            <div className="feature-bengali-label">স্পেশাল মসলা চা</div>
            <p className="feature-desc">
              Slow-cooked black tea infused with crushed cardamom, ginger, cloves, and whole milk in a traditional bhar.
            </p>
          </div>

          <div className="feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>🍵</span>
              <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
                1 STAMP
              </span>
            </div>
            <h3 className="feature-title">Royal Kesar Malai Chai</h3>
            <div className="feature-bengali-label">কেশর মালাই চা</div>
            <p className="feature-desc">
              Rich saffron strands with thick cream floated on top of a piping-hot clay cup. A customer favourite!
            </p>
          </div>

          <div className="feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>🥟</span>
              <span style={{ background: 'rgba(217,83,41,0.15)', color: '#d95329', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
                2 STAMPS
              </span>
            </div>
            <h3 className="feature-title">Kolkata Khasta Singara</h3>
            <div className="feature-bengali-label">গরম খাস্তা সিঙাড়া</div>
            <p className="feature-desc">
              Flaky, crispy pastry loaded with spiced cauliflower, potatoes, and peanuts served with tangy tamarind chutney.
            </p>
          </div>

          <div className="feature-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '1.8rem' }}>🍞</span>
              <span style={{ background: 'rgba(217,83,41,0.15)', color: '#d95329', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
                2 STAMPS
              </span>
            </div>
            <h3 className="feature-title">Kolkata Bun Maska & Malai</h3>
            <div className="feature-bengali-label">বন বাটার ও মালাই টোস্ট</div>
            <p className="feature-desc">
              Fresh pillowy bakery bun generously slathered with Amul butter or sweetened fresh malai, dipped into hot bhar chai.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="main-section">
        <div className="section-header">
          <span className="section-label">HOW IT WORKS</span>
          <h2 className="section-title">Start Rewarding Your Visits in Seconds</h2>
          <p className="section-desc">
            Three simple steps to never miss out on free tea and exclusive treats.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card" style={{ textAlign: 'center', alignItems: 'center' }}>
            <div className="feature-icon-badge" style={{ margin: '0 auto 18px' }}>1</div>
            <h3 className="feature-title">Activate Online</h3>
            <p className="feature-desc">
              Enter your mobile number and name in 30 seconds. Your digital loyalty wallet is created instantly.
            </p>
          </div>

          <div className="feature-card" style={{ textAlign: 'center', alignItems: 'center' }}>
            <div className="feature-icon-badge" style={{ margin: '0 auto 18px' }}>2</div>
            <h3 className="feature-title">Mention Your Phone</h3>
            <p className="feature-desc">
              When ordering your chai and snacks (min ₹50 spend) at the counter, tell the cashier your number. Stamps sync automatically.
            </p>
          </div>

          <div className="feature-card" style={{ textAlign: 'center', alignItems: 'center' }}>
            <div className="feature-icon-badge" style={{ margin: '0 auto 18px' }}>3</div>
            <h3 className="feature-title">Enjoy Free Bhar Chai</h3>
            <p className="feature-desc">
              Hit 3 stamps and claim your free hot bhar tea or delicious snack. Card automatically resets for endless reward cycles!
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="main-section" style={{ paddingBottom: 100 }}>
        <div
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, #2b1c16 0%, #151822 80%, #0c0e12 100%)',
            border: '1px solid var(--border-highlight)',
            borderRadius: '30px',
            padding: '50px 30px',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🍵✨</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#ffffff', fontWeight: 900, margin: '0 0 16px' }}>
              Ready for Your Next Cup of Bhar Chai?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 30 }}>
              Join hundreds of tea and adda enthusiasts at <strong>BHAAR MOSHAI (ভাঁড় মশাই)</strong>. Activate your digital loyalty card today and enjoy a welcome surprise on your first visit!
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="btn-primary" href="/activate">
                Activate My Card Now →
              </Link>
              <Link className="btn-secondary" href="/offers">
                View Today&apos;s Offers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
