'use client';

import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Phone } from 'lucide-react';
import { useState } from 'react';
import { registerUser } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await registerUser(formData);
      if (res.success && res.userId) {
        setSuccess('Account created successfully! Logging you in...');
        if (typeof window !== 'undefined') {
          localStorage.setItem('userId', res.userId);
          // Save credentials locally as requested ("save on only in their devices")
          const email = formData.get('email') as string;
          const password = formData.get('password') as string;
          if (email && password) {
            localStorage.setItem('savedEmail', email);
            localStorage.setItem('savedPassword', password);
          }
          window.dispatchEvent(new Event('auth-change'));
        }
        setTimeout(() => {
          router.push('/loyalty');
        }, 1500);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="main-section animate-fade-up" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="section-title">Join the Adda</h1>
        <p className="section-desc">Create an account to collect stamps and unlock free treats.</p>
      </div>

      <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '40px', boxShadow: 'var(--shadow-md)' }}>
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem', border: '1px solid #ffcdd2' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem', border: '1px solid #c8e6c9' }}>
            {success}
          </div>
        )}

        <form className="form" action={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input type="text" id="name" name="name" className="input" placeholder="John Doe" style={{ paddingLeft: '48px', marginBottom: 0 }} required disabled={isLoading} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input type="email" id="email" name="email" autoComplete="email" className="input" placeholder="you@example.com" style={{ paddingLeft: '48px', marginBottom: 0 }} required disabled={isLoading} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="mobile">Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input type="tel" id="mobile" name="mobile" className="input" placeholder="9876543210" pattern="[0-9]*" minLength={10} maxLength={10} style={{ paddingLeft: '48px', marginBottom: 0 }} required disabled={isLoading} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input type={showPassword ? "text" : "password"} id="password" name="password" autoComplete="new-password" className="input" placeholder="••••••••" style={{ paddingLeft: '48px', paddingRight: '48px', marginBottom: 0 }} required disabled={isLoading} />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }} disabled={isLoading}>
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </main>
  );
}
