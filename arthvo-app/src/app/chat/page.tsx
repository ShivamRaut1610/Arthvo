'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/layout/TopBar';
import BottomNav from '@/components/layout/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { calculateCorpus, formatCorpus } from '@/lib/calculator';
import { Send, Mic, MicOff, Sparkles, RotateCcw, Bot, Wifi, WifiOff } from 'lucide-react';

interface Message { id: string; role: 'user' | 'assistant'; text: string; timestamp: Date; offline?: boolean; }

const GREET: Record<string, string> = {
  dost: 'Yaar, kya haal hai! Main BhavishyaMitra hoon — tera future ka dost. NPS, retirement, paisa — kuch bhi pooch. Seedha baat karta hoon! 🤙',
  bhaiya: 'Aao baitho. Main BhavishyaMitra hoon. Teri financial journey mein saath hoon — jab bhi koi sawal ho, poochhte rehna. 🙏',
  mentor: "Welcome. I'm BhavishyaMitra, your AI financial coach. Ask me anything about NPS, retirement planning, or your financial health.",
  strict: 'Theek hai, sun. Main BhavishyaMitra hoon. No nonsense. Retirement ke baare mein serious ho toh pooch. Kya chahiye?',
};

const QUICK = [
  'NPS mein kitna invest karna chahiye?',
  'Mera corpus kitna hoga 60 saal mein?',
  'Tax save kaise karun NPS se?',
  'Tier I aur Tier II mein kya farak hai?',
  'Main gig worker hoon, NPS join kar sakta hoon?',
];

const AVATAR: Record<string, string> = { arjun: '👦', priya: '👧', raza: '🧑', meera: '👩' };

function Dots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
      {[0,1,2].map(i => (
        <motion.div key={i} animate={{ y: [0,-6,0] }} transition={{ duration: 0.6, delay: i*0.15, repeat: Infinity }}
          style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-primary)' }} />
      ))}
    </div>
  );
}

export default function ChatPage() {
  const { age, income, xp, addXP } = useUser();
  const { coachPersonality, avatarCharacter, language } = useEnvironment();
  const [messages, setMessages] = useState<Message[]>([{
    id: 'greet', role: 'assistant',
    text: GREET[coachPersonality] || GREET.dost,
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [xpGiven, setXpGiven] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const corpus = calculateCorpus({ currentAge: age, retirementAge: 60, monthlyContribution: Math.round(income * 0.1) });

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const apiMessages = [...messages, userMsg]
        .filter(m => m.id !== 'greet')
        .map(m => ({ role: m.role, content: m.text }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, personality: coachPersonality, language, age, income, corpus: formatCorpus(corpus) }),
      });

      const data = await res.json();
      setIsOffline(data.offline || false);
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(), role: 'assistant',
        text: data.reply || 'Kuch gadbad hui. Dobara try karo.',
        timestamp: new Date(), offline: data.offline,
      }]);

      if (!xpGiven) { addXP(25); setXpGiven(true); }
    } catch {
      setIsOffline(true);
      setMessages(prev => [...prev, {
        id: (Date.now()+1).toString(), role: 'assistant',
        text: 'Network issue. Internet check karo aur dobara try karo!',
        timestamp: new Date(), offline: true,
      }]);
    }
    setLoading(false);
  };

  const handleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported. Use Chrome!'); return; }
    const r = new SR(); r.lang = language === 'en' ? 'en-IN' : 'hi-IN';
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onresult = (e: any) => setInput(e.results[0][0].transcript);
    r.onerror = () => setListening(false);
    r.start();
  };

  const reset = () => {
    setMessages([{ id: 'greet-'+Date.now(), role: 'assistant', text: GREET[coachPersonality] || GREET.dost, timestamp: new Date() }]);
    setXpGiven(false); setIsOffline(false);
  };

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <TopBar />

      {/* Chat header */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Bot size={22} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>BhavishyaMitra</div>
          <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: isOffline ? 'var(--warning)' : '#22C55E', fontWeight: 600 }}>
            {isOffline ? <WifiOff size={10} /> : <><div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E' }} /><Wifi size={10} /></>}
            {isOffline ? 'Offline mode' : 'AI Connected'}
          </div>
        </div>
        <button onClick={reset} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <RotateCcw size={13} color="var(--text-muted)" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Reset</span>
        </button>
      </div>

      {/* Context */}
      <div style={{ background: 'var(--accent-glow)', borderBottom: '1px solid var(--border-color)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Sparkles size={13} color="var(--accent-primary)" />
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
          Age {age} · ₹{(income/1000).toFixed(0)}K/mo · Corpus {formatCorpus(corpus)}
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map(m => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: m.role === 'assistant' ? 'var(--gradient-accent)' : 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: m.role === 'assistant' ? 0 : 15 }}>
              {m.role === 'assistant' ? <Bot size={14} color="white" /> : AVATAR[avatarCharacter] || '👦'}
            </div>
            <div style={{ maxWidth: '78%', background: m.role === 'user' ? 'var(--gradient-accent)' : 'var(--bg-card)', border: m.role === 'user' ? 'none' : '1px solid var(--border-color)', borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '11px 14px' }}>
              <p style={{ fontSize: 14, color: m.role === 'user' ? 'white' : 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{m.text}</p>
              {m.offline && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>• offline response</div>}
              <div style={{ fontSize: 10, color: m.role === 'user' ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
                {m.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={14} color="white" /></div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px 16px 16px 16px', padding: '12px 16px' }}><Dots /></div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 2 && (
        <div style={{ padding: '8px 16px 0', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 8, paddingBottom: 8 }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => send(q)} style={{ flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '7px 13px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontFamily: 'var(--font-primary)' }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', padding: '10px 16px', paddingBottom: `calc(10px + env(safe-area-inset-bottom))` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', maxWidth: 640, margin: '0 auto' }}>
          <button onClick={handleVoice} style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, border: 'none', background: listening ? 'var(--gradient-accent)' : 'var(--bg-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {listening ? <MicOff size={17} color="white" /> : <Mic size={17} color="var(--text-muted)" />}
          </button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Kuch bhi poochho..." className="input-field"
            style={{ flex: 1, padding: '11px 14px', fontSize: 14, borderRadius: 14 }} />
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => send()} disabled={!input.trim() || loading}
            style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, border: 'none', background: input.trim() && !loading ? 'var(--gradient-accent)' : 'var(--bg-secondary)', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Send size={17} color={input.trim() ? 'white' : 'var(--text-muted)'} />}
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
