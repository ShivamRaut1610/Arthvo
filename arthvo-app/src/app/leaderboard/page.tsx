'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Trophy, Medal, Star, Flame, TrendingUp, Users, MapPin } from 'lucide-react';

interface LeaderEntry {
  rank: number;
  name: string;
  city: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  isYou?: boolean;
}

const NATIONAL: LeaderEntry[] = [
  { rank: 1, name: 'Rahul Sharma', city: 'Mumbai', avatar: '👦', xp: 18400, level: 6, streak: 42 },
  { rank: 2, name: 'Ananya Iyer', city: 'Chennai', avatar: '👧', xp: 15200, level: 6, streak: 31 },
  { rank: 3, name: 'Arjun Singh', city: 'Delhi', avatar: '🧑', xp: 12800, level: 5, streak: 28 },
  { rank: 4, name: 'Priya Nair', city: 'Bangalore', avatar: '👩', xp: 10500, level: 5, streak: 22 },
  { rank: 5, name: 'Zaid Khan', city: 'Hyderabad', avatar: '👦', xp: 9200, level: 5, streak: 19 },
  { rank: 6, name: 'Meera Joshi', city: 'Pune', avatar: '👧', xp: 8100, level: 4, streak: 15 },
  { rank: 7, name: 'Rohan Gupta', city: 'Kolkata', avatar: '🧑', xp: 7500, level: 4, streak: 12 },
  { rank: 8, name: 'Fatima Shaikh', city: 'Lucknow', avatar: '👩', xp: 6800, level: 4, streak: 18 },
  { rank: 9, name: 'Dev Patel', city: 'Ahmedabad', avatar: '👦', xp: 5900, level: 3, streak: 8 },
  { rank: 10, name: 'Sneha Reddy', city: 'Vijayawada', avatar: '👧', xp: 4700, level: 3, streak: 11 },
];

const PUNE_LOCAL: LeaderEntry[] = [
  { rank: 1, name: 'Shivam Raut', city: 'Pune', avatar: '🧑', xp: 8800, level: 5, streak: 23 },
  { rank: 2, name: 'Meera Joshi', city: 'Pune', avatar: '👩', xp: 8100, level: 4, streak: 15 },
  { rank: 3, name: 'Amit Kulkarni', city: 'Pune', avatar: '👦', xp: 6200, level: 4, streak: 9 },
  { rank: 4, name: 'Pooja Desai', city: 'Pune', avatar: '👧', xp: 4500, level: 3, streak: 7 },
  { rank: 5, name: 'Nikhil More', city: 'Pune', avatar: '🧑', xp: 3200, level: 3, streak: 5 },
];

const AGE_GROUP: LeaderEntry[] = [
  { rank: 1, name: 'Aman Verma', city: 'Jaipur', avatar: '🧑', xp: 14200, level: 6, streak: 38 },
  { rank: 2, name: 'Kavya Sri', city: 'Bangalore', avatar: '👩', xp: 11800, level: 5, streak: 29 },
  { rank: 3, name: 'Rahul Das', city: 'Kolkata', avatar: '👦', xp: 9400, level: 5, streak: 21 },
  { rank: 4, name: 'Tanya Singh', city: 'Delhi', avatar: '👧', xp: 7700, level: 4, streak: 17 },
  { rank: 5, name: 'Varun Kumar', city: 'Mumbai', avatar: '🧑', xp: 6100, level: 4, streak: 14 },
];

const RANK_COLORS = ['#F5A623', '#9CA3AF', '#C4622D'];
const RANK_ICONS = ['🥇', '🥈', '🥉'];

type Tab = 'national' | 'city' | 'age';

export default function LeaderboardPage() {
  const { xp, level, streak } = useUser();
  const [tab, setTab] = useState<Tab>('national');

  // Insert "You" into the list
  const youEntry: LeaderEntry = {
    rank: 247, name: 'Tu (You)', city: 'Pune', avatar: '⭐', xp, level, streak, isYou: true,
  };

  const data: Record<Tab, LeaderEntry[]> = {
    national: [...NATIONAL, youEntry],
    city: [...PUNE_LOCAL, { ...youEntry, rank: 23 }],
    age: [...AGE_GROUP, { ...youEntry, rank: 89 }],
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'national', label: 'National', icon: <TrendingUp size={14} /> },
    { id: 'city', label: 'Pune City', icon: <MapPin size={14} /> },
    { id: 'age', label: '20–25 Yrs', icon: <Users size={14} /> },
  ];

  const currentData = data[tab];
  const yourRank = currentData.find(e => e.isYou)?.rank;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
      <TopBar />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
            Leaderboard 🏆
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Tera rank #{yourRank} — upar aa!
          </p>
        </motion.div>

        {/* Top 3 podium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: '28px 20px', marginBottom: 20, textAlign: 'center' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12 }}>
            {/* 2nd place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>{currentData[1]?.avatar || '👧'}</div>
              <div style={{
                width: 70, height: 60, background: '#9CA3AF20', border: '2px solid #9CA3AF40',
                borderRadius: '12px 12px 0 0', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 18 }}>🥈</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentData[1]?.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>
                  {currentData[1]?.xp.toLocaleString('en-IN')} XP
                </div>
              </div>
            </motion.div>

            {/* 1st place */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{
                fontSize: 13, fontWeight: 700, color: '#F5A623',
                background: 'rgba(245,166,35,0.15)', borderRadius: 8,
                padding: '3px 10px', marginBottom: 6, display: 'inline-block',
              }}>
                #1 Champion
              </div>
              <div style={{ fontSize: 40, marginBottom: 6 }}>{currentData[0]?.avatar || '👦'}</div>
              <div style={{
                width: 80, height: 84, background: 'rgba(245,166,35,0.12)', border: '2px solid #F5A62340',
                borderRadius: '12px 12px 0 0', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 22 }}>🥇</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {currentData[0]?.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: 12, color: '#F5A623', fontWeight: 700 }}>
                  {currentData[0]?.xp.toLocaleString('en-IN')} XP
                </div>
              </div>
            </motion.div>

            {/* 3rd place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>{currentData[2]?.avatar || '🧑'}</div>
              <div style={{
                width: 70, height: 48, background: 'rgba(196,98,45,0.12)', border: '2px solid rgba(196,98,45,0.3)',
                borderRadius: '12px 12px 0 0', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 18 }}>🥉</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentData[2]?.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: 11, color: '#C4622D', fontWeight: 600 }}>
                  {currentData[2]?.xp.toLocaleString('en-IN')} XP
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, background: 'var(--bg-secondary)', borderRadius: 14, padding: 4 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 12, border: 'none',
                background: tab === t.id ? 'var(--bg-card)' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                fontWeight: tab === t.id ? 700 : 500,
                fontSize: 13, color: tab === t.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                boxShadow: tab === t.id ? 'var(--shadow)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {currentData.map((entry, i) => (
              <motion.div
                key={`${entry.rank}-${entry.name}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  background: entry.isYou ? 'var(--accent-glow)' : 'var(--bg-card)',
                  border: entry.isYou ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                  borderRadius: 16, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}
              >
                {/* Rank */}
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: entry.rank <= 3 ? `${RANK_COLORS[entry.rank - 1]}20` : 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: entry.rank <= 3 ? 16 : 13,
                  fontWeight: 800, color: entry.rank <= 3 ? RANK_COLORS[entry.rank - 1] : 'var(--text-muted)',
                }}>
                  {entry.rank <= 3 ? RANK_ICONS[entry.rank - 1] : `#${entry.rank}`}
                </div>

                {/* Avatar + Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, fontSize: 20,
                    background: 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {entry.avatar}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 14, fontWeight: entry.isYou ? 800 : 600,
                      color: entry.isYou ? 'var(--accent-primary)' : 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      {entry.name}
                      {entry.isYou && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: 'white',
                          background: 'var(--gradient-accent)', borderRadius: 6, padding: '1px 6px',
                        }}>YOU</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{entry.city}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 6, padding: '1px 6px' }}>L{entry.level}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                    <Star size={11} fill="var(--accent-primary)" color="var(--accent-primary)" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {entry.xp.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3, justifyContent: 'flex-end' }}>
                    <Flame size={10} color="#FF6B35" />
                    <span style={{ fontSize: 11, color: '#FF6B35', fontWeight: 600 }}>{entry.streak}d</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Motivational callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: 20, padding: '16px 20px', borderRadius: 16,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--accent-primary)' }}>Tip:</strong> Tera dost bhi shuru kar sakta hai! Refer karo aur <strong>+250 XP</strong> pao. 🚀
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
