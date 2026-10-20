'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { calculateGigWorker, formatCorpus, formatINR } from '@/lib/calculator';

interface Props { initialAge: number; onUpdate: (corpus: number) => void; }

export default function GigCalc({ initialAge, onUpdate }: Props) {
  const [income, setIncome] = useState(20000);
  const [savePct, setSavePct] = useState(10);
  const [age, setAge] = useState(initialAge || 23);

  const result = calculateGigWorker(income, savePct, age, 60);
  useEffect(() => { onUpdate(result.corpus); }, [result.corpus]);

  const rows = [
    { label: 'Recommended Monthly Contribution', value: formatINR(result.recommendedContribution), color: 'var(--accent-primary)' },
    { label: 'Minimum (even bad months)', value: formatINR(result.minContribution), color: 'var(--text-secondary)' },
    { label: 'Tax Deductible (20% of income)', value: formatINR(result.taxDeductible), color: '#6366F1' },
    { label: 'Tax Saved This Year', value: formatINR(result.taxSaved), color: '#22C55E' },
    { label: 'Monthly Pension at 60', value: `${formatINR(result.monthlyPension)}/mo`, color: 'var(--accent-secondary)' },
  ];

  return (
    <div>
      <div className="card" style={{ padding: '22px 20px', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', marginBottom: 6 }}>🛵 Gig Worker NPS Calculator</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>For delivery agents, freelancers, self-employed. 80CCD(1) allows 20% of income — double the salaried limit.</p>

        {[
          { label: 'Monthly Gig Income', value: income, min: 5000, max: 100000, step: 1000, format: (v: number) => `₹${(v/1000).toFixed(0)}K`, set: setIncome },
          { label: 'Save % of Income', value: savePct, min: 5, max: 20, step: 1, format: (v: number) => `${v}%`, set: setSavePct },
          { label: 'Current Age', value: age, min: 18, max: 50, step: 1, format: (v: number) => `${v} yrs`, set: setAge },
        ].map(s => (
          <div key={s.label} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{s.label}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-primary)' }}>{s.format(s.value)}</span>
            </div>
            <input type="range" className="arthvo-slider" min={s.min} max={s.max} step={s.step} value={s.value} onChange={e => s.set(Number(e.target.value))} />
          </div>
        ))}
      </div>

      <motion.div key={result.corpus} initial={{ scale: 0.96 }} animate={{ scale: 1 }}
        className="card" style={{ padding: '24px', textAlign: 'center', marginBottom: 16, border: '2px solid var(--accent-primary)40' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Retirement Corpus at 60</div>
        <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>{formatCorpus(result.corpus)}</div>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {rows.map(r => (
          <div key={r.label} className="card-flat" style={{ padding: '13px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{r.label}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: r.color }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 16px', background: 'var(--accent-glow)', borderRadius: 12, border: '1px solid var(--accent-primary)40', fontSize: 13, color: 'var(--text-secondary)' }}>
        💡 <strong>Gig worker advantage:</strong> You can deduct up to 20% of gross income under 80CCD(1) vs only 10% for salaried. eNPS mein apply karo — no employer needed.
      </div>
    </div>
  );
}
