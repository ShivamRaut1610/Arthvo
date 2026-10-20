'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Zap, CheckCircle, XCircle, Lightbulb, Lock, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  emoji: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xp: number;
  options: string[];
  correct: number;
  hint: string;
  explanation: string;
  topic: string;
}

const QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'NPS Kya Hai?',
    description: 'National Pension System mein contribute karne ka kya faayda hai?',
    emoji: '🎯',
    difficulty: 'Beginner',
    xp: 50,
    topic: 'NPS Basics',
    options: [
      'Sirf government employees ke liye hai',
      'Tax bachata hai aur retirement ke liye corpus banata hai',
      'Fixed deposit jaisa hai bank mein',
      'Insurance plan hai',
    ],
    correct: 1,
    hint: 'Section 80CCD(1B) mein ₹50,000 extra tax deduction milti hai NPS ke liye.',
    explanation: 'NPS ek voluntary retirement savings scheme hai. Yeh tax save karta hai (Section 80C + 80CCD) aur ek bada corpus banata hai jo retirement pe milta hai.',
  },
  {
    id: 'q2',
    title: 'Inflation Monster',
    description: 'Agar inflation 6% per year hai, toh 12 saal mein ₹100 ki value kitni reh jaayegi?',
    emoji: '⚔️',
    difficulty: 'Intermediate',
    xp: 150,
    topic: 'Inflation',
    options: ['₹88', '₹70', '₹50', '₹40'],
    correct: 2,
    hint: 'Rule of 72 yaad karo — 72 ÷ inflation rate = kitne saal mein value half ho jaayegi.',
    explanation: '72 ÷ 6% = 12 saal. Toh 12 saal mein ₹100 ki purchasing power sirf ₹50 reh jaayegi! Isliye sirf savings karna kaafi nahi — investing zaroori hai.',
  },
  {
    id: 'q3',
    title: 'Tier I vs Tier II',
    description: 'NPS Tier I aur Tier II mein kya farak hai?',
    emoji: '🧩',
    difficulty: 'Beginner',
    xp: 100,
    topic: 'NPS Structure',
    options: [
      'Tier I mandatory hai, Tier II optional aur flexible withdrawal ke saath',
      'Tier II mandatory hai, Tier I optional',
      'Dono same hain',
      'Tier I sirf equity mein invest karta hai',
    ],
    correct: 0,
    hint: 'Tier I lock-in hota hai retirement tak. Tier II ek regular investment account ki tarah hai.',
    explanation: 'Tier I mandatory pension account hai jisme withdrawal restricted hai. Tier II ek voluntary savings account hai jahan se aap kabhi bhi paise nikal sakte ho — par tax benefit nahi milta Tier II pe (private sector ke liye).',
  },
  {
    id: 'q4',
    title: 'Boss Fight: Compound Power',
    description: 'Arjun 25 saal mein ₹2,000/month invest karta hai. Raza 35 saal mein shuru karta hai ₹4,000/month se. 60 saal mein kaun zyada paisa kamaayega? (10% return assume karo)',
    emoji: '🏆',
    difficulty: 'Advanced',
    xp: 300,
    topic: 'Compounding',
    options: [
      'Raza, kyunki woh zyada invest karta hai',
      'Arjun, kyunki usne pehle shuru kiya',
      'Dono same rahenge',
      'Depend karta hai market pe',
    ],
    correct: 1,
    hint: 'Compounding ka jaadu time ke saath kaam karta hai — pehle shuru karna zyada important hai amount se.',
    explanation: 'Arjun: ₹2,000 × 420 months at 10% ≈ ₹1.56 Crore. Raza: ₹4,000 × 300 months at 10% ≈ ₹1.34 Crore. Arjun LESS invest karke ZYADA kamaata hai — sirf 10 saal pehle shuru kiya! Time is the real boss.',
  },
  {
    id: 'q5',
    title: 'Gig Worker Quest',
    description: 'Ek delivery agent jiske paas koi employer nahi, NPS mein join ho sakta hai?',
    emoji: '🛵',
    difficulty: 'Beginner',
    xp: 75,
    topic: 'NPS Eligibility',
    options: [
      'Nahi, sirf salaried log join kar sakte hain',
      'Haan, NPS-Swavalamban ya NPS Lite ke through',
      'Nahi, kyunki unke paas PAN card nahi hota',
      'Haan, par sirf ₹1,000/month minimum hai',
    ],
    correct: 1,
    hint: 'PFRDA ne specifically gig workers aur unorganized sector ke liye schemes banaye hain.',
    explanation: 'Haan! Any Indian citizen between 18-70 years can join NPS. Self-employed, gig workers, freelancers — sab join kar sakte hain. NPS-Lite especially low-income groups ke liye design ki gayi hai.',
  },
];

const DIFFICULTY_COLORS = {
  Beginner: '#22C55E',
  Intermediate: '#F59E0B',
  Advanced: '#EF4444',
};

export default function QuestsPage() {
  const { addXP, xp } = useUser();
  const [activeQuest, setActiveQuest] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, { chosen: number; correct: boolean; usedHint: boolean }>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [xpPopup, setXpPopup] = useState<{ id: string; amount: number } | null>(null);

  const handleAnswer = (quest: Quest, optionIndex: number) => {
    if (answers[quest.id]) return; // already answered
    const correct = optionIndex === quest.correct;
    const usedHint = showHint[quest.id] || false;
    const earnedXP = correct ? (usedHint ? Math.floor(quest.xp * 0.7) : quest.xp) : 0;
    setAnswers(prev => ({ ...prev, [quest.id]: { chosen: optionIndex, correct, usedHint } }));
    if (correct && earnedXP > 0) {
      addXP(earnedXP);
      setXpPopup({ id: quest.id, amount: earnedXP });
      setTimeout(() => setXpPopup(null), 2000);
    }
    setShowExplanation(prev => ({ ...prev, [quest.id]: true }));
  };

  const completedCount = Object.values(answers).filter(a => a.correct).length;
  const totalXPEarned = QUESTS.reduce((sum, q) => {
    const ans = answers[q.id];
    if (!ans || !ans.correct) return sum;
    return sum + (ans.usedHint ? Math.floor(q.xp * 0.7) : q.xp);
  }, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 100 }}>
      <TopBar />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
            Aaj ke Quests ⚡
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {completedCount}/{QUESTS.length} complete · {totalXPEarned} XP earned today
          </p>
        </motion.div>

        {/* Progress strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center' }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Daily Progress</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)' }}>{completedCount}/{QUESTS.length}</span>
            </div>
            <div className="xp-bar-track">
              <motion.div
                className="xp-bar-fill"
                animate={{ width: `${(completedCount / QUESTS.length) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={14} fill="var(--accent-primary)" color="var(--accent-primary)" />
            <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--accent-primary)' }}>{totalXPEarned}</span>
          </div>
        </motion.div>

        {/* Quest list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {QUESTS.map((quest, i) => {
            const isOpen = activeQuest === quest.id;
            const answer = answers[quest.id];
            const isAnswered = !!answer;
            const hintShown = showHint[quest.id];
            const explShown = showExplanation[quest.id];

            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
              >
                {/* XP popup */}
                <AnimatePresence>
                  {xpPopup?.id === quest.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 0, scale: 0.8 }}
                      animate={{ opacity: 1, y: -20, scale: 1 }}
                      exit={{ opacity: 0, y: -40 }}
                      style={{
                        position: 'absolute', zIndex: 999,
                        background: 'var(--gradient-accent)', color: 'white',
                        borderRadius: 12, padding: '6px 14px',
                        fontWeight: 800, fontSize: 15,
                        boxShadow: '0 4px 20px var(--accent-glow)',
                        pointerEvents: 'none', marginLeft: 120,
                      }}
                    >
                      +{xpPopup.amount} XP! 🎉
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  className="card"
                  style={{
                    overflow: 'hidden',
                    border: isAnswered
                      ? `2px solid ${answer.correct ? '#22C55E40' : '#EF444440'}`
                      : isOpen ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                  }}
                >
                  {/* Quest header — always visible */}
                  <button
                    onClick={() => setActiveQuest(isOpen ? null : quest.id)}
                    style={{
                      width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                      padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 14,
                      background: isAnswered
                        ? answer.correct ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.12)'
                        : 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, flexShrink: 0,
                    }}>
                      {isAnswered ? (answer.correct ? '✅' : '❌') : quest.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{quest.title}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 600, borderRadius: 6, padding: '2px 8px',
                          background: `${DIFFICULTY_COLORS[quest.difficulty]}20`,
                          color: DIFFICULTY_COLORS[quest.difficulty],
                        }}>{quest.difficulty}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{quest.topic}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Zap size={11} color="var(--accent-primary)" fill="var(--accent-primary)" />
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)' }}>{quest.xp} XP</span>
                        </div>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 20px 20px' }}>
                          {/* Question */}
                          <p style={{
                            fontSize: 15, fontWeight: 600, color: 'var(--text-primary)',
                            lineHeight: 1.6, marginBottom: 16,
                            padding: '14px 16px', background: 'var(--bg-secondary)',
                            borderRadius: 12,
                          }}>
                            {quest.description}
                          </p>

                          {/* Options */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                            {quest.options.map((opt, oi) => {
                              let bg = 'var(--bg-card)';
                              let border = 'var(--border)';
                              let textColor = 'var(--text-primary)';

                              if (isAnswered) {
                                if (oi === quest.correct) { bg = 'rgba(34,197,94,0.12)'; border = '#22C55E'; textColor = '#22C55E'; }
                                else if (oi === answer.chosen && !answer.correct) { bg = 'rgba(239,68,68,0.1)'; border = '#EF4444'; textColor = '#EF4444'; }
                              } else if (!isAnswered) {
                                // Normal interactive
                              }

                              return (
                                <motion.button
                                  key={oi}
                                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                  onClick={() => !isAnswered && handleAnswer(quest, oi)}
                                  style={{
                                    background: bg, border: `2px solid ${border}`,
                                    borderRadius: 12, padding: '12px 16px',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    cursor: isAnswered ? 'default' : 'pointer',
                                    textAlign: 'left', width: '100%',
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  <div style={{
                                    width: 26, height: 26, borderRadius: '50%',
                                    border: `2px solid ${border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, fontSize: 12, fontWeight: 700, color: textColor,
                                  }}>
                                    {isAnswered && oi === quest.correct ? '✓' :
                                      isAnswered && oi === answer.chosen && !answer.correct ? '✗' :
                                        String.fromCharCode(65 + oi)}
                                  </div>
                                  <span style={{ fontSize: 14, fontWeight: 500, color: textColor, lineHeight: 1.4 }}>{opt}</span>
                                </motion.button>
                              );
                            })}
                          </div>

                          {/* Hint button */}
                          {!isAnswered && (
                            <button
                              onClick={() => setShowHint(prev => ({ ...prev, [quest.id]: true }))}
                              style={{
                                background: 'none', border: `1px dashed ${hintShown ? 'var(--accent-primary)' : 'var(--border)'}`,
                                borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                                marginBottom: hintShown ? 10 : 0,
                              }}
                            >
                              <Lightbulb size={14} color={hintShown ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                              <span style={{ fontSize: 13, color: hintShown ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                                {hintShown ? 'Hint: ' + quest.hint : 'Hint lena? (−30% XP)'}
                              </span>
                            </button>
                          )}

                          {/* Explanation */}
                          {explShown && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              style={{
                                background: answer?.correct ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.06)',
                                border: `1px solid ${answer?.correct ? '#22C55E30' : '#EF444430'}`,
                                borderRadius: 12, padding: '12px 14px', marginTop: 12,
                              }}
                            >
                              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                                {answer?.correct
                                  ? <CheckCircle size={16} color="#22C55E" />
                                  : <XCircle size={16} color="#EF4444" />}
                                <span style={{ fontWeight: 700, fontSize: 13, color: answer?.correct ? '#22C55E' : '#EF4444' }}>
                                  {answer?.correct ? 'Sahi jawab!' : 'Galat — par seekhna zaroori hai!'}
                                </span>
                              </div>
                              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {quest.explanation}
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* All done */}
        {completedCount === QUESTS.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{
              marginTop: 24, padding: 28, textAlign: 'center',
              background: 'rgba(34,197,94,0.08)', border: '2px solid #22C55E40',
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 12 }}>🏆</div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#22C55E', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
              Aaj ke sab quests complete!
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Tu Arthvo ban raha hai. {totalXPEarned} XP earned today!
            </p>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Kal wapas aa. Naye quests wait kar rahe hain. 🌟</div>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
