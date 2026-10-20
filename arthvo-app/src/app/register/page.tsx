'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Shield, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = 'Email zaroori hai';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Valid email daalo';
    if (!password) e.password = 'Password zaroori hai';
    else if (password.length < 6) e.password = 'Kam se kam 6 characters';
    if (password !== confirmPassword) e.confirm = 'Password match nahi karta';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // For now, simulate registration (replace with Supabase auth)
    await new Promise(r => setTimeout(r, 1200));

    // Store basic session
    localStorage.setItem('arthvo-user', JSON.stringify({
      email,
      isOnboarded: false,
      xp: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
    }));

    setLoading(false);
    router.push('/onboarding');
  };

  const passwordChecks = [
    { label: '6+ characters', met: password.length >= 6 },
    { label: 'Passwords match', met: password.length > 0 && password === confirmPassword },
  ];

  return (
    <div className="auth-page">
      {/* Background glows */}
      <div className="auth-glow" style={{ top: -120, right: -80 }} />
      <div className="auth-glow" style={{ bottom: -100, left: -60, opacity: 0.3 }} />

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
            Arthvo shuru karo
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', fontWeight: 500 }}>
            Free hai. Hamesha.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Email */}
          <div>
            <label className="input-label" htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              placeholder="tumhara@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
              autoComplete="email"
              autoFocus
            />
            {errors.email && <div className="input-error-text">{errors.email}</div>}
          </div>

          {/* Password */}
          <div>
            <label className="input-label" htmlFor="register-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                className={`input-field ${errors.password ? 'input-error' : ''}`}
                placeholder="Kam se kam 6 characters"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                autoComplete="new-password"
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
            {errors.password && <div className="input-error-text">{errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="input-label" htmlFor="register-confirm">Confirm Password</label>
            <input
              id="register-confirm"
              type={showPassword ? 'text' : 'password'}
              className={`input-field ${errors.confirm ? 'input-error' : ''}`}
              placeholder="Same password phir se"
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirm: '' })); }}
              autoComplete="new-password"
            />
            {errors.confirm && <div className="input-error-text">{errors.confirm}</div>}
          </div>

          {/* Password strength checks */}
          <div style={{ display: 'flex', gap: 16 }}>
            {passwordChecks.map(c => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: c.met ? 'var(--success)' : 'var(--bg-tertiary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s ease',
                }}>
                  {c.met && <Check size={10} color="white" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 12, color: c.met ? 'var(--success)' : 'var(--text-muted)', fontWeight: 500 }}>
                  {c.label}
                </span>
              </div>
            ))}
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
              <>Shuru karo <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Already joined?{' '}
            <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Login karo
            </Link>
          </p>
        </div>

        {/* Trust badge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          marginTop: 20, padding: '10px 16px', borderRadius: 12,
          background: 'var(--bg-tertiary)',
        }}>
          <Shield size={14} color="var(--accent-primary)" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
            No Aadhaar · No phone OTP · DPDP Act 2023 compliant
          </span>
        </div>
      </motion.div>

      {/* Footer text */}
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
