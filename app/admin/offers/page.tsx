'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllOffers, createOffer, deleteOffer } from '@/app/actions/offers';
import { Tag, Plus, Trash2, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';

export default function AdminOffers() {
  const router = useRouter();
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    tag: '',
    title: '',
    bengali: '',
    desc: '',
    code: '',
    badge: '',
    highlight: false,
    imageBase64: ''
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
        setFormData({ ...formData, imageBase64: base64 });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchOffers = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    setIsRefreshing(true);
    try {
      const res = await getAllOffers();
      if (res.success && res.offers) {
        setOffers(res.offers);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      if (showLoading) setIsLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/login');
      return;
    }
    fetchOffers(true);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createOffer(formData);
      if (res.success) {
        setIsAdding(false);
        setFormData({ tag: '', title: '', bengali: '', desc: '', code: '', badge: '', highlight: false, imageBase64: '' });
        fetchOffers();
      } else {
        alert(res.error || 'Failed to create offer');
      }
    } catch (err) {
      alert('Error creating offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      const res = await deleteOffer(id);
      if (res.success) {
        fetchOffers();
      } else {
        alert(res.error || 'Failed to delete offer');
      }
    } catch (err) {
      alert('Error deleting offer');
    }
  };

  if (isLoading) {
    return (
      <main className="main-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>Loading offers...</p>
      </main>
    );
  }

  return (
    <main className="main-section animate-fade-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/admin" className="btn btn-secondary" style={{ padding: '8px 12px' }}>
          <ArrowLeft size={18} /> Back
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="section-title" style={{ fontSize: '2rem' }}>Manage Offers</h1>
          <p className="section-desc" style={{ marginTop: '8px' }}>Create and manage special deals.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => fetchOffers(false)} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
            <RefreshCw size={16} className={isRefreshing ? 'spin-anim' : ''} />
          </button>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary" style={{ padding: '8px 16px' }}>
            <Plus size={16} /> Add New Offer
          </button>
        </div>
      </div>
      <style>{`
        .spin-anim { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {isAdding && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>New Offer Details</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Title</label>
              <input required type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. New Member Welcome Chai Drop" />
            </div>
            <div>
              <label className="form-label">Tag</label>
              <input required type="text" className="input" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} placeholder="e.g. WELCOME TREAT" />
            </div>
            <div>
              <label className="form-label">Badge</label>
              <input required type="text" className="input" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="e.g. Instant Unlock" />
            </div>
            <div>
              <label className="form-label">Promo Code</label>
              <input required type="text" className="input" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. BM-FIRSTCHAI" />
            </div>
            <div>
              <label className="form-label">Bengali Subtitle</label>
              <input type="text" className="input" value={formData.bengali} onChange={e => setFormData({...formData, bengali: e.target.value})} placeholder="e.g. নতুন মেম্বারদের জন্য স্পেশাল উপহার" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <textarea required className="input" style={{ minHeight: '80px', resize: 'vertical' }} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="Offer details..." />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Offer Image (Optional, max 2MB)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="input" style={{ paddingTop: '10px' }} />
              {formData.imageBase64 && (
                <div style={{ marginTop: '12px' }}>
                  <img src={formData.imageBase64} alt="Preview" style={{ height: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                </div>
              )}
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="highlight" checked={formData.highlight} onChange={e => setFormData({...formData, highlight: e.target.checked})} />
              <label htmlFor="highlight" style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>Highlight this offer</label>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ minWidth: '120px', justifyContent: 'center' }}>
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save Offer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="feature-grid">
        {offers.length === 0 && !isAdding && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)', background: 'var(--bg-surface)', border: '1px dashed var(--border-medium)', borderRadius: 'var(--radius-lg)' }}>
            No offers available. Click "Add New Offer" to create one.
          </div>
        )}
        
        {offers.map((offer) => (
          <div key={offer.id} className="feature-card" style={{ borderColor: offer.highlight ? 'var(--border-medium)' : 'var(--border-light)', background: offer.highlight ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)', position: 'relative' }}>
            <button 
              onClick={() => handleDelete(offer.id)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              title="Delete Offer"
            >
              <Trash2 size={16} />
            </button>
            
            {offer.imageUrl && (
              <div style={{ width: '100%', height: '160px', marginBottom: '16px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <img src={offer.imageUrl} alt={offer.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--accent-terracotta)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {offer.tag}
              </span>
              <span style={{ background: 'var(--accent-terracotta-dim)', color: 'var(--accent-terracotta)', fontSize: '0.72rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                {offer.badge}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.3, paddingRight: '24px' }}>
              {offer.title}
            </h2>
            <div style={{ fontSize: '0.86rem', color: 'var(--accent-terracotta)', fontWeight: 500, marginBottom: '12px' }}>
              {offer.bengali}
            </div>
            <p className="feature-desc" style={{ marginBottom: '20px', flexGrow: 1 }}>
              {offer.desc}
            </p>
            <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'block' }}>PROMO CODE</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                {offer.code}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
