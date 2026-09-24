import Link from 'next/link';
import Image from 'next/image';

const offersList = [
  {
    id: 1,
    tag: 'WELCOME TREAT',
    title: 'New Member Welcome Chai Drop',
    bengali: 'নতুন মেম্বারদের জন্য স্পেশাল উপহার',
    desc: 'Get a complimentary handmade Kolkata butter biscuit or cookie alongside your first steaming Bhar Chai.',
    code: 'BM-FIRSTCHAI',
    badge: 'Instant Unlock',
    highlight: true,
  },
  {
    id: 2,
    tag: 'EVENING ADDA HAPPY HOUR',
    title: 'Sunset Adda: 2nd Bhar at 50% Off',
    bengali: 'সন্ধ্যার আড্ডায় দ্বিতীয় ভাঁড়ে ৫০% ছাড়',
    desc: 'Between 5:00 PM and 11:00 PM daily, order any large clay cup of tea and get your second cup half price.',
    code: 'BM-ADDA50',
    badge: 'Daily 5:00 - 11:00 PM',
    highlight: false,
  },
  {
    id: 3,
    tag: 'COMBO SPECIAL',
    title: 'Chai & Hot Singara Adda Duo',
    bengali: 'চা ও গরম খাস্তা সিঙাড়া কম্বো',
    desc: 'Order 2 Special Masala Bhar Chai with 2 Kolkata Khasta Singaras and earn Double (+2) loyalty stamps!',
    code: 'BM-SINGARA2X',
    badge: 'Double Stamps',
    highlight: false,
  },
  {
    id: 4,
    tag: 'BIRTHDAY PERK',
    title: 'Royal Birthday Kesar Malai Chai',
    bengali: 'জন্মদিনে রয়্যাল কেশর মালাই চা ফ্রি',
    desc: 'Celebrate your special day at BHAAR MOSHAI. Show your registered ID to claim a free rich Kesar Malai cup.',
    code: 'BM-BDAYCHAI',
    badge: 'Member Exclusive',
    highlight: true,
  },
  {
    id: 5,
    tag: 'COLLEGE & YOUTH ADDA',
    title: 'Student & Workspace Adda Perk',
    bengali: 'স্টুডেন্টদের জন্য আনলিমিটেড আড্ডা ডিসকাউন্ট',
    desc: 'Show your college or university student ID for 10% flat off on all snacks, tea, and cookies all week long.',
    code: 'BM-STUDENT10',
    badge: 'Valid All Days',
    highlight: false,
  },
  {
    id: 6,
    tag: 'WEEKEND SPECIAL',
    title: 'Weekend Evening Bun Maska Fiesta',
    bengali: 'উইকেন্ডের সন্ধ্যার গরম মালাই টোস্ট ও চা',
    desc: 'Start your weekend evening with fluffy Bun Butter Maska + Kadak Elaichi Bhar at a special combo price of ₹49.',
    code: 'BM-WEEKNOW',
    badge: 'Sat & Sun 5 - 11 PM',
    highlight: false,
  },
];

export default function Offers() {
  return (
    <main className="main-section">
      <div className="section-header">
        <span className="section-label">EXCLUSIVE ADDA DEALS</span>
        <h1 className="section-title">BHAAR MOSHAI Offers</h1>
        <p className="section-desc">
          Special delights crafted for true tea lovers and Kolkata adda regulars. Flash your digital pass at the counter to claim these treats.
        </p>
      </div>

      <div className="feature-grid">
        {offersList.map((offer) => (
          <div
            key={offer.id}
            className="feature-card"
            style={{
              borderColor: offer.highlight ? 'var(--border-highlight)' : 'rgba(255,255,255,0.08)',
              background: offer.highlight
                ? 'radial-gradient(circle at 10% 10%, rgba(245, 158, 11, 0.1) 0%, rgba(22, 26, 35, 0.95) 100%)'
                : 'var(--bg-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {offer.tag}
              </span>
              <span style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>
                {offer.badge}
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 4px', lineHeight: 1.3 }}>
              {offer.title}
            </h2>
            <div style={{ fontSize: '0.86rem', color: '#f59e0b', fontWeight: 600, marginBottom: '12px' }}>
              {offer.bengali}
            </div>

            <p className="feature-desc" style={{ marginBottom: '20px', flexGrow: 1 }}>
              {offer.desc}
            </p>

            <div style={{ background: '#0a0c10', border: '1px dashed rgba(245,158,11,0.3)', borderRadius: '12px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>PROMO CODE</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>
                  {offer.code}
                </span>
              </div>
              <Link
                href="/loyalty"
                style={{
                  background: 'var(--gradient-brand)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Use in Pass
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.08)', border: '1px solid var(--border-highlight)', borderRadius: '20px', padding: '24px 32px', maxWidth: '600px' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>☕💬</div>
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: '0 0 6px', fontWeight: 800 }}>
            Have a Large Adda Group or Party?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 16px', lineHeight: 1.5 }}>
            Planning an office tea party or college get-together? Get custom bulk tea kettles in clay bhars delivered to your table with special group discounts.
          </p>
          <Link className="btn-primary" href="/activate">
            Join BHAAR MOSHAI Club for Bulk Perks
          </Link>
        </div>
      </div>
    </main>
  );
}
