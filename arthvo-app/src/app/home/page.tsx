'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { calculateCorpus, getAvatarState, formatCorpus, getAvatarStatePercent } from '@/lib/calculator';
import { getLevelFromXP, getXPForNextLevel } from '@/lib/utils';
import { ArrowRight, Flame, Star, Zap, BarChart2, Trophy, ChevronRight } from 'lucide-react';

const AVATAR_CONFIGS = {
  thriving: { emoji: '🏖️', scene: 'Travelling at 60, happy family', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', msg: 'Wah bhai! Tu sahi track pe hai! 🎉' },
  stable:   { emoji: '🏡', scene: 'Comfortable, happy life', color: '#6366F1', bg: 'rgba(99,102,241,0.1)', msg: 'Theek chal raha hai. Thoda aur badha!' },
  struggling: { emoji: '😟', scene: 'Dependent on children', color: '#EAB308', bg: 'rgba(234,179,8,0.1)', msg: 'Yaar seriously? Slider upar karo abhi!' },
  critical: { emoji: '😰', scene: 'Working at 65, exhausted', color: '#F97316', bg: 'rgba(249,115,22,0.1)', msg: 'Bhai please abhi shuru kar. Main teri help karunga.' },
  zero:     { emoji: '💔', scene: 'Alone, uncertain future', color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)', msg: 'Yaar please shuru kar. Ek chota step aaj hi.' },
};

const CHARACTER_EMOJI: Record<string, string> = {
  arjun: '👦', priya: '👧', raza: '🧑', meera: '👩',
};

const DAILY_QUESTS = [
  { id: 'q1', title: 'NPS ke 3 faayde batao', xp: 50, difficulty: 'Beginner', emoji: '🎯', done: false },
  { id: 'q2', title: 'Inflation Monster ko harao', xp: 150, difficulty: 'Intermediate', emoji: '⚔️', done: false },
  { id: 'q3', title: 'Tier I vs Tier II ka fark', xp: 100, difficulty: 'Beginner', emoji: '🧩', done: false },
];

export default function HomePage() {
  const { xp, level, levelName, streak, age, income, avatarState } = useUser();
  const { avatarCharacter, coachPersonality } = useEnvironment();

  const contribution = Math.round(income * 0.1);
  const corpus = calculateCorpus({ currentAge: age, retirementAge: 60, monthlyContribution: contribution });
  const currentState = getAvatarState(corpus, age);
  const percent = getAvatarStatePercent(corpus, age);
  const config = AVATAR_CONFIGS[currentState];

  const nextLevelXP = getXPForNextLevel(level);
  const prevLevelXP = getXPForNextLevel(level - 1);
  const xpProgress = Math.min(100, ((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100);
  const xpToNext = Math.max(0, nextLevelXP - xp);

  const coachGreet: Record<string, string> = {
    dost: `Yaar, kya haal hai? Aaj ka quest complete kar!`,
    bhaiya: `Aa gaye! Aaj bhi seekhte hain kuch naya.`,
    mentor: `Good to see you. Let's make progress today.`,
    strict: `No excuses today. Complete your quests NOW.`,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
      <TopBar />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>

        {/* Welcome + Streak */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}
        >
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              Namaste {CHARACTER_EMOJI[avatarCharacter]}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 2 }}>{coachGreet[coachPersonality]}</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,107,53,0.12)', borderRadius: 12,
            padding: '8px 14px', border: '1px solid rgba(255,107,53,0.3)',
          }}>
            <Flame size={18} color="#FF6B35" fill="#FF6B35" />
            <span style={{ fontWeight: 800, fontSize: 16, color: '#FF6B35' }}>{streak}</span>
            <span style={{ fontSize: 11, color: '#FF6B35', fontWeight: 600 }}>day streak</span>
          </div>
        </motion.div>

        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            background: config.bg,
            border: `2px solid ${config.color}40`,
            borderRadius: 24,
            padding: '24px 20px',
            marginBottom: 20,
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div className={`animate-float avatar-${currentState}`} style={{ fontSize: 72, lineHeight: 1, marginBottom: 10 }}>
            {config.emoji}
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: config.color, textTransform: 'capitalize', marginBottom: 4 }}>
            {currentState}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>{config.scene}</p>

          {/* Progress bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Retirement Target</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: config.color }}>{percent}%</span>
            </div>
            <div className="xp-bar-track">
              <motion.div
                className="xp-bar-fill"
                animate={{ width: `${percent}%`, background: `linear-gradient(90deg, ${config.color}, ${config.color}AA)` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div style={{ fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {formatCorpus(corpus)}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Projected corpus at 60</p>

          {/* Coach message */}
          <div style={{
            background: 'var(--bg-card)', borderRadius: 12, padding: '10px 14px',
            fontSize: 13, color: 'var(--text-secondary)', textAlign: 'left', border: '1px solid var(--border)',
          }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>BhavishyaMitra: </span>
            {config.msg}
          </div>

          <Link href="/simulator" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ marginTop: 14, width: '100%', fontSize: 14 }}>
              Open Simulator <ArrowRight size={14} />
            </button>
          </Link>
        </motion.div>

        {/* XP / Level Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
          style={{ padding: 20, marginBottom: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={14} fill="var(--accent-primary)" color="var(--accent-primary)" />
                <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--accent-primary)' }}>
                  {xp.toLocaleString('en-IN')} XP
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{levelName}</p>
            </div>
            <div style={{
              background: 'var(--gradient-accent)', borderRadius: 12, padding: '6px 14px',
              fontWeight: 800, fontSize: 18, color: 'white', fontFamily: 'var(--font-display)',
            }}>
              L{level}
            </div>
          </div>
          <div className="xp-bar-track">
            <motion.div
              className="xp-bar-fill"
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textAlign: 'right' }}>
            {xpToNext.toLocaleString('en-IN')} XP to Level {Math.min(level + 1, 7)}
          </p>
        </motion.div>

        {/* Daily Quests Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              Aaj ke Quests ⚡
            </h2>
            <Link href="/quests" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: 'var(--accent-primary)' }}>
              Sab dekho <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DAILY_QUESTS.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
              >
                <Link href="/quests" style={{ textDecoration: 'none' }}>
                  <div className="card" style={{
                    padding: '16px 18px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, flexShrink: 0,
                    }}>
                      {q.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 3 }}>
                        {q.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{q.difficulty}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                      <Zap size={13} color="var(--accent-primary)" fill="var(--accent-primary)" />
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-primary)' }}>+{q.xp}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
        >
          <Link href="/leaderboard" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: 18, textAlign: 'center' }}>
              <Trophy size={28} color="#F5A623" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Leaderboard</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Apna rank dekho</div>
            </div>
          </Link>
          <Link href="/report" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: 18, textAlign: 'center' }}>
              <BarChart2 size={28} color="#6366F1" style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Bhavishya Score</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Monthly report</div>
            </div>
          </Link>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
