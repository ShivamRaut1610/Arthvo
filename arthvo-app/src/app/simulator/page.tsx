'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { getAvatarState, getAvatarStatePercent, formatCorpus } from '@/lib/calculator';
import CorpusCalc from './components/CorpusCalc';
import TaxCalc from './components/TaxCalc';
import DelayCalc from './components/DelayCalc';
import CompareCalc from './components/CompareCalc';
import GigCalc from './components/GigCalc';

type CalcTab = 'corpus' | 'tax' | 'delay' | 'compare' | 'gig';

const TABS: { id: CalcTab; label: string; emoji: string }[] = [
  { id: 'corpus', label: 'Corpus', emoji: '📈' },
  { id: 'tax', label: 'Tax', emoji: '💸' },
  { id: 'delay', label: 'Delay Cost', emoji: '⏰' },
  { id: 'compare', label: 'Compare', emoji: '⚖️' },
  { id: 'gig', label: 'Gig Worker', emoji: '🛵' },
];

const AVATAR_DATA: Record<string, { emoji: string; color: string; label: string; msg: string }> = {
  thriving: { emoji: '😄', color: '#22C55E', label: 'Thriving', msg: 'Zabardast! Tera future self bahut khush hai!' },
  stable: { emoji: '🙂', color: '#6366F1', label: 'Stable', msg: 'Sahi track pe hai. Thoda aur badhao!' },
  struggling: { emoji: '😟', color: '#F59E0B', label: 'Struggling', msg: 'Yaar seriously, contribution badha!' },
  critical: { emoji: '😰', color: '#F97316', label: 'Critical', msg: 'Future self mushkil mein hai. Help karo!' },
  zero: { emoji: '😶', color: '#9CA3AF', label: 'Zero', msg: 'Abhi shuru nahi kiya. Aaj se shuru karo.' },
};

export default function SimulatorPage() {
  const { age, income } = useUser();
  const [tab, setTab] = useState<CalcTab>('corpus');
  const [corpus, setCorpus] = useState(0);
  const [contribution, setContribution] = useState(Math.round(income * 0.1));
  const [simAge, setSimAge] = useState(age);

  const state = getAvatarState(corpus, simAge);
  const pct = getAvatarStatePercent(corpus, simAge);
  const av = AVATAR_DATA[state];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px' }}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            NPS Simulator 🧮
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>5 calculators. Real numbers. Real decisions.</p>
        </motion.div>

        {/* Avatar state card */}
        <motion.div
          layout
          className="card"
          style={{
            padding: '16px 20px', marginBottom: 20,
            border: `2px solid ${av.color}30`,
            display: 'flex', alignItems: 'center', gap: 16,
          }}
        >
          <motion.div
            key={state}
            initial={{ scale: 0.7 }} animate={{ scale: 1 }}
            style={{ fontSize: 44, lineHeight: 1, flexShrink: 0 }}
          >
            {av.emoji}
          </motion.div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: av.color }}>{av.label}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent-primary)' }}>{formatCorpus(corpus)}</span>
            </div>
            <div className="xp-bar-track">
              <motion.div
                className="xp-bar-fill"
                animate={{ width: `${pct}%` }}
                style={{ background: `linear-gradient(90deg, ${av.color}, ${av.color}CC)` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{av.msg}</p>
          </div>
        </motion.div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flexShrink: 0, padding: '9px 14px', borderRadius: 12, border: 'none',
                background: tab === t.id ? 'var(--gradient-accent)' : 'var(--bg-card)',
                color: tab === t.id ? 'white' : 'var(--text-secondary)',
                fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
                border: tab === t.id ? 'none' : '1px solid var(--border-color)',
                boxShadow: tab === t.id ? '0 4px 16px var(--accent-glow)' : 'none',
                transition: 'all 0.2s ease', fontFamily: 'var(--font-primary)',
              }}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        {/* Calculator panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === 'corpus' && (
              <CorpusCalc
                initialAge={simAge} initialContrib={contribution}
                onUpdate={(c, age, contrib) => { setCorpus(c); setSimAge(age); setContribution(contrib); }}
              />
            )}
            {tab === 'tax' && <TaxCalc monthlyContrib={contribution} />}
            {tab === 'delay' && <DelayCalc initialAge={simAge} initialContrib={contribution} />}
            {tab === 'compare' && <CompareCalc initialAge={simAge} initialContrib={contribution} />}
            {tab === 'gig' && <GigCalc initialAge={simAge} onUpdate={setCorpus} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
