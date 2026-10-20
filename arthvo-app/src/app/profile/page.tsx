'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { Theme, Language, CoachPersonality, AvatarCharacter, Terminology } from '@/contexts/EnvironmentContext';
import { getLevelFromXP, getXPForNextLevel, LEVEL_NAMES } from '@/lib/utils';
import { calculateCorpus, formatCorpus } from '@/lib/calculator';
import {
  User, Globe, Palette, Bot, BookOpen, Bell, ChevronRight,
  Star, Flame, Shield, LogOut, Award, Settings
} from 'lucide-react';

const THEMES: { value: Theme; label: string; emoji: string; desc: string }[] = [
  { value: 'dhoop', label: 'Dhoop', emoji: '☀️', desc: 'Marigold & terracotta' },
  { value: 'raat', label: 'Raat', emoji: '🌙', desc: 'Midnight & gold' },
  { value: 'jungle', label: 'Jungle', emoji: '🌿', desc: 'Forest & earth' },
  { value: 'shahar', label: 'Shahar', emoji: '🏙️', desc: 'Clean & electric' },
  { value: 'mela', label: 'Mela', emoji: '🎪', desc: 'Festival energy' },
];

const LANGUAGES: { value: Language; label: string; native: string }[] = [
  { value: 'hi', label: 'Hindi', native: 'हिंदी' },
  { value: 'en', label: 'English', native: 'English' },
  { value: 'mr', label: 'Marathi', native: 'मराठी' },
  { value: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { value: 'te', label: 'Telugu', native: 'తెలుగు' },
  { value: 'bn', label: 'Bengali', native: 'বাংলা' },
];

const COACHES: { value: CoachPersonality; label: string; emoji: string; desc: string }[] = [
  { value: 'dost', label: 'Dost', emoji: '🤙', desc: '"Yaar seriously?" — Casual Hinglish' },
  { value: 'bhaiya', label: 'Bhaiya/Didi', emoji: '🙏', desc: 'Caring, patient, older sibling' },
  { value: 'mentor', label: 'Mentor', emoji: '💼', desc: 'Calm, data-driven, professional' },
  { value: 'strict', label: 'Strict Coach', emoji: '🔥', desc: '"No excuses" — Direct & pushy' },
];

const AVATARS: { value: AvatarCharacter; label: string; emoji: string; desc: string }[] = [
  { value: 'arjun', label: 'Arjun', emoji: '👦', desc: '23 · Pune · Logistics' },
  { value: 'priya', label: 'Priya', emoji: '👧', desc: '25 · Chennai · IT' },
  { value: 'raza', label: 'Raza', emoji: '🧑', desc: '22 · Lucknow · Gig' },
  { value: 'meera', label: 'Meera', emoji: '👩', desc: '21 · Jaipur · Student' },
];

const TERMS: { value: Terminology; label: string; emoji: string; desc: string }[] = [
  { value: 'simple', label: 'Beginner', emoji: '🌱', desc: '"Monthly savings" not "Contribution"' },
  { value: 'standard', label: 'Standard', emoji: '📈', desc: 'Regular NPS terms' },
  { value: 'expert', label: 'Expert', emoji: '🎓', desc: 'Full PFRDA terminology' },
];

type Section = 'language' | 'theme' | 'coach' | 'avatar' | 'terms' | null;

function OptionPicker<T extends string>({
  options, current, onSelect, keyField = 'value'
}: {
  options: { value: T; label: string; emoji: string; desc?: string }[];
  current: T;
  onSelect: (v: T) => void;
  keyField?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0 16px' }}>
      {options.map(opt => {
        const isSelected = current === opt.value;
        return (
          <motion.button
            key={opt.value}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opt.value)}
            style={{
              background: isSelected ? 'var(--accent-glow)' : 'var(--bg-secondary)',
              border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border)'}`,
              borderRadius: 14, padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0 }}>{opt.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: isSelected ? 700 : 600, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                {opt.label}
              </div>
              {opt.desc && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{opt.desc}</div>}
            </div>
            {isSelected && (
              <div style={{
                width: 22, height: 22, borderRadius: '50%', background: 'var(--gradient-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13,
              }}>✓</div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function LanguagePicker({ current, onSelect }: { current: Language; onSelect: (v: Language) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, padding: '4px 0 16px' }}>
      {LANGUAGES.map(l => {
        const isSelected = current === l.value;
        return (
          <motion.button
            key={l.value}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(l.value)}
            style={{
              background: isSelected ? 'var(--accent-glow)' : 'var(--bg-secondary)',
              border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border)'}`,
              borderRadius: 14, padding: '14px 12px', cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)', marginBottom: 2 }}>
              {l.native}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.label}</div>
          </motion.button>
        );
      })}
    </div>
  );
}

function SettingRow({
  icon, label, value, onClick, dangerous
}: { icon: React.ReactNode; label: string; value?: string; onClick?: () => void; dangerous?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', background: 'none', border: 'none', cursor: onClick ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 12, flexShrink: 0,
        background: dangerous ? 'rgba(239,68,68,0.1)' : 'var(--bg-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: dangerous ? '#EF4444' : 'var(--text-primary)' }}>{label}</div>
        {value && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{value}</div>}
      </div>
      {onClick && <ChevronRight size={16} color="var(--text-muted)" />}
    </button>
  );
}

export default function ProfilePage() {
  const { xp, level, levelName, streak, age, income, name, setName, setAge, setIncome } = useUser();
  const {
    theme, language, coachPersonality, avatarCharacter, terminology,
    setTheme, setLanguage, setCoachPersonality, setAvatarCharacter, setTerminology,
  } = useEnvironment();

  const [openSection, setOpenSection] = useState<Section>(null);
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(name || 'Arjun');

  const nextXP = getXPForNextLevel(level);
  const prevXP = getXPForNextLevel(level - 1);
  const progress = Math.min(100, ((xp - prevXP) / (nextXP - prevXP)) * 100);

  const contribution = Math.round(income * 0.1);
  const corpus = calculateCorpus({ currentAge: age, retirementAge: 60, monthlyContribution: contribution });

  const toggleSection = (s: Section) => setOpenSection(prev => prev === s ? null : s);

  const sections: {
    id: Section;
    icon: React.ReactNode;
    label: string;
    value: string;
  }[] = [
    { id: 'language', icon: <Globe size={18} color="var(--accent-primary)" />, label: 'Language', value: LANGUAGES.find(l => l.value === language)?.native || language },
    { id: 'theme', icon: <Palette size={18} color="#EC4899" />, label: 'Theme', value: THEMES.find(t => t.value === theme)?.label || theme },
    { id: 'coach', icon: <Bot size={18} color="#6366F1" />, label: 'Coach Personality', value: COACHES.find(c => c.value === coachPersonality)?.label || coachPersonality },
    { id: 'avatar', icon: <User size={18} color="#22C55E" />, label: 'Avatar Character', value: AVATARS.find(a => a.value === avatarCharacter)?.label || avatarCharacter },
    { id: 'terms', icon: <BookOpen size={18} color="#F59E0B" />, label: 'Terminology Level', value: TERMS.find(t => t.value === terminology)?.label || terminology },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
      <TopBar />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ padding: '24px 20px', marginBottom: 20, textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{
            position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
            width: 200, height: 200, borderRadius: '50%',
            background: 'var(--accent-glow)', filter: 'blur(50px)', opacity: 0.4,
          }} />

          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38, margin: '0 auto 12px',
            boxShadow: '0 8px 24px var(--accent-glow)',
          }}>
            {AVATARS.find(a => a.value === avatarCharacter)?.emoji || '👦'}
          </div>

          {/* Name */}
          {editName ? (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                style={{
                  background: 'var(--bg-secondary)', border: '2px solid var(--accent-primary)',
                  borderRadius: 10, padding: '8px 14px', fontSize: 15, fontWeight: 600,
                  color: 'var(--text-primary)', outline: 'none', width: 180,
                }}
                autoFocus
              />
              <button
                onClick={() => { setName(nameInput); setEditName(false); }}
                style={{
                  background: 'var(--gradient-accent)', color: 'white', border: 'none',
                  borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontWeight: 700,
                }}
              >Save</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                {name || 'Arjun'}
              </h2>
              <button
                onClick={() => setEditName(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
              >✏️</button>
            </div>
          )}

          <div style={{
            display: 'inline-block', fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)',
            background: 'var(--accent-glow)', borderRadius: 8, padding: '3px 12px', marginBottom: 16,
          }}>
            Level {level} — {levelName}
          </div>

          {/* XP Progress */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={12} fill="var(--accent-primary)" color="var(--accent-primary)" />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)' }}>{xp.toLocaleString('en-IN')} XP</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Next: {nextXP.toLocaleString('en-IN')}</span>
            </div>
            <div className="xp-bar-track">
              <motion.div className="xp-bar-fill" animate={{ width: `${progress}%` }} transition={{ duration: 1 }} />
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Streak', value: `${streak}d`, icon: '🔥' },
              { label: 'Corpus', value: formatCorpus(corpus), icon: '💰' },
              { label: 'Badges', value: '8', icon: '🏅' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'var(--bg-secondary)', borderRadius: 12, padding: '10px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, marginBottom: 3 }}>{stat.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Personal details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: '16px 20px', marginBottom: 20 }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Personal Details
          </h3>
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Age</label>
              <input
                type="number" value={age} min={18} max={55}
                onChange={e => setAge(Number(e.target.value))}
                style={{
                  width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '10px 12px', fontSize: 14, fontWeight: 600,
                  color: 'var(--text-primary)', outline: 'none',
                }}
              />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Monthly Income (₹)</label>
              <input
                type="number" value={income} min={5000} step={1000}
                onChange={e => setIncome(Number(e.target.value))}
                style={{
                  width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '10px 12px', fontSize: 14, fontWeight: 600,
                  color: 'var(--text-primary)', outline: 'none',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Environment Settings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
          style={{ padding: '16px 20px', marginBottom: 20 }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Environment
          </h3>

          {sections.map((s) => (
            <div key={s.id}>
              <button
                onClick={() => toggleSection(s.id)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                  borderBottom: openSection === s.id ? 'none' : '1px solid var(--border)',
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 12, background: 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{s.value}</div>
                </div>
                <motion.div animate={{ rotate: openSection === s.id ? 90 : 0 }}>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openSection === s.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {s.id === 'language' && <LanguagePicker current={language} onSelect={(v) => { setLanguage(v); setOpenSection(null); }} />}
                    {s.id === 'theme' && <OptionPicker options={THEMES} current={theme} onSelect={(v) => { setTheme(v); setOpenSection(null); }} />}
                    {s.id === 'coach' && <OptionPicker options={COACHES} current={coachPersonality} onSelect={(v) => { setCoachPersonality(v); setOpenSection(null); }} />}
                    {s.id === 'avatar' && <OptionPicker options={AVATARS} current={avatarCharacter} onSelect={(v) => { setAvatarCharacter(v); setOpenSection(null); }} />}
                    {s.id === 'terms' && <OptionPicker options={TERMS} current={terminology} onSelect={(v) => { setTerminology(v); setOpenSection(null); }} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Other settings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
          style={{ padding: '16px 20px', marginBottom: 20 }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            More
          </h3>
          <SettingRow icon={<Award size={18} color="var(--accent-primary)" />} label="Badges & Achievements" value="See all your badges" onClick={() => window.location.href = '/badges'} />
          <SettingRow icon={<Shield size={18} color="#6366F1" />} label="Privacy & DPDP" value="DPDP Act 2023 Compliant" />
          <SettingRow icon={<Star size={18} color="#F5A623" />} label="About Arthvo" value="Top 3 PFRDA · IIT Kanpur" />
          <SettingRow icon={<LogOut size={18} color="#EF4444" />} label="Reset Progress" value="Clear all local data" dangerous onClick={() => {
            if (confirm('Are you sure? This will reset all your XP, badges, and settings.')) {
              localStorage.clear();
              window.location.href = '/';
            }
          }} />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', padding: '0 0 8px' }}
        >
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Arthvo v2.0 · Built by Shivam Dnyaneshwar Raut, Pune
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            PFRDA Top 3 · DPDP Act 2023 Compliant · arthvo.in
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
