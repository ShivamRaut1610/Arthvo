'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateTaxBenefit, formatINR } from '@/lib/calculator';

interface Props { monthlyContrib: number; }

function Slider({ label, value, min, max, step = 1, format, onChange }: { label: string; value: number; min: number; max: number; step?: number; format: (v: number) => string; onChange: (v: number) => void; }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-primary)' }}>{format(value)}</span>
      </div>
      <input type="range" className="arthvo-slider" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}

export default function TaxCalc({ monthlyContrib }: Props) {
  const [income, setIncome] = useState(600000);
  const [contrib, setContrib] = useState(monthlyContrib * 12 || 24000);
  const [regime, setRegime] = useState<'old' | 'new'>('old');

  const result = calculateTaxBenefit({ annualIncome: income, annualContribution: contrib, regime });

  return (
    <div>
      <div className="card" style={{ padding: '22px 20px', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', marginBottom: 20 }}>💸 Tax Benefit Calculator</h3>

        {/* Regime toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 12, padding: 4, marginBottom: 20, width: 'fit-content' }}>
          {(['old', 'new'] as const).map(r => (
            <button key={r} onClick={() => setRegime(r)} style={{
              padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: regime === r ? 'var(--bg-card)' : 'transparent',
              color: regime === r ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontWeight: regime === r ? 700 : 500, fontSize: 13,
              boxShadow: regime === r ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s', fontFamily: 'var(--font-primary)',
            }}>
              {r === 'old' ? 'Old Regime' : 'New Regime'}
            </button>
          ))}
        </div>

        <Slider label="Annual Income" value={income} min={200000} max={5000000} step={50000} format={v => `₹${(v / 100000).toFixed(1)}L`} onChange={setIncome} />
        <Slider label="Annual NPS Contribution" value={contrib} min={6000} max={500000} step={6000} format={v => `₹${(v / 1000).toFixed(0)}K`} onChange={setContrib} />
      </div>

      {/* Results */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Section 80CCD(1) Benefit', desc: `Part of 80C ₹1.5L limit`, value: result.benefit80CCD1, color: '#6366F1' },
          { label: 'Section 80CCD(1B) Benefit', desc: regime === 'old' ? 'Extra ₹50,000 — NPS only!' : 'Not available in new regime', value: result.benefit80CCD1B, color: '#22C55E' },
        ].map(row => (
          <div key={row.label} className="card-flat" style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{row.desc}</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: row.color }}>{formatINR(row.value)}</div>
          </div>
        ))}
      </div>

      {/* Big saving */}
      <motion.div key={result.totalTaxSaved} initial={{ scale: 0.96 }} animate={{ scale: 1 }}
        className="card" style={{ padding: '24px', textAlign: 'center', border: '2px solid #22C55E40', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Total Tax Saved This Year</div>
        <div style={{ fontSize: 42, fontWeight: 900, color: '#22C55E', fontFamily: 'var(--font-display)' }}>{formatINR(result.totalTaxSaved)}</div>
        <div style={{ marginTop: 12, fontSize: 15, color: 'var(--text-secondary)' }}>
          Every ₹100 in NPS costs you only{' '}
          <strong style={{ color: 'var(--accent-primary)', fontSize: 18 }}>₹{result.effectiveCostPer100}</strong>
          {' '}after tax!
        </div>
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>Marginal rate: {Math.round(result.marginalRate * 100)}%</div>
      </motion.div>

      {regime === 'old' && (
        <div style={{ padding: '14px 16px', background: 'var(--accent-glow)', borderRadius: 12, border: '1px solid var(--accent-primary)40', fontSize: 13, color: 'var(--text-secondary)' }}>
          💡 <strong>Pro tip:</strong> Old regime + NPS gives you up to ₹{formatINR(200000)} total deduction. ₹1.5L (80C) + ₹50K (80CCD1B). No other instrument gives this.
        </div>
      )}
    </div>
  );
}
