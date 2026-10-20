'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { calculateCorpus, formatCorpus } from '@/lib/calculator';
import { Sparkles, Share2, RefreshCw, CheckCircle, AlertTriangle, Zap, Target, TrendingUp, WifiOff } from 'lucide-react';

interface Report {
  pension_iq_score: number;
  score_reason: string;
  avatar_story: string;
  strength_1: string;
  strength_2: string;
  blind_spot_1: string;
  blind_spot_2: string;
  one_action: string;
  encouragement: string;
  next_challenge: string;
}

function IQGauge({ score }: { score: number }) {
  const r = 70, cx = 90, cy = 85, strokeW = 12;
  const circ = Math.PI * r;
  const color = score >= 70 ? '#22C55E' : score >= 45 ? '#F59E0B' : '#EF4444';
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={180} height={110} style={{ overflow: 'visible' }}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--bg-tertiary)" strokeWidth={strokeW} strokeLinecap="round" />
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}
        style={{ marginTop: -40, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontSize: 52, fontWeight: 900, color, fontFamily: 'var(--font-display)', lineHeight: 1 }}
        >
          {score}
        </motion.div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>Pension IQ</div>
      </motion.div>
    </div>
  );
}

function ReportSection({ icon, title, items, type }: { icon: React.ReactNode; title: string; items: string[]; type: 'good' | 'gap' | 'action' }) {
  const colors = { good: '#22C55E', gap: '#F59E0B', action: 'var(--accent-primary)' };
  const bg = { good: '#22C55E10', gap: '#F59E0B10', action: 'var(--accent-glow)' };
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: bg[type], border: `1.5px solid ${colors[type]}30`, borderRadius: 16, padding: '16px 18px', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {icon}
        <span style={{ fontWeight: 700, fontSize: 14, color: colors[type] }}>{title}</span>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < items.length - 1 ? 8 : 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[type], marginTop: 7, flexShrink: 0 }} />
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</p>
        </div>
      ))}
    </motion.div>
  );
}

export default function ReportPage() {
  const { xp, level, streak, name, age, income } = useUser();
  const { language, coachPersonality } = useEnvironment();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');

  const corpus = calculateCorpus({ currentAge: age, retirementAge: 60, monthlyContribution: Math.round(income * 0.1) });

  const generateReport = async () => {
    setLoading(true); setError('');
    try {
      const behavior = {
        questsCompleted: Math.min(30, Math.floor(xp / 50)),
        questsAbandoned: Math.floor(Math.random() * 3),
        topicsMastered: ['NPS basics', 'Tax benefits'].slice(0, level - 1),
        topicsAvoided: level < 4 ? ['Fund manager comparison', 'Tier II accounts'] : [],
        simulatorSessions: Math.floor(xp / 200),
        avgContributionSimulated: Math.round(income * 0.12),
      };
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: { name, age, income, xp, streak }, behavior, language, personality: coachPersonality }),
      });
      const data = await res.json();
      setOffline(data.offline || false);
      setReport(data.report);
    } catch {
      setError('Report generate nahi hua. Dobara try karo!');
    }
    setLoading(false);
  };

  const handleShare = () => {
    const text = report ? `Mera Bhavishya IQ Score: ${report.pension_iq_score}/100! 🎯\n${report.encouragement}\n\nArthvo pe join karo: arthvo.in` : '';
    if (navigator.share) navigator.share({ title: 'Mera Bhavishya Score', text, url: 'https://arthvo.in' });
    else navigator.clipboard?.writeText(text).then(() => alert('Copied to clipboard!'));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 16px' }}>

        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Bhavishya Score Report 📊
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>BhavishyaMitra tera mahina analyze karega.</p>
        </motion.div>

        {/* User summary */}
        <div className="card-flat" style={{ padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          {[
            { label: 'Level', value: `L${level}` },
            { label: 'XP', value: xp.toLocaleString('en-IN') },
            { label: 'Streak', value: `🔥 ${streak}d` },
            { label: 'Corpus', value: formatCorpus(corpus) },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {!report && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🧠</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Generate Tera Report</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
              BhavishyaMitra tera is mahine ka behavior analyze karega — quests, simulator, topics — aur personalized insights dega.
            </p>
            {error && <p style={{ color: 'var(--danger)', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{error}</p>}
            <button onClick={generateReport} className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
              <Sparkles size={18} /> Report Banao
            </button>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>Works with or without API key — always gives insights.</p>
          </motion.div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '48px 20px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ fontSize: 48, display: 'inline-block', marginBottom: 20 }}>🧠</motion.div>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>BhavishyaMitra tera report bana raha hai...</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Thoda wait karo — teri puri journey analyze ho rahi hai</p>
          </motion.div>
        )}

        {report && (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Offline badge */}
              {offline && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#F59E0B10', border: '1px solid #F59E0B30', borderRadius: 10, marginBottom: 16, fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>
                  <WifiOff size={13} /> Offline mode — add OpenRouter key for AI-powered reports
                </div>
              )}

              {/* IQ Score */}
              <div className="card" style={{ padding: '24px', marginBottom: 16, textAlign: 'center' }}>
                <IQGauge score={report.pension_iq_score} />
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.6 }}>{report.score_reason}</p>
              </div>

              {/* Avatar story */}
              <div className="card-flat" style={{ padding: '18px', marginBottom: 16, background: 'var(--gradient-card)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Is Mahine Ki Kahani</div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{report.avatar_story}</p>
              </div>

              {/* Strengths */}
              <ReportSection icon={<CheckCircle size={16} color="#22C55E" />} title="Kya acha kiya" items={[report.strength_1, report.strength_2]} type="good" />

              {/* Blind spots */}
              <ReportSection icon={<AlertTriangle size={16} color="#F59E0B" />} title="Kahan dhyan dena hai" items={[report.blind_spot_1, report.blind_spot_2]} type="gap" />

              {/* One action */}
              <ReportSection icon={<Target size={16} color="var(--accent-primary)" />} title="Ek Zaroori Kadam" items={[report.one_action]} type="action" />

              {/* Next challenge */}
              <ReportSection icon={<TrendingUp size={16} color="var(--accent-primary)" />} title="Agla Challenge" items={[report.next_challenge]} type="action" />

              {/* Encouragement */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                style={{ padding: '18px', background: 'var(--accent-glow)', borderRadius: 16, border: '1px solid var(--accent-primary)30', textAlign: 'center', marginBottom: 20 }}>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, fontWeight: 500 }}>{report.encouragement}</p>
              </motion.div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleShare} className="btn-primary" style={{ flex: 1, padding: '14px' }}>
                  <Share2 size={16} /> Share Score
                </button>
                <button onClick={() => { setReport(null); }} className="btn-secondary" style={{ flex: 1, padding: '14px' }}>
                  <RefreshCw size={16} /> Regenerate
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
