'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { calculateCorpus, getTotalInvested, getTotalReturns, getMonthlyPension, getCorpusGrowthData, formatCorpus, formatINR, getCostOfDelay } from '@/lib/calculator';

interface Props { initialAge: number; initialContrib: number; onUpdate: (corpus: number, age: number, contrib: number) => void; }

function Slider({ label, value, min, max, step = 1, format, onChange }: { label: string; value: number; min: number; max: number; step?: number; format: (v: number) => string; onChange: (v: number) => void; }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-primary)' }}>{format(value)}</span>
      </div>
      <input type="range" className="arthvo-slider" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(min)}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{format(max)}</span>
      </div>
    </div>
  );
}

function StatBox({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: 'var(--bg-tertiary)', borderRadius: 14, padding: '14px 16px', flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: color || 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export default function CorpusCalc({ initialAge, initialContrib, onUpdate }: Props) {
  const [age, setAge] = useState(initialAge || 23);
  const [contrib, setContrib] = useState(initialContrib || 2000);
  const [retireAge, setRetireAge] = useState(60);
  const [rate, setRate] = useState(10);

  const corpus = calculateCorpus({ currentAge: age, retirementAge: retireAge, monthlyContribution: contrib, annualReturn: rate });
  const invested = getTotalInvested(contrib, age, retireAge);
  const returns = getTotalReturns(corpus, invested);
  const pension = getMonthlyPension(corpus);
  const delay5 = getCostOfDelay({ currentAge: age, retirementAge: retireAge, monthlyContribution: contrib, annualReturn: rate });
  const chartData = getCorpusGrowthData(age, retireAge, contrib, rate);

  useEffect(() => { onUpdate(corpus, age, contrib); }, [corpus, age, contrib]);

  return (
    <div>
      <div className="card" style={{ padding: '22px 20px', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', marginBottom: 20 }}>🎯 Retirement Corpus Calculator</h3>
        <Slider label="Current Age" value={age} min={18} max={50} format={v => `${v} yrs`} onChange={setAge} />
        <Slider label="Monthly Contribution" value={contrib} min={200} max={50000} step={200} format={v => `₹${v.toLocaleString('en-IN')}`} onChange={setContrib} />
        <Slider label="Annual Return" value={rate} min={8} max={14} step={0.5} format={v => `${v}%`} onChange={setRate} />
        <Slider label="Retirement Age" value={retireAge} min={55} max={70} format={v => `${v} yrs`} onChange={setRetireAge} />
      </div>

      {/* Big corpus number */}
      <motion.div key={corpus} initial={{ scale: 0.96 }} animate={{ scale: 1 }} className="card"
        style={{ padding: '24px', marginBottom: 16, textAlign: 'center', border: '2px solid var(--accent-primary)40' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Total Corpus at {retireAge}</div>
        <div style={{ fontSize: 'clamp(32px,8vw,48px)', fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{formatCorpus(corpus)}</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>Monthly pension estimate: <strong style={{ color: 'var(--text-primary)' }}>{formatINR(pension)}/month</strong></div>
      </motion.div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatBox label="Total Invested" value={formatCorpus(invested)} sub="Your contribution" />
        <StatBox label="Returns Earned" value={formatCorpus(returns)} sub="Market growth" color="var(--success)" />
        <StatBox label="Cost of 5yr Delay" value={`-${formatCorpus(delay5)}`} color="var(--danger)" sub="If you wait 5 yrs" />
      </div>

      {/* Chart */}
      <div className="card" style={{ padding: '20px 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 14 }}>Corpus Growth Over Time</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="age" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={v => `${v}yr`} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickFormatter={v => v >= 100000 ? `${(v / 100000).toFixed(0)}L` : v} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, fontSize: 12 }}
              formatter={(v: number, n: string) => [formatCorpus(v), n === 'corpus' ? 'Corpus' : 'Invested']} labelFormatter={l => `Age ${l}`} />
            <Area type="monotone" dataKey="invested" stroke="#6366F1" strokeWidth={2} fill="url(#investedGrad)" dot={false} />
            <Area type="monotone" dataKey="corpus" stroke="var(--accent-primary)" strokeWidth={2.5} fill="url(#corpusGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
