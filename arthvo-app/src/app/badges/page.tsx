'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Lock, Share2 } from 'lucide-react';

interface Badge {
  id: string;
  emoji: string;
  name: string;
  description: string;
  category: 'learning' | 'streak' | 'simulator' | 'social' | 'identity';
  xpRequired?: number;
  condition: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const categoryColors: Record<string, string> = {
  learning: '#6366F1',
  streak: '#F97316',
  simulator: '#22C55E',
  social: '#EC4899',
  identity: '#F5A623',
};

const categoryLabels: Record<string, string> = {
  learning: '📚 Learning',
  streak: '🔥 Streaks',
  simulator: '📊 Simulator',
  social: '👥 Social',
  identity: '⭐ Identity',
};

export default function BadgesPage() {
  const { xp, level, streak } = useUser();
  const [selected, setSelected] = useState<Badge | null>(null);
  const [shareMsg, setShareMsg] = useState('');

  const BADGES: Badge[] = [
    // Identity
    { id: 'b1', emoji: '🌱', name: 'Naya Arthvo', description: 'Tumhara pehla kadam', category: 'identity', condition: 'Complete onboarding', unlocked: true, unlockedAt: 'May 2025' },
    { id: 'b2', emoji: '📈', name: 'Seekhta Arthvo', description: 'Samajhna shuru kiya', category: 'identity', xpRequired: 500, condition: 'Reach 500 XP', unlocked: xp >= 500 },
    { id: 'b3', emoji: '🧠', name: 'Samajhta Arthvo', description: 'Ab tu finance samajhta hai', category: 'identity', xpRequired: 1500, condition: 'Reach 1,500 XP', unlocked: xp >= 1500 },
    { id: 'b4', emoji: '🚀', name: 'Badhta Arthvo', description: 'Teri growth dikh rahi hai', category: 'identity', xpRequired: 3500, condition: 'Reach 3,500 XP', unlocked: xp >= 3500 },
    { id: 'b5', emoji: '💪', name: 'Pakka Arthvo', description: 'Solid commitment', category: 'identity', xpRequired: 7000, condition: 'Reach 7,000 XP', unlocked: xp >= 7000 },
    { id: 'b6', emoji: '🏆', name: 'Sachha Arthvo', description: 'Sachhi samajh', category: 'identity', xpRequired: 12000, condition: 'Reach 12,000 XP', unlocked: xp >= 12000 },
    { id: 'b7', emoji: '👑', name: 'Poora Arthvo', description: 'Tu Arthvo ban gaya!', category: 'identity', xpRequired: 20000, condition: 'Reach 20,000 XP', unlocked: xp >= 20000 },
    // Learning
    { id: 'b8', emoji: '🎯', name: 'First Blood', description: 'Pehla quest complete kiya', category: 'learning', condition: 'Complete first quest', unlocked: xp > 50 },
    { id: 'b9', emoji: '⚔️', name: 'Boss Slayer', description: 'Advanced quest jeeta', category: 'learning', condition: 'Complete an Advanced quest', unlocked: xp >= 300 },
    { id: 'b10', emoji: '🧩', name: 'NPS Master', description: 'Sab NPS basics cover kiye', category: 'learning', condition: 'Complete 5 NPS quests', unlocked: xp >= 750 },
    { id: 'b11', emoji: '🔬', name: 'Inflation Fighter', description: 'Inflation ko samjha', category: 'learning', condition: 'Complete Inflation quest', unlocked: xp >= 200 },
    { id: 'b12', emoji: '💡', name: 'Hint-free Hero', description: 'Bina hint ke sahi jawab diya', category: 'learning', condition: 'Answer correctly without hint', unlocked: xp >= 50 },
    // Streaks
    { id: 'b13', emoji: '🔥', name: '3-Day Fire', description: '3 din lagaataar active', category: 'streak', condition: '3-day streak', unlocked: streak >= 3 },
    { id: 'b14', emoji: '⚡', name: '7-Day Thunder', description: 'Ek hafte ki streak', category: 'streak', condition: '7-day streak', unlocked: streak >= 7 },
    { id: 'b15', emoji: '🌊', name: '30-Day Wave', description: 'Ek mahine ki commitment', category: 'streak', condition: '30-day streak', unlocked: streak >= 30 },
    { id: 'b16', emoji: '💯', name: 'Centurion', description: '100-day streak — LEGEND!', category: 'streak', condition: '100-day streak', unlocked: streak >= 100 },
    // Simulator
    { id: 'b17', emoji: '🛠️', name: 'First Simulation', description: 'Simulator try kiya', category: 'simulator', condition: 'Use simulator once', unlocked: true },
    { id: 'b18', emoji: '📊', name: 'Slider Master', description: '10 different configurations try kiye', category: 'simulator', condition: 'Move sliders 10 times', unlocked: xp >= 150 },
    { id: 'b19', emoji: '🏖️', name: 'Thriving Zone', description: 'Simulator mein Thriving state achieve ki', category: 'simulator', condition: 'Reach Thriving in simulator', unlocked: xp >= 300 },
    // Social
    { id: 'b20', emoji: '🤝', name: 'First Referral', description: 'Ek dost ko invite kiya', category: 'social', condition: 'Refer 1 friend', unlocked: false },
    { id: 'b21', emoji: '📣', name: 'Spread the Word', description: '5 doston ko invite kiya', category: 'social', condition: 'Refer 5 friends', unlocked: false },
    { id: 'b22', emoji: '🌐', name: 'Arthvo Ambassador', description: 'Biggest sharer in your city', category: 'social', condition: 'Refer 10 friends', unlocked: false },
  ];

  const unlockedCount = BADGES.filter(b => b.unlocked).length;
  const categories = ['identity', 'learning', 'streak', 'simulator', 'social'] as const;

  const handleShare = (badge: Badge) => {
    const msg = `Main Arthvo mein "${badge.name}" badge unlock kar gaya! 🎉 Tu bhi Arthvo ban — arthvo.in`;
    if (navigator.share) {
      navigator.share({ title: badge.name, text: msg, url: 'https://arthvo.in' });
    } else {
      navigator.clipboard.writeText(msg);
      setShareMsg('Copied!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
      <TopBar />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
            Teri Trophies 🏅
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {unlockedCount}/{BADGES.length} badges unlock hue
          </p>
        </motion.div>

        {/* Overall progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: '16px 20px', marginBottom: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Badge Collection</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)' }}>
              {Math.round((unlockedCount / BADGES.length) * 100)}%
            </span>
          </div>
          <div className="xp-bar-track">
            <motion.div
              className="xp-bar-fill"
              animate={{ width: `${(unlockedCount / BADGES.length) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
            Tu Arthvo ban raha hai. Keep collecting! 🌟
          </p>
        </motion.div>

        {/* Badges by category */}
        {categories.map((cat, ci) => {
          const catBadges = BADGES.filter(b => b.category === cat);
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + ci * 0.08 }}
              style={{ marginBottom: 24 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 8, height: 24, borderRadius: 4,
                  background: categoryColors[cat],
                }} />
                <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  {categoryLabels[cat]}
                </h2>
                <span style={{
                  fontSize: 11, fontWeight: 600, marginLeft: 4,
                  color: 'var(--text-muted)', background: 'var(--bg-secondary)',
                  borderRadius: 8, padding: '2px 8px',
                }}>
                  {catBadges.filter(b => b.unlocked).length}/{catBadges.length}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                {catBadges.map((badge, bi) => (
                  <motion.button
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + ci * 0.08 + bi * 0.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelected(badge)}
                    style={{
                      background: badge.unlocked ? 'var(--bg-card)' : 'var(--bg-secondary)',
                      border: `2px solid ${badge.unlocked ? categoryColors[cat] + '40' : 'var(--border)'}`,
                      borderRadius: 18, padding: '18px 12px', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      position: 'relative', overflow: 'hidden',
                      opacity: badge.unlocked ? 1 : 0.55,
                      boxShadow: badge.unlocked ? `0 4px 20px ${categoryColors[cat]}15` : 'none',
                    }}
                  >
                    {badge.unlocked && (
                      <div style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 8, height: 8, borderRadius: '50%',
                        background: categoryColors[cat],
                      }} />
                    )}
                    <div style={{
                      fontSize: 36, marginBottom: 8, lineHeight: 1,
                      filter: badge.unlocked ? 'none' : 'grayscale(100%)',
                    }}>
                      {badge.unlocked ? badge.emoji : '🔒'}
                    </div>
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: badge.unlocked ? 'var(--text-primary)' : 'var(--text-muted)',
                      textAlign: 'center', lineHeight: 1.3,
                    }}>
                      {badge.name}
                    </div>
                    {badge.unlocked && (
                      <div style={{
                        marginTop: 6, fontSize: 10, fontWeight: 600, color: categoryColors[cat],
                        background: `${categoryColors[cat]}15`, borderRadius: 6, padding: '2px 8px',
                      }}>
                        Unlocked!
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              zIndex: 999, backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'var(--bg-card)', borderRadius: '24px 24px 0 0',
                padding: '32px 28px 48px', width: '100%', maxWidth: 480,
                border: '1px solid var(--border)',
              }}
            >
              {/* Handle */}
              <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 24px' }} />

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 72, lineHeight: 1, marginBottom: 16,
                  filter: selected.unlocked ? 'none' : 'grayscale(100%)',
                }}>
                  {selected.unlocked ? selected.emoji : '🔒'}
                </div>
                <div style={{
                  display: 'inline-block', fontSize: 12, fontWeight: 600,
                  color: categoryColors[selected.category], background: `${categoryColors[selected.category]}15`,
                  borderRadius: 8, padding: '3px 12px', marginBottom: 12,
                }}>
                  {categoryLabels[selected.category]}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                  {selected.name}
                </h3>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 8 }}>{selected.description}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
                  <strong>Condition:</strong> {selected.condition}
                </p>

                {selected.unlocked ? (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={() => handleShare(selected)}
                      style={{
                        flex: 1, background: 'var(--gradient-accent)', color: 'white',
                        border: 'none', borderRadius: 14, padding: '14px',
                        cursor: 'pointer', fontWeight: 700, fontSize: 15,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <Share2 size={16} /> Share Badge
                    </button>
                  </div>
                ) : (
                  <div style={{
                    padding: '14px 20px', background: 'var(--bg-secondary)',
                    borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <Lock size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                      {selected.xpRequired ? `${selected.xpRequired.toLocaleString('en-IN')} XP chahiye — ${Math.max(0, selected.xpRequired - xp).toLocaleString('en-IN')} aur!` : selected.condition}
                    </span>
                  </div>
                )}
                {shareMsg && (
                  <p style={{ marginTop: 10, fontSize: 13, color: '#22C55E', fontWeight: 600 }}>✓ {shareMsg}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
