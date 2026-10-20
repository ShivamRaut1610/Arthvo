import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { apiKey, model } = await req.json();

    if (!apiKey || !apiKey.startsWith('sk-')) {
      return NextResponse.json({ success: false, error: 'Invalid API key format — should start with sk-' }, { status: 400 });
    }

    // Make a minimal real call to OpenRouter to verify the key
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://arthvo.in',
        'X-Title': 'Arthvo Admin Key Test',
      },
      body: JSON.stringify({
        model: model || 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: 'Reply with just the word: working' }],
        max_tokens: 10,
      }),
    });

    if (response.status === 401) {
      return NextResponse.json({ success: false, error: 'Key rejected — invalid or expired' }, { status: 200 });
    }
    if (response.status === 402) {
      return NextResponse.json({ success: false, error: 'Insufficient credits on this key' }, { status: 200 });
    }
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json({ success: false, error: err?.error?.message || `API returned ${response.status}` }, { status: 200 });
    }

    return NextResponse.json({ success: true, model });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Network error' }, { status: 500 });
  }
}
