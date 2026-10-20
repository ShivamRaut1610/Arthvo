import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getAdminConfig() {
  try {
    const p = path.join(process.cwd(), '.arthvo-admin-config.json');
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {}
  return {};
}

const PERSONALITY_SYSTEM: Record<string, string> = {
  dost: `You are BhavishyaMitra, a fun Hinglish-speaking AI financial coach for young Indians. Personality: casual, warm, like a best friend. Use Hinglish (mix Hindi + English naturally). Be specific, use emojis, reference NPS facts accurately. Keep responses under 120 words. Never give generic advice — always tie to the user's actual numbers.`,
  bhaiya: `You are BhavishyaMitra, a caring older sibling AI coach for young Indians learning about NPS and retirement. Personality: patient, warm, nurturing. Speak in Hinglish with a big-sibling tone. Be supportive but honest. Keep responses under 120 words. Use real NPS figures.`,
  mentor: `You are BhavishyaMitra, a professional financial mentor AI for young Indians. Personality: calm, data-driven, precise. Mix English with occasional Hindi. Cite specific sections (80CCD, PFRDA rules) accurately. Keep responses under 130 words. No fluff.`,
  strict: `You are BhavishyaMitra, a tough-love financial coach AI. Personality: direct, no-nonsense, slightly blunt. Short sentences. Push the user to act. No excuses accepted. Hinglish OK. Keep under 100 words. Real NPS numbers only.`,
};

const LANG_INSTRUCTION: Record<string, string> = {
  hi: 'Respond primarily in Hindi (Devanagari + Roman mix OK).',
  en: 'Respond in English.',
  mr: 'Respond primarily in Marathi.',
  ta: 'Respond primarily in Tamil.',
  te: 'Respond primarily in Telugu.',
  bn: 'Respond primarily in Bengali.',
};

export async function POST(req: NextRequest) {
  try {
    const { messages, personality, language, age, income, corpus } = await req.json();

    // Get API key — first try file-based admin config, then env
    const adminConfig = getAdminConfig();
    const apiKey = adminConfig.primaryKey || process.env.OPENROUTER_API_KEY || '';

    if (!apiKey) {
      return NextResponse.json({
        reply: getOfflineReply(messages[messages.length - 1]?.content || '', personality),
        offline: true,
      });
    }

    const model = adminConfig.chatModel || process.env.CHAT_MODEL || 'openai/gpt-4o-mini';

    const systemPrompt = [
      PERSONALITY_SYSTEM[personality] || PERSONALITY_SYSTEM.dost,
      LANG_INSTRUCTION[language] || LANG_INSTRUCTION.hi,
      `User context: Age ${age}, Monthly income ₹${income?.toLocaleString('en-IN')}, Projected corpus ${corpus || 'unknown'}.`,
      `Always be specific to these numbers. NPS facts must be accurate (PFRDA regulated, 80CCD tax benefits, 10%+ historical returns).`,
    ].join('\n');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://arthvo.in',
        'X-Title': 'Arthvo BhavishyaMitra',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-8), // last 8 messages for context
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      // Fallback to offline responses if API fails
      return NextResponse.json({
        reply: getOfflineReply(messages[messages.length - 1]?.content || '', personality),
        offline: true,
        error: err?.error?.message,
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ reply, offline: false });
  } catch (e: any) {
    return NextResponse.json({ reply: 'Thoda technical issue hai. Dobara try karo!', offline: true }, { status: 200 });
  }
}

function getOfflineReply(msg: string, personality: string): string {
  const m = msg.toLowerCase();
  const replies: Record<string, Record<string, string>> = {
    dost: {
      default: 'Yaar, acha sawal! NPS mein 10% income invest karo. Tax bachega, corpus banegaa. Simple hai! 🔥',
      tax: 'Bhai sun — 80CCD(1B) mein ₹50,000 EXTRA deduction milti hai NPS pe. 30% bracket mein ho toh ₹15,600 straight tax bachega. Free money hai yaar!',
      corpus: 'Tera corpus depend karta hai age aur contribution pe. Simulator try kar — real numbers milenge. Abhi jo contribution hai uspe 10% badha ke dekh!',
    },
    mentor: {
      default: 'NPS provides tax efficiency under 80CCD with additional ₹50,000 deduction under 80CCD(1B). Historical equity returns: 12-14% annualized. Recommend starting immediately.',
      tax: 'Under 80CCD(1B), ₹50,000 additional deduction is available exclusively for NPS — above the ₹1.5L 80C limit. At 30% bracket, this saves ₹15,600 annually.',
      corpus: 'Use the Simulator to project your corpus. At current contribution, running the numbers will reveal your retirement trajectory and gap analysis.',
    },
  };
  const p = replies[personality] || replies.dost;
  if (m.includes('tax') || m.includes('80c')) return p.tax || p.default;
  if (m.includes('corpus') || m.includes('kitna') || m.includes('how much')) return p.corpus || p.default;
  return p.default;
}
