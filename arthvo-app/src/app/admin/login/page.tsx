'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Shield, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError('Password required'); return; }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Server error — try again');
    }

    setLoading(false);
  };

  return (
    <div className="auth-page" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%', maxWidth: 400,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 20,
          padding: '36px 28px',
          boxShadow: 'var(--shadow)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            background: 'white', display: 'inline-block', padding: '10px 20px', 
            borderRadius: 14, margin: '0 auto 20px', boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
          }}>
            <img 
              src="/logo-full.jpeg" 
              alt="Arthvo Logo" 
              style={{ 
                height: 36, width: 'auto', objectFit: 'contain', display: 'block'
              }} 
            />
          </div>
          <h1 className="text-display" style={{ fontSize: 22, color: 'var(--text-primary)', marginBottom: 4 }}>
            Admin Access
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
            Arthvo admin panel — password protected
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.2)',
              borderRadius: 12, padding: '10px 14px', marginBottom: 16,
            }}
          >
            <AlertTriangle size={14} color="var(--danger)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)' }}>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="input-label" htmlFor="admin-password">Admin Password</label>
            <input
              id="admin-password"
              type="password"
              className="input-field"
              placeholder="Enter admin password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: 15 }}
          >
            {loading ? (
              <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
            ) : (
              <>Access Admin Panel <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          marginTop: 20, fontSize: 12, color: 'var(--text-muted)',
        }}>
          <Shield size={12} color="var(--text-muted)" />
          Server-side verification only
        </div>
      </motion.div>
    </div>
  );
}
