import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), '.arthvo-admin-config.json');

function readConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch {}
  return {};
}

function writeConfig(config: Record<string, unknown>) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

async function isAdminAuthenticated(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('arthvo-admin')?.value;
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const adminPassword = process.env.ADMIN_PASSWORD || 'arthvo-admin-2025';
    return decoded.includes(adminPassword);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const config = readConfig();
  // Never expose the actual key values — return masked versions for display
  return NextResponse.json({
    ...config,
    primaryKey: config.primaryKey ? '••••' + String(config.primaryKey).slice(-6) : '',
    backupKey: config.backupKey ? '••••' + String(config.backupKey).slice(-6) : '',
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const current = readConfig();
    // Don't overwrite keys if masked value is sent
    const updated = {
      ...current,
      ...(body.primaryKey && !body.primaryKey.startsWith('••••') ? { primaryKey: body.primaryKey } : {}),
      ...(body.backupKey && !body.backupKey.startsWith('••••') ? { backupKey: body.backupKey } : {}),
      ...(body.sceneModel ? { sceneModel: body.sceneModel } : {}),
      ...(body.chatModel ? { chatModel: body.chatModel } : {}),
      ...(body.reportModel ? { reportModel: body.reportModel } : {}),
      ...(body.monthlyBudget !== undefined ? { monthlyBudget: body.monthlyBudget } : {}),
    };
    const ok = writeConfig(updated);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Failed to write config' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
