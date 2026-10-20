'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star, Shield, Zap, TrendingUp } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Gamified Learning', desc: 'Quests, XP, and badges — not boring PDFs.' },
  { icon: TrendingUp, title: 'Live Simulator', desc: 'See your retirement future change in real time.' },
  { icon: Star, title: 'AI Coach', desc: 'BhavishyaMitra speaks your language, understands your life.' },
  { icon: Shield, title: 'PFRDA Recognized', desc: 'Winner of Top 3 at IIT Kanpur. Government backed.' },
];

const levels = [
  { num: 1, name: 'Naya Arthvo', color: '#9CA3AF' },
  { num: 2, name: 'Seekhta Arthvo', color: '#60A5FA' },
  { num: 3, name: 'Samajhta Arthvo', color: '#34D399' },
  { num: 4, name: 'Badhta Arthvo', color: '#FBBF24' },
  { num: 5, name: 'Pakka Arthvo', color: '#F97316' },
  { num: 6, name: 'Sachha Arthvo', color: '#A78BFA' },
  { num: 7, name: 'Poora Arthvo', color: '#EC4899' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'var(--gradient-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            color: 'white',
            fontSize: 18,
            fontFamily: 'var(--font-display)',
          }}>A</div>
          <span style={{ fontWeight: 900, fontSize: 22, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>
            Arthvo
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/home" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
            Sign In
          </Link>
          <Link href="/onboarding">
            <button className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
              Start Free
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px',
        background: 'var(--gradient-hero)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 400, height: 400, borderRadius: '50%',
          background: 'var(--accent-glow)', filter: 'blur(80px)', opacity: 0.6,
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: -100,
          width: 300, height: 300, borderRadius: '50%',
          background: 'var(--accent-glow)', filter: 'blur(60px)', opacity: 0.4,
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ maxWidth: 640, position: 'relative', zIndex: 1 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 100,
              padding: '6px 16px',
              marginBottom: 28,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <Shield size={14} color="var(--accent-primary)" />
            Top 3 — PFRDA Recognition, IIT Kanpur
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 12,
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
          }}>
            Kya tu{' '}
            <span style={{
              background: 'var(--gradient-accent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Arthvo
            </span>{' '}
            hai?
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 3vw, 22px)',
            color: 'var(--text-secondary)',
            marginBottom: 16,
            lineHeight: 1.6,
            fontWeight: 400,
          }}>
            Paisa samjho. Zindagi jiyo.
          </p>

          <p style={{
            fontSize: 15,
            color: 'var(--text-muted)',
            marginBottom: 40,
            lineHeight: 1.6,
            maxWidth: 480,
            margin: '0 auto 40px',
          }}>
            India&apos;s first gamified financial awareness universe. Learn NPS, build your retirement, 
            and become Arthvo — in your language, your style, your pace.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/onboarding">
              <button className="btn-primary" style={{ fontSize: 17, padding: '16px 36px' }}>
                Shuru Karo — It&apos;s Free <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/simulator">
              <button className="btn-secondary" style={{ fontSize: 15 }}>
                Try Simulator
              </button>
            </Link>
          </div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ marginTop: 32, fontSize: 13, color: 'var(--text-muted)' }}
          >
            500 million young Indians need this. Be among the first.
          </motion.p>
        </motion.div>
      </section>

      {/* Avatar preview strip */}
      <section style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--bg-secondary)' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Your future self is watching.
        </motion.h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 40, fontSize: 16 }}>
          Move a slider. See your life change. Feel it.
        </p>

        {/* Avatar state cards */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 700, margin: '0 auto' }}>
          {[
            { state: 'Thriving', emoji: '🏖️', desc: 'Travelling at 60', color: '#22C55E' },
            { state: 'Stable', emoji: '🏡', desc: 'Comfortable life', color: '#6366F1' },
            { state: 'Struggling', emoji: '😟', desc: 'Dependent on kids', color: '#EAB308' },
            { state: 'Critical', emoji: '😰', desc: 'Working at 65', color: '#F97316' },
            { state: 'Zero', emoji: '💔', desc: 'Alone & worried', color: '#9CA3AF' },
          ].map((s, i) => (
            <motion.div
              key={s.state}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--bg-card)',
                border: `2px solid ${s.color}30`,
                borderRadius: 16,
                padding: '20px 16px',
                minWidth: 110,
                flex: '1 1 100px',
                boxShadow: `0 4px 20px ${s.color}20`,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>{s.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: s.color }}>{s.state}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.desc}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <Link href="/simulator">
            <button className="btn-primary">
              Try the Simulator <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '70px 24px', maxWidth: 900, margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 48, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Why Arthvo hits different
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ padding: 28 }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'var(--gradient-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
                boxShadow: '0 4px 16px var(--accent-glow)',
              }}>
                <f.icon size={22} color="white" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Level system */}
      <section style={{ padding: '60px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Tu Arthvo ban raha hai. 🚀
          </motion.h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: 15 }}>
            7 levels of identity. Not just gamification.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {levels.map((l, i) => (
              <motion.div
                key={l.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: 'var(--bg-card)', padding: '14px 20px',
                  borderRadius: 14, border: `1px solid ${l.color}30`,
                  boxShadow: `0 2px 12px ${l.color}15`,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: l.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, color: 'white', fontSize: 15, flexShrink: 0,
                }}>
                  {l.num}
                </div>
                <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{l.name}</span>
                {i === 0 && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 12, fontWeight: 600,
                    color: 'white', background: l.color, borderRadius: 8, padding: '3px 10px',
                  }}>Start here</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        background: 'var(--gradient-accent)',
        color: 'white',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: 'clamp(26px, 6vw, 42px)', fontWeight: 900, marginBottom: 16, fontFamily: 'var(--font-display)' }}>
            Kal ka tu kaisa dikhega?
          </h2>
          <p style={{ fontSize: 17, marginBottom: 36, opacity: 0.9, maxWidth: 420, margin: '0 auto 36px' }}>
            Your future self is waiting. Start in 60 seconds. No Aadhaar. No phone OTP. Just your email.
          </p>
          <Link href="/onboarding">
            <button style={{
              background: 'white',
              color: 'var(--accent-secondary, #C4622D)',
              fontWeight: 800,
              fontSize: 17,
              padding: '16px 40px',
              borderRadius: 14,
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              fontFamily: 'Inter, sans-serif',
              transition: 'transform 0.15s ease',
            }}>
              Main Arthvo hoon <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          © 2025 Arthvo · arthvo.in · Built by Shivam Dnyaneshwar Raut, Pune
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>
          PFRDA Top 3 Recognized · DPDP Act 2023 Compliant
        </p>
      </footer>
    </div>
  );
}
