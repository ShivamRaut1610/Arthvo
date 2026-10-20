'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { getDelayScenarios, formatCorpus, formatINR } from '@/lib/calculator';

interface Props { initialAge: number; initialContrib: number; }

function Slider({ label, value, min, max, step = 1, format, onChange }: { label: string; value: number; min: number; max: number; step?: number; format: (v: number) => string; onChange: (v: number) => void; }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-primary)' }}>{format(value)}</span>
      </div>
      <input type="range" className="arthvo-slider" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}

const COLORS = ['#22C55E', '#F59E0B', '#EF4444'];
const EMOJIS = ['🚀', '⏳', '😱'];

export default function DelayCalc({ initialAge, initialContrib }: Props) {
  const [age, setAge] = useState(initialAge || 23);
  const [contrib, setContrib] = useState(initialContrib || 2000);
  const [retireAge, setRetireAge] = useState(60);

  const scenarios = getDelayScenarios(age, retireAge, contrib);

  return (
    <div>
      <div className="card" style={{ padding: '22px 20px', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', marginBottom: 20 }}>⏰ Cost of Delay Calculator</h3>
        <Slider label="Current Age" value={age} min={18} max={50} format={v => `${v} yrs`} onChange={setAge} />
        <Slider label="Monthly Contribution" value={contrib} min={200} max={20000} step={200} format={v => `₹${v.toLocaleString('en-IN')}`} onChange={setContrib} />
        <Slider label="Retirement Age" value={retireAge} min={55} max={70} format={v => `${v} yrs`} onChange={setRetireAge} />
      </div>

      {/* Scenario cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {scenarios.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }} className="card-flat"
            style={{
              padding: '18px 20px',
              border: `2px solid ${COLORS[i]}30`,
              background: i === 0 ? `${COLORS[0]}08` : 'var(--bg-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{EMOJIS[i]}</span>
                  <span style={{ fontWeight: 800, fontSize: 15, color: COLORS[i] }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Start at age {s.startAge}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: COLORS[i], fontFamily: 'var(--font-display)' }}>{formatCorpus(s.corpus)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>at retirement</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Total invested: <strong style={{ color: 'var(--text-secondary)' }}>{formatCorpus(s.totalInvested)}</strong></span>
              {s.lossVsToday > 0 && (
                <span style={{ color: '#EF4444', fontWeight: 700 }}>-{formatCorpus(s.lossVsToday)} loss</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {scenarios[2] && (
        <div style={{ padding: '16px', background: '#EF444410', borderRadius: 14, border: '1px solid #EF444430', fontSize: 13, color: '#EF4444', fontWeight: 600 }}>
          😱 Waiting 5 years costs you <strong>{formatCorpus(scenarios[2].lossVsToday)}</strong> — permanently gone. No way to recover it.
        </div>
      )}
    </div>
  );
}
