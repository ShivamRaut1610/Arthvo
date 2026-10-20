'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { useUser } from '@/contexts/UserContext';
import { ArrowRight, Check } from 'lucide-react';

const STEPS = [
  {
    id: 'language',
    question: 'Kaunsi bhasha mein baat karein?',
    subtext: 'Which language feels like home?',
    options: [
      { value: 'hi', label: 'हिंदी', sub: 'Hindi' },
      { value: 'en', label: 'English', sub: 'English' },
      { value: 'mr', label: 'मराठी', sub: 'Marathi' },
      { value: 'ta', label: 'தமிழ்', sub: 'Tamil' },
      { value: 'te', label: 'తెలుగు', sub: 'Telugu' },
      { value: 'bn', label: 'বাংলা', sub: 'Bengali' },
    ],
  },
  {
    id: 'coach',
    question: 'BhavishyaMitra kaisa ho?',
    subtext: 'How should your AI coach talk to you?',
    options: [
      { value: 'dost', label: '🤙 Dost', sub: '"Yaar seriously?" — Casual, Hinglish' },
      { value: 'bhaiya', label: '🙏 Bhaiya/Didi', sub: '"Sunna mere baat" — Caring, patient' },
      { value: 'mentor', label: '💼 Mentor', sub: 'Calm, data-driven, professional' },
      { value: 'strict', label: '🔥 Strict Coach', sub: '"No excuses" — Direct & pushy' },
    ],
  },
  {
    id: 'theme',
    question: 'Kaisa look chahiye?',
    subtext: 'Pick your Arthvo vibe',
    options: [
      { value: 'dhoop', label: '☀️ Dhoop', sub: 'Marigold & terracotta' },
      { value: 'raat', label: '🌙 Raat', sub: 'Midnight blue & gold' },
      { value: 'jungle', label: '🌿 Jungle', sub: 'Forest green & earth' },
      { value: 'shahar', label: '🏙️ Shahar', sub: 'Clean grey & electric blue' },
      { value: 'mela', label: '🎪 Mela', sub: 'Hot pink & festival energy' },
    ],
  },
  {
    id: 'avatar',
    question: 'Tu kaun hai?',
    subtext: 'Pick your avatar — your future self',
    options: [
      { value: 'arjun', label: '👦 Arjun', sub: '23 · Pune · Logistics job' },
      { value: 'priya', label: '👧 Priya', sub: '25 · Chennai · IT job' },
      { value: 'raza', label: '🧑 Raza', sub: '22 · Lucknow · Gig worker' },
      { value: 'meera', label: '👩 Meera', sub: '21 · Jaipur · Student' },
    ],
  },
  {
    id: 'terms',
    question: 'Kitna financial knowledge hai?',
    subtext: 'We\'ll match the language to your level',
    options: [
      { value: 'simple', label: '🌱 Beginner', sub: '"Monthly savings" not "Monthly contribution"' },
      { value: 'standard', label: '📈 Standard', sub: 'Regular NPS terms' },
      { value: 'expert', label: '🎓 Expert', sub: 'Full PFRDA technical terminology' },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setTheme, setLanguage, setCoachPersonality, setAvatarCharacter, setTerminology } = useEnvironment();
  const { completeOnboarding, addXP } = useUser();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});

  const currentStep = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleSelect = (value: string) => {
    setSelected(prev => ({ ...prev, [currentStep.id]: value }));
  };

  const handleNext = () => {
    if (!selected[currentStep.id]) return;

    if (isLast) {
      // Apply all selections
      if (selected.theme) setTheme(selected.theme as Parameters<typeof setTheme>[0]);
      if (selected.language) setLanguage(selected.language as Parameters<typeof setLanguage>[0]);
      if (selected.coach) setCoachPersonality(selected.coach as Parameters<typeof setCoachPersonality>[0]);
      if (selected.avatar) setAvatarCharacter(selected.avatar as Parameters<typeof setAvatarCharacter>[0]);
      if (selected.terms) setTerminology(selected.terms as Parameters<typeof setTerminology>[0]);
      completeOnboarding();
      addXP(100);
      router.push('/home');
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-hero)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === step ? 28 : 8,
              background: i <= step ? 'var(--accent-primary)' : 'var(--border)',
            }}
            style={{ height: 8, borderRadius: 4, transition: 'all 0.3s ease' }}
          />
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 480 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 8 }}>
                Step {step + 1} of {STEPS.length}
              </div>
              <h2 style={{
                fontSize: 'clamp(22px, 5vw, 30px)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                marginBottom: 8,
              }}>
                {currentStep.question}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>{currentStep.subtext}</p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {currentStep.options.map((opt) => {
                const isSelected = selected[currentStep.id] === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      background: isSelected ? 'var(--accent-glow)' : 'var(--bg-card)',
                      border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border)'}`,
                      borderRadius: 16,
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 20px var(--accent-glow)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{opt.sub}</div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'var(--gradient-accent)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={16} color="white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!selected[currentStep.id]}
              style={{
                width: '100%',
                opacity: selected[currentStep.id] ? 1 : 0.4,
                fontSize: 17,
                padding: '16px',
              }}
            >
              {isLast ? 'Arthvo Ban Jao! 🚀' : 'Aage Badhein'} <ArrowRight size={18} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
