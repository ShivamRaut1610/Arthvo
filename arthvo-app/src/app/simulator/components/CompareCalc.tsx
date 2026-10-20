'use client';
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { compareInvestments, formatCorpus } from '@/lib/calculator';

interface Props { initialAge: number; initialContrib: number; }

export default function CompareCalc({ initialAge, initialContrib }: Props) {
  const [age, setAge] = useState(initialAge || 23);
  const [contrib, setContrib] = useState(initialContrib || 2000);

  const data = compareInvestments(contrib, age, 60);

  return (
    <div>
      <div className="card" style={{ padding: '22px 20px', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', marginBottom: 20 }}>⚖️ NPS vs Other Investments</h3>

        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Monthly Contribution</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-primary)' }}>₹{contrib.toLocaleString('en-IN')}</span>
          </div>
          <input type="range" className="arthvo-slider" min={500} max={20000} step={500} value={contrib} onChange={e => setContrib(Number(e.target.value))} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Current Age</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-primary)' }}>{age} yrs</span>
          </div>
          <input type="range" className="arthvo-slider" min={18} max={50} value={age} onChange={e => setAge(Number(e.target.value))} />
        </div>
      </div>

      <div className="card" style={{ padding: '20px 12px', marginBottom: 16 }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-muted)', fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => v >= 10000000 ? `${(v/10000000).toFixed(0)}Cr` : `${(v/100000).toFixed(0)}L`} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, fontSize: 12 }}
              formatter={(v: number) => [formatCorpus(v), 'Corpus']} />
            <Bar dataKey="corpus" radius={[8, 8, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fill={d.color} opacity={d.isNPS ? 1 : 0.6} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map(d => (
          <div key={d.name} className="card-flat" style={{
            padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: d.isNPS ? `2px solid ${d.color}60` : '1px solid var(--border-color)',
          }}>
            <div>
              <div style={{ fontWeight: d.isNPS ? 800 : 600, fontSize: 14, color: d.isNPS ? d.color : 'var(--text-primary)' }}>
                {d.isNPS ? '🏆 ' : ''}{d.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.rate}% p.a.{d.isNPS ? ' + tax benefit' : ''}</div>
            </div>
            <div style={{ fontWeight: 900, fontSize: 16, color: d.isNPS ? d.color : 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
              {formatCorpus(d.corpus)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
