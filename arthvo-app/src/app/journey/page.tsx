'use client';
import { motion } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Lock, Check, Star, Zap } from 'lucide-react';

const LEVELS = [
  { level: 1, name: 'Naya Arthvo', nameHi: 'नया Arthvo', xp: 0, badge: '🌱', color: '#94A3B8', unlocks: ['Basic simulator', '5 beginner quests', 'Avatar selection'] },
  { level: 2, name: 'Seekhta Arthvo', nameHi: 'सीखता Arthvo', xp: 500, badge: '📚', color: '#6366F1', unlocks: ['Tax calculator', 'Intermediate quests', 'City leaderboard'] },
  { level: 3, name: 'Samajhta Arthvo', nameHi: 'समझता Arthvo', xp: 1500, badge: '🧠', color: '#22C55E', unlocks: ['All 5 calculators', 'Deep chat (BhavishyaMitra)', 'NPS compare tool'] },
  { level: 4, name: 'Badhta Arthvo', nameHi: 'बढ़ता Arthvo', xp: 3500, badge: '🚀', color: '#F59E0B', unlocks: ['Advanced quests', 'Friends leaderboard', 'Life events simulator'] },
  { level: 5, name: 'Pakka Arthvo', nameHi: 'पक्का Arthvo', xp: 7500, badge: '💪', color: '#F97316', unlocks: ['Monthly Bhavishya report', 'Age group leaderboard', 'Corpus milestone alerts'] },
  { level: 6, name: 'Sachha Arthvo', nameHi: 'सच्चा Arthvo', xp: 15000, badge: '⭐', color: '#EC4899', unlocks: ['NPS enrollment guide', 'Premium scenarios', 'Mentor badge'] },
  { level: 7, name: 'Poora Arthvo', nameHi: 'पूरा Arthvo', xp: 30000, badge: '👑', color: '#F5A623', unlocks: ['PFRDA recognition certificate', 'Hall of Fame', 'Community mentor status'] },
];

const MILESTONES = [
  { afterLevel: 1, text: 'Complete 5 quests →' },
  { afterLevel: 2, text: 'Earn 500 XP →' },
  { afterLevel: 3, text: '7-day streak →' },
  { afterLevel: 4, text: 'Complete all calculators →' },
  { afterLevel: 5, text: '30-day streak →' },
  { afterLevel: 6, text: 'Help a friend join →' },
];

const AVATAR_CHAR: Record<string, string> = { arjun: '👦', priya: '👧', raza: '🧑', meera: '👩' };

export default function JourneyPage() {
  const { xp, level, levelName } = useUser();
  const nextLevel = LEVELS.find(l => l.xp > xp);
  const xpToNext = nextLevel ? nextLevel.xp - xp : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '20px 16px' }}>

        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            Tera Safar 🗺️
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
            Level {level} · {xpToNext > 0 ? `${xpToNext.toLocaleString('en-IN')} XP to next level` : 'Max level reached!'}
          </p>
        </motion.div>

        {/* Current XP banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="card" style={{ padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
          }}>
            {LEVELS[Math.min(level - 1, 6)].badge}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{levelName}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={12} fill="var(--accent-primary)" color="var(--accent-primary)" />
                <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--accent-primary)' }}>{xp.toLocaleString('en-IN')} XP</span>
              </div>
            </div>
            <div className="xp-bar-track">
              <motion.div className="xp-bar-fill"
                animate={{ width: nextLevel ? `${Math.min(100, ((xp - (LEVELS[level - 1]?.xp || 0)) / (nextLevel.xp - (LEVELS[level - 1]?.xp || 0))) * 100)}%` : '100%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Journey path */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 27, top: 0, bottom: 0, width: 3,
            background: 'linear-gradient(to bottom, var(--accent-primary), var(--border-color))',
            borderRadius: 2,
          }} />

          {LEVELS.map((lvl, i) => {
            const isReached = xp >= lvl.xp;
            const isCurrent = level === lvl.level;
            const isLocked = !isReached;
            const milestone = MILESTONES.find(m => m.afterLevel === lvl.level);

            return (
              <div key={lvl.level}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 8, position: 'relative' }}
                >
                  {/* Node */}
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                    background: isLocked ? 'var(--bg-tertiary)' : isReached ? lvl.color : 'var(--bg-secondary)',
                    border: `3px solid ${isLocked ? 'var(--border-color)' : lvl.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isLocked ? 0 : 24,
                    boxShadow: isCurrent ? `0 0 0 6px ${lvl.color}30, 0 8px 24px ${lvl.color}30` : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    {isLocked
                      ? <Lock size={20} color="var(--text-muted)" />
                      : <span>{lvl.badge}</span>}
                  </div>

                  {/* Content */}
                  <div style={{
                    flex: 1, background: isCurrent ? `${lvl.color}10` : isLocked ? 'var(--bg-tertiary)30' : 'var(--bg-card)',
                    border: `1.5px solid ${isCurrent ? lvl.color + '50' : 'var(--border-color)'}`,
                    borderRadius: 16, padding: '14px 16px', opacity: isLocked ? 0.55 : 1,
                    marginBottom: 8,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: 15, color: isCurrent ? lvl.color : 'var(--text-primary)' }}>{lvl.name}</span>
                        {isCurrent && (
                          <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: 'white', background: lvl.color, borderRadius: 6, padding: '2px 8px' }}>YOU ARE HERE</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Zap size={11} color={isReached ? lvl.color : 'var(--text-muted)'} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: isReached ? lvl.color : 'var(--text-muted)' }}>
                          {lvl.xp === 0 ? 'Start' : `${lvl.xp.toLocaleString('en-IN')} XP`}
                        </span>
                      </div>
                    </div>

                    {/* Unlocks */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {lvl.unlocks.map(u => (
                        <div key={u} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {isReached
                            ? <Check size={12} color={lvl.color} strokeWidth={3} />
                            : <div style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--border-color)' }} />}
                          <span style={{ fontSize: 12, color: isReached ? 'var(--text-secondary)' : 'var(--text-muted)', fontWeight: 500 }}>{u}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Milestone marker between levels */}
                {milestone && !isLocked && i < LEVELS.length - 1 && (
                  <div style={{ marginLeft: 72, marginBottom: 16, marginTop: -4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', borderRadius: 8, padding: '4px 10px' }}>
                      {milestone.text}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom motivation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ marginTop: 24, padding: '18px 20px', background: 'var(--accent-glow)', borderRadius: 16, border: '1px solid var(--accent-primary)30', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            🏆 <strong style={{ color: 'var(--accent-primary)' }}>Poora Arthvo</strong> tak pahunchne wale top 3 India mein PFRDA recognition lete hain. Tera safar abhi shuru hai.
          </p>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}
