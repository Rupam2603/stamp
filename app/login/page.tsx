'use client';

import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loginUser } from '@/app/actions/auth';
import { generateAuthOptions, verifyAuthResponse } from '@/app/actions/webauthn';
import { startAuthentication } from '@simplewebauthn/browser';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check for locally saved credentials
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('savedEmail');
      const savedPassword = localStorage.getItem('savedPassword');
      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) setPassword(savedPassword);
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await loginUser(formData);
      if (res.success) {
        setSuccess('Logged in successfully! Redirecting...');
        if (typeof window !== 'undefined') {
          localStorage.setItem('userId', res.userId!);
          
          // Save credentials locally
          const currentEmail = formData.get('email') as string;
          const currentPassword = formData.get('password') as string;
          if (currentEmail && currentPassword) {
            localStorage.setItem('savedEmail', currentEmail);
            localStorage.setItem('savedPassword', currentPassword);
          }

          if (res.isAdmin) {
             localStorage.setItem('isAdmin', 'true');
          }
          window.dispatchEvent(new Event('auth-change'));
        }
        setTimeout(() => {
          if (res.isAdmin) {
             router.push('/admin'); // Redirect to admin panel
          } else {
             router.push('/loyalty'); // Redirect to loyalty page
          }
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

  async function handleBiometricLogin() {
    if (!email) {
      setError('Please enter your email first to use biometrics.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Get auth options from server
      const optionsRes = await generateAuthOptions(email);
      if (!optionsRes.success || !optionsRes.options) {
        throw new Error(optionsRes.message || 'Failed to get authentication options');
      }
      
      // 2. Start biometric auth in browser
      let authResp;
      try {
        authResp = await startAuthentication({ optionsJSON: optionsRes.options });
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          throw new Error('Biometric authentication was cancelled or not allowed.');
        }
        throw err;
      }
      
      // 3. Verify response with server
      const verifyRes = await verifyAuthResponse(email, authResp);
      if (verifyRes.success) {
        setSuccess('Biometric login successful! Redirecting...');
        if (typeof window !== 'undefined') {
          localStorage.setItem('userId', verifyRes.userId!);
          localStorage.setItem('savedEmail', email);
          if (verifyRes.isAdmin) {
             localStorage.setItem('isAdmin', 'true');
          }
          window.dispatchEvent(new Event('auth-change'));
        }
        setTimeout(() => {
          if (verifyRes.isAdmin) {
             router.push('/admin');
          } else {
             router.push('/loyalty');
          }
        }, 1500);
      } else {
        throw new Error(verifyRes.message || 'Biometric verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong during biometric login.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="main-section animate-fade-up" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="section-title">Welcome Back</h1>
        <p className="section-desc">Sign in to BHAAR MOSHAI to access your loyalty card and exclusive offers.</p>
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
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input type="email" id="email" name="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" style={{ paddingLeft: '48px', marginBottom: 0 }} required disabled={isLoading} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
              <Link href="#" style={{ fontSize: '0.8rem', color: 'var(--accent-terracotta)', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input type={showPassword ? "text" : "password"} id="password" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" style={{ paddingLeft: '48px', paddingRight: '48px', marginBottom: 0 }} required disabled={isLoading} />
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

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginBottom: '12px' }} disabled={isLoading}>
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Log In'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
          
          <button type="button" onClick={handleBiometricLogin} className="btn" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)' }} disabled={isLoading}>
            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>👆</span> Sign in with Biometrics / Passkey
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link href="/signup" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
        </div>
      </div>
    </main>
  );
}
