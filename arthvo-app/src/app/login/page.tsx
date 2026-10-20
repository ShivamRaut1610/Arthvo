'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email aur password dono chahiye');
      return;
    }

    setLoading(true);

    // Simulate login (replace with Supabase auth)
    await new Promise(r => setTimeout(r, 1000));

    const savedUser = localStorage.getItem('arthvo-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.email === email) {
        setLoading(false);
        router.push(user.isOnboarded ? '/home' : '/onboarding');
        return;
      }
    }

    // For demo, allow any login and create session
    localStorage.setItem('arthvo-user', JSON.stringify({
      email,
      isOnboarded: true,
      xp: 100,
      streak: 1,
      age: 23,
      income: 18000,
    }));

    setLoading(false);
    router.push('/home');
  };

  return (
    <div className="auth-page">
      {/* Background glows */}
      <div className="auth-glow" style={{ top: -100, left: -80 }} />
      <div className="auth-glow" style={{ bottom: -120, right: -60, opacity: 0.3 }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            background: 'white', display: 'inline-block', padding: '12px 24px', 
            borderRadius: 16, margin: '0 auto 20px', boxShadow: '0 8px 32px var(--accent-glow)'
          }}>
            <img 
              src="/logo-full.jpeg" 
              alt="Arthvo Logo" 
              style={{ 
                height: 44, width: 'auto', objectFit: 'contain', display: 'block'
              }} 
            />
          </div>
          <h1 className="text-display" style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            color: 'var(--text-primary)',
            marginBottom: 6,
          }}>
            Wapas aa gaye!
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 500 }}>
            Tera future self wait kar raha hai.
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.2)',
              borderRadius: 12,
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--danger)',
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Email */}
          <div>
            <label className="input-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="input-field"
              placeholder="tumhara@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="input-label" htmlFor="login-password" style={{ margin: 0 }}>Password</label>
              <button
                type="button"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600,
                }}
              >
                Bhool gaye?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Apna password daalo"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                }}
              >
                {showPassword
                  ? <EyeOff size={18} color="var(--text-muted)" />
                  : <Eye size={18} color="var(--text-muted)" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '16px', fontSize: 16, marginTop: 4 }}
          >
            {loading ? (
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            ) : (
              <>Andar jao <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider-text" style={{ margin: '24px 0 20px' }}>ya</div>

        {/* Register link */}
        <Link href="/register" style={{ textDecoration: 'none' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', padding: '14px', fontSize: 15 }}
          >
            Naye ho? Register karo
          </button>
        </Link>

        {/* Trust badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          marginTop: 20, padding: '10px 16px', borderRadius: 12,
          background: 'var(--bg-tertiary)',
        }}>
          <Shield size={14} color="var(--accent-primary)" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
            Email only · No phone OTP · Secure & private
          </span>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ marginTop: 28, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', zIndex: 1 }}
      >
        © 2025 Arthvo · arthvo.in · PFRDA Top 3 Recognized
      </motion.p>
    </div>
  );
}
