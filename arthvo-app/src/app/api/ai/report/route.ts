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

export async function POST(req: NextRequest) {
  try {
    const { user, behavior, language, personality } = await req.json();

    // Load admin config for API key + model
    const adminConfig = getAdminConfig();
    const apiKey = adminConfig.primaryKey || process.env.OPENROUTER_API_KEY || '';
    const model = adminConfig.reportModel || process.env.REPORT_MODEL || 'anthropic/claude-3-5-sonnet';

    if (!apiKey) {
      // Return a smart offline report from behavioral data
      return NextResponse.json({ report: buildOfflineReport(user, behavior), offline: true });
    }

    const prompt = `You are BhavishyaMitra generating a monthly Bhavishya Score report.
Language: ${language}. Personality: ${personality}.
User: ${user.name || 'User'}, Age ${user.age}, Monthly income ₹${user.income?.toLocaleString('en-IN')}.

Behavior this month:
- Quests completed: ${behavior.questsCompleted}
- Quests abandoned: ${behavior.questsAbandoned}
- Topics mastered: ${behavior.topicsMastered?.join(', ') || 'None'}
- Topics avoided: ${behavior.topicsAvoided?.join(', ') || 'None'}
- Simulator sessions: ${behavior.simulatorSessions}
- Average contribution simulated: ₹${behavior.avgContributionSimulated?.toLocaleString('en-IN')}
- Current XP: ${user.xp}
- Streak: ${user.streak} days

Generate a JSON report (nothing else, just JSON):
{
  "pension_iq_score": <0-100 integer based on activity>,
  "score_reason": "<one honest sentence why this score>",
  "avatar_story": "<2 sentences: story of their future self based on progress>",
  "strength_1": "<specific thing they did well this month>",
  "strength_2": "<another concrete strength>",
  "blind_spot_1": "<topic or behavior they avoided>",
  "blind_spot_2": "<another gap>",
  "one_action": "<single most important next step — be specific>",
  "encouragement": "<warm closing line in their language and personality>",
  "next_challenge": "<specific quest or action for next month>"
}

Be specific. Reference their actual data. Write in ${language === 'hi' ? 'Hindi (Hinglish OK)' : language === 'en' ? 'English' : language}. Sound like a ${personality} personality.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://arthvo.in',
        'X-Title': 'Arthvo Bhavishya Report',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.6,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ report: buildOfflineReport(user, behavior), offline: true });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    const report = JSON.parse(content);

    return NextResponse.json({ report, offline: false });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function buildOfflineReport(user: any, behavior: any) {
  const score = Math.min(100, Math.max(10,
    behavior.questsCompleted * 8 +
    (behavior.simulatorSessions || 0) * 5 +
    (user.streak || 0) * 2 +
    (behavior.topicsMastered?.length || 0) * 10
  ));
  return {
    pension_iq_score: score,
    score_reason: behavior.questsCompleted > 3
      ? `Tune ${behavior.questsCompleted} quests complete kiye — solid effort!`
      : 'Aur quests complete karne se score badhega.',
    avatar_story: score > 60
      ? 'Tera future self settle ho raha hai — thodi mehnat aur aur life comfortable hogi!'
      : 'Tera future self abhi struggle kar raha hai. Aaj se consistent reh.',
    strength_1: behavior.questsCompleted > 0 ? `${behavior.questsCompleted} quests complete kiye — habit ban rahi hai.` : 'App pe aaya — pehla kadam liya.',
    strength_2: user.streak > 0 ? `${user.streak} din streak — consistency power hai.` : 'Simulator explore kiya — numbers samajhne laga.',
    blind_spot_1: behavior.topicsAvoided?.[0] ? `${behavior.topicsAvoided[0]} topic avoid kiya — yahan focus karo.` : 'Tax benefits abhi explore nahi kiye.',
    blind_spot_2: behavior.simulatorSessions === 0 ? 'Simulator use nahi kiya — real numbers ke bina planning adhoori hai.' : 'Compare calculator abhi try nahi kiya.',
    one_action: `Kal ek simulator session run karo — apna actual corpus dekho aur contribution ₹200 badha do.`,
    encouragement: '🔥 Tu sahi direction mein hai. Consistency hi tera superpower hai!',
    next_challenge: 'Next week: Tax calculator mein apni income daalo aur dekho kitna bachta hai.',
  };
}
