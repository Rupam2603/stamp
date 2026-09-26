import Link from 'next/link';
import Image from 'next/image';
import { Coffee, Sparkles, Clock, Gift, Cookie, Smartphone, Sunset, Croissant, Sandwich, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-wrapper">
        <div className="hero-grid">
          <div>
            <div className="hero-badge-tag animate-fade-up">
              <span className="hero-badge-dot"></span>
              <span>BHAAR MOSHAI · Sun – Sat: 5:00 PM – 11:00 PM</span>
            </div>

            <h1 className="hero-headline animate-fade-up delay-100">
              Every Sip of Bhar Chai, Deserves a{' '}
              <strong>Royal Reward</strong>.
            </h1>

            <p className="hero-subtext animate-fade-up delay-200">
              Step into <strong>BHAAR MOSHAI (ভাঁড় মশাই)</strong> for authentic Bengali-style earthen-pot tea, steaming snacks, and endless adda. Collect 3 digital stamps every time you visit, and unlock exiting offers on the 3rd visit.
            </p>

            <div className="hero-cta-group animate-fade-up delay-300">
              <Link className="btn btn-primary" href="/activate">
                <Coffee size={18} />
                <span>Activate Digital Card</span>
              </Link>
              <Link className="btn btn-secondary" href="/offers">
                <span>Explore Offers</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="hero-perks animate-fade-up delay-400" style={{ display: 'flex', gap: '24px', marginTop: '40px', borderTop: '1px solid var(--border-subtle)', paddingTop: '32px' }}>
              <div className="perk-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="perk-icon-wrap" style={{ color: 'var(--text-secondary)' }}><Coffee size={20} /></div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Min ₹50 = 1 Stamp</span>
              </div>
              <div className="perk-item" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="perk-icon-wrap" style={{ color: 'var(--text-secondary)' }}><Gift size={20} /></div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Rewards on 3rd visit</span>
              </div>
            </div>
          </div>

          <div className="hero-visual-card animate-fade-up delay-200">
            <div className="logo-showcase-box">
              <div className="hero-main-logo">
                <Image
                  src="/logo.png"
                  alt="BHAAR MOSHAI - ভাঁড় মশাই Logo"
                  width={300}
                  height={300}
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE EXPERIENCE / FEATURES */}
      <section className="main-section">
        <div className="section-header animate-fade-up">
          <span className="section-label">Why You&apos;ll Love It</span>
          <h2 className="section-title">Authentic Flavors, Seamless Rewards</h2>
          <p className="section-desc" style={{ color: 'var(--text-secondary)' }}>
            We blend Bengali's timeless adda culture with effortless digital rewards designed around your daily chai cravings.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card animate-fade-up delay-100">
            <div className="feature-icon-badge"><Coffee size={24} /></div>
            <h3 className="feature-title">Authentic Clay Cups</h3>
            <div className="feature-bengali-label">মাটির খাঁটি ভাঁড়ের সোঁদা গন্ধ</div>
            <p className="feature-desc">
              Every brew is poured fresh into handmade terracotta cups (মাটির ভাঁড়) that release an unforgettable earthy aroma with every hot sip.
            </p>
          </div>

          <div className="feature-card animate-fade-up delay-200">
            <div className="feature-icon-badge"><Smartphone size={24} /></div>
            <h3 className="feature-title">Digital Stamp Pass</h3>
            <div className="feature-bengali-label">ফোন নম্বর বললেই স্ট্যাম্প যোগ</div>
            <p className="feature-desc">
              No paper cards or bulky apps. Just share your mobile number at the counter to collect stamps instantly on your phone.
            </p>
          </div>

          <div className="feature-card animate-fade-up delay-300">
            <div className="feature-icon-badge"><Cookie size={24} /></div>
            <h3 className="feature-title">Edible Tea Cups</h3>
            <div className="feature-bengali-label">বিস্কুটের চায়ের কাপ</div>
            <p className="feature-desc">
              Enjoy our signature hot chai in delicious biscuit cups that you can eat! Zero waste and perfectly paired with your tea.
            </p>
          </div>

          <div className="feature-card animate-fade-up delay-400">
            <div className="feature-icon-badge"><Sunset size={24} /></div>
            <h3 className="feature-title">Evening Adda Perks</h3>
            <div className="feature-bengali-label">সন্ধ্যার আড্ডায় স্পেশাল মেম্বার ডিসকাউন্ট</div>
            <p className="feature-desc">
              Members enjoy special happy hour pricing between 4:30 PM and 8:30 PM, bonus stamps on snack combos, and early taste-tests of new blends.
            </p>
          </div>
        </div>
      </section>

      {/* POPULAR MENU SHOWCASE */}
      <section className="main-section animate-fade-up" style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', margin: '40px auto' }}>
        <div className="section-header">
          <span className="section-label">Favourite Brews & Treats</span>
          <h2 className="section-title">What Locals Sip & Crunch On</h2>
          <p className="section-desc" style={{ color: 'var(--text-secondary)' }}>
            Pair your daily adda with our signature handcrafted tea and classic Kolkata accompaniments.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card" style={{ background: 'var(--bg-base)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ color: 'var(--text-secondary)' }}><Coffee size={28} /></span>
              <span style={{ border: '1px solid var(--border-medium)', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                1 STAMP
              </span>
            </div>
            <h3 className="feature-title">Special Bhar Masala Chai</h3>
            <div className="feature-bengali-label">স্পেশাল মসলা চা</div>
            <p className="feature-desc">
              Slow-cooked black tea infused with crushed cardamom, ginger, cloves, and whole milk in a traditional bhar.
            </p>
          </div>

          <div className="feature-card" style={{ background: 'var(--bg-base)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ color: 'var(--text-secondary)' }}><Coffee size={28} /></span>
              <span style={{ border: '1px solid var(--border-medium)', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                1 STAMP
              </span>
            </div>
            <h3 className="feature-title">Royal Kesar Malai Chai</h3>
            <div className="feature-bengali-label">কেশর মালাই চা</div>
            <p className="feature-desc">
              Rich saffron strands with thick cream floated on top of a piping-hot clay cup. A customer favourite!
            </p>
          </div>

          <div className="feature-card" style={{ background: 'var(--bg-base)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ color: 'var(--text-secondary)' }}><Croissant size={28} /></span>
              <span style={{ border: '1px solid var(--accent-terracotta)', background: 'var(--accent-terracotta-dim)', color: 'var(--accent-terracotta)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                2 STAMPS
              </span>
            </div>
            <h3 className="feature-title">Kolkata Khasta Singara</h3>
            <div className="feature-bengali-label">গরম খাস্তা সিঙাড়া</div>
            <p className="feature-desc">
              Flaky, crispy pastry loaded with spiced cauliflower, potatoes, and peanuts served with tangy tamarind chutney.
            </p>
          </div>

          <div className="feature-card" style={{ background: 'var(--bg-base)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ color: 'var(--text-secondary)' }}><Sandwich size={28} /></span>
              <span style={{ border: '1px solid var(--accent-terracotta)', background: 'var(--accent-terracotta-dim)', color: 'var(--accent-terracotta)', fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
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
      <section className="main-section animate-fade-up">
        <div className="section-header">
          <span className="section-label">How It Works</span>
          <h2 className="section-title">Start Rewarding Your Visits</h2>
          <p className="section-desc" style={{ color: 'var(--text-secondary)' }}>
            Three simple steps to never miss out on free tea and exclusive treats.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>01</div>
            <h3 className="feature-title">Activate Online</h3>
            <p className="feature-desc">
              Enter your mobile number and name in 30 seconds. Your digital loyalty wallet is created instantly.
            </p>
          </div>

          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>02</div>
            <h3 className="feature-title">Mention Your Phone</h3>
            <p className="feature-desc">
              When ordering your chai and snacks at the counter, tell the cashier your number. Stamps sync automatically.
            </p>
          </div>

          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)' }}>03</div>
            <h3 className="feature-title">Enjoy Free Bhar Chai</h3>
            <p className="feature-desc">
              Hit 3 stamps and claim your free hot bhar tea or delicious snack. Card automatically resets for endless rewards!
            </p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="main-section animate-fade-up delay-200" style={{ paddingBottom: 100 }}>
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '80px 40px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--text-primary)', margin: '0 0 16px', fontWeight: 400 }}>
              Ready for Your Next Cup?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 40 }}>
              Join hundreds of tea and adda enthusiasts at BHAAR MOSHAI (ভাঁড় মশাই). Activate your digital loyalty card today and enjoy a welcome surprise!
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" href="/activate">
                Activate My Card
              </Link>
              <Link className="btn btn-secondary" href="/offers">
                View Today&apos;s Offers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
