import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD || 'arthvo-admin-2025';

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate a simple admin token
    const token = Buffer.from(`admin:${Date.now()}:${adminPassword}`).toString('base64');

    // Set httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('arthvo-admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
