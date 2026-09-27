import Link from 'next/link';
import { getAllOffers } from '@/app/actions/offers';

export default async function Offers() {
  const res = await getAllOffers();
  const offersList: any[] = res.success ? (res.offers || []) : [];

  return (

    <main className="main-section animate-fade-up">
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
              borderColor: offer.highlight ? 'var(--border-medium)' : 'var(--border-light)',
              background: offer.highlight
                ? 'var(--bg-surface-elevated)'
                : 'var(--bg-surface)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--accent-terracotta)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {offer.tag}
              </span>
              <span style={{ background: 'var(--accent-terracotta-dim)', color: 'var(--accent-terracotta)', fontSize: '0.72rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                {offer.badge}
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.3 }}>
              {offer.title}
            </h2>
            <div style={{ fontSize: '0.86rem', color: 'var(--accent-terracotta)', fontWeight: 500, marginBottom: '12px' }}>
              {offer.bengali}
            </div>

            <p className="feature-desc" style={{ marginBottom: '20px', flexGrow: 1 }}>
              {offer.desc}
            </p>

            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'block' }}>PROMO CODE</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                  {offer.code}
                </span>
              </div>
              <Link
                href="/loyalty"
                className="btn btn-primary"
                style={{
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  textDecoration: 'none',
                  minWidth: '0',
                }}
              >
                Use in Pass
              </Link>
            </div>
          </div>
        ))}
        {offersList.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)', background: 'var(--bg-surface)', border: '1px dashed var(--border-medium)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>😔</div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>No active offers</h3>
            <p>There are currently no active offers. Please check back later for new deals and special perks!</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '24px 32px', maxWidth: '600px' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>☕💬</div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 6px', fontWeight: 600 }}>
            Have a Large Adda Group or Party?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 16px', lineHeight: 1.5 }}>
            Planning an office tea party or college get-together? Get custom bulk tea kettles in clay bhars delivered to your table with special group discounts.
          </p>
          <Link className="btn btn-secondary" href="/activate">
            Join BHAAR MOSHAI Club for Bulk Perks
          </Link>
        </div>
      </div>
    </main>
  );
}
