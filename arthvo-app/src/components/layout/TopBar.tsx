'use client';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { getXPForNextLevel } from '@/lib/utils';
import { Flame, Star, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGS = [
  { code: 'hi', label: 'हिं', full: 'हिन्दी' },
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'mr', label: 'मर', full: 'मराठी' },
  { code: 'ta', label: 'தமி', full: 'Tamil' },
  { code: 'te', label: 'తెలు', full: 'Telugu' },
  { code: 'bn', label: 'বাং', full: 'বাংলা' },
];

export default function TopBar() {
  const { xp, level, streak } = useUser();
  const { language, save } = useEnvironment();
  const [langOpen, setLangOpen] = useState(false);

  const nextLevelXP = getXPForNextLevel(level);
  const prevLevelXP = getXPForNextLevel(level - 1);
  const progress = Math.min(100, ((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100);
  const currentLang = LANGS.find(l => l.code === language) || LANGS[0];

  const switchLang = (code: string) => {
    save({ language: code as any });
    setLangOpen(false);
  };

  return (
    <header style={{
      background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)',
      padding: '10px 16px', position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img 
            src="/logo-icon.jpeg" 
            alt="Arthvo Logo" 
            style={{ height: 32, width: 32, borderRadius: 8, objectFit: 'cover' }} 
          />
          <span style={{ fontWeight: 800, fontSize: 16, fontFamily: 'var(--font-display)', color: 'var(--accent-primary)' }}>
            Arthvo
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Language switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                borderRadius: 9, padding: '5px 9px', cursor: 'pointer',
                fontFamily: 'var(--font-primary)',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)' }}>
                {currentLang.label}
              </span>
              <ChevronDown size={11} color="var(--text-muted)" />
            </button>

            <AnimatePresence>
              {langOpen && (
                <>
                  <div onClick={() => setLangOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', top: '110%', right: 0, zIndex: 99,
                      background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                      borderRadius: 14, padding: 6, minWidth: 130,
                      boxShadow: 'var(--shadow)',
                    }}
                  >
                    {LANGS.map(l => (
                      <button key={l.code} onClick={() => switchLang(l.code)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                          padding: '9px 12px', border: 'none', borderRadius: 10, cursor: 'pointer',
                          background: language === l.code ? 'var(--accent-glow)' : 'transparent',
                          textAlign: 'left', fontFamily: 'var(--font-primary)',
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)', minWidth: 28 }}>{l.label}</span>
                        <span style={{ fontSize: 12, color: language === l.code ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: language === l.code ? 700 : 500 }}>{l.full}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Streak */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Flame size={15} color="#FF6B35" fill="#FF6B35" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#FF6B35' }}>{streak}</span>
          </div>

          {/* XP + Level */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={12} fill="var(--accent-primary)" color="var(--accent-primary)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)' }}>
                {xp.toLocaleString('en-IN')} XP
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-secondary)' }}>L{level}</span>
            </div>
            <div className="xp-bar-track" style={{ width: 90 }}>
              <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
