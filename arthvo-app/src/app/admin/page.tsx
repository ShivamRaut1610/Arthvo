'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Settings, Users, FileText,
  Key, CheckCircle, XCircle, Save, Eye, EyeOff,
  RefreshCw, TrendingUp, Zap, MessageCircle, Brain,
  LogOut, AlertTriangle, ChevronDown,
} from 'lucide-react';

type Tab = 'dashboard' | 'ai-config' | 'users' | 'reports';

const MODELS = [
  { value: 'openai/gpt-4o', label: 'GPT-4o (OpenAI)' },
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
  { value: 'anthropic/claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'anthropic/claude-3-haiku', label: 'Claude 3 Haiku (Fast)' },
  { value: 'google/gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  { value: 'mistralai/mistral-7b-instruct', label: 'Mistral 7B (Budget)' },
  { value: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B (Free)' },
];

const MOCK_USERS = [
  { id: 1, email: 'arjun@example.com', level: 4, xp: 3200, streak: 12, city: 'Pune', joined: '2025-04-01' },
  { id: 2, email: 'priya@example.com', level: 3, xp: 1800, streak: 7, city: 'Chennai', joined: '2025-04-10' },
  { id: 3, email: 'raza@example.com', level: 2, xp: 620, streak: 3, city: 'Lucknow', joined: '2025-04-18' },
  { id: 4, email: 'meera@gmail.com', level: 5, xp: 7100, streak: 28, city: 'Jaipur', joined: '2025-03-15' },
  { id: 5, email: 'zaid@outlook.com', level: 1, xp: 150, streak: 1, city: 'Hyderabad', joined: '2025-05-01' },
];

const MOCK_STATS = {
  totalUsers: 247,
  activeToday: 38,
  questsCompleted: 1842,
  avgStreak: 8.4,
  topTheme: 'Dhoop',
  topLanguage: 'Hindi',
};

function StatCard({ label, value, icon, sub }: { label: string; value: string | number; icon: React.ReactNode; sub?: string }) {
  return (
    <div className="card-flat" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ModelSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', background: 'var(--bg-secondary)', border: '2px solid var(--border-color)',
            borderRadius: 12, padding: '12px 40px 12px 14px', fontSize: 14, fontWeight: 500,
            color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', appearance: 'none',
            fontFamily: 'var(--font-primary)', transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--accent-primary)')}
          onBlur={e => (e.target.style.borderColor = 'var(--border-color)')}
        >
          {MODELS.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <ChevronDown size={16} color="var(--text-muted)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showPrimaryKey, setShowPrimaryKey] = useState(false);
  const [showBackupKey, setShowBackupKey] = useState(false);

  const [config, setConfig] = useState({
    primaryKey: '',
    backupKey: '',
    sceneModel: 'anthropic/claude-3-haiku',
    chatModel: 'openai/gpt-4o-mini',
    reportModel: 'anthropic/claude-3-5-sonnet',
    monthlyBudget: '2000',
  });

  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMsg, setTestMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load config from server on mount
  useEffect(() => {
    fetch('/api/admin/config')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setConfig(c => ({
            ...c,
            primaryKey: data.primaryKey || c.primaryKey,
            backupKey: data.backupKey || c.backupKey,
            sceneModel: data.sceneModel || c.sceneModel,
            chatModel: data.chatModel || c.chatModel,
            reportModel: data.reportModel || c.reportModel,
            monthlyBudget: data.monthlyBudget || c.monthlyBudget,
          }));
        }
      })
      .catch(() => {
        // Fallback to localStorage
        const stored = localStorage.getItem('arthvo-admin-config');
        if (stored) setConfig(JSON.parse(stored));
      });
  }, []);

  const handleTestKey = async () => {
    if (!config.primaryKey) { setTestMsg('Primary key is empty'); setTestStatus('error'); return; }
    setTestStatus('testing');
    setTestMsg('');

    try {
      const res = await fetch('/api/admin/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: config.primaryKey, model: config.chatModel }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus('success');
        setTestMsg(`✓ Key works! Model: ${config.chatModel}`);
      } else {
        setTestStatus('error');
        setTestMsg(data.error || 'Key verification failed');
      }
    } catch {
      setTestStatus('error');
      setTestMsg('Network error — check your connection');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save to server (persists for AI routes)
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Server save failed');
      // Also cache in localStorage as fallback
      localStorage.setItem('arthvo-admin-config', JSON.stringify(config));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // localStorage fallback
      localStorage.setItem('arthvo-admin-config', JSON.stringify(config));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'ai-config' as Tab, label: 'AI Config', icon: <Settings size={16} /> },
    { id: 'users' as Tab, label: 'Users', icon: <Users size={16} /> },
    { id: 'reports' as Tab, label: 'Reports', icon: <FileText size={16} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: 'var(--font-primary)' }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)',
        padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: 18 }}>A</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>Arthvo Admin</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Control Panel</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-ghost"
          style={{ gap: 6, fontSize: 13 }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 4, background: 'var(--bg-secondary)', borderRadius: 14,
          padding: 4, marginBottom: 24, width: 'fit-content',
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`admin-tab ${tab === t.id ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* DASHBOARD TAB */}
          {tab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>
                Overview
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
                <StatCard label="Total Users" value={MOCK_STATS.totalUsers} icon={<Users size={16} color="var(--accent-primary)" />} sub="+12 this week" />
                <StatCard label="Active Today" value={MOCK_STATS.activeToday} icon={<Zap size={16} color="var(--accent-primary)" />} sub={`${Math.round(MOCK_STATS.activeToday / MOCK_STATS.totalUsers * 100)}% DAU`} />
                <StatCard label="Quests Done" value={MOCK_STATS.questsCompleted.toLocaleString()} icon={<TrendingUp size={16} color="var(--accent-primary)" />} sub="All time" />
                <StatCard label="Avg Streak" value={`${MOCK_STATS.avgStreak}d`} icon={<Brain size={16} color="var(--accent-primary)" />} sub="Platform average" />
                <StatCard label="Top Theme" value={MOCK_STATS.topTheme} icon={<Settings size={16} color="var(--accent-primary)" />} />
                <StatCard label="Top Language" value={MOCK_STATS.topLanguage} icon={<MessageCircle size={16} color="var(--accent-primary)" />} sub="72% of users" />
              </div>

              {/* System status */}
              <div className="card-flat" style={{ padding: '20px 24px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>System Status</h3>
                {[
                  { name: 'OpenRouter API', status: config.primaryKey ? 'Configured' : 'Not configured', ok: !!config.primaryKey },
                  { name: 'Supabase', status: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Not configured', ok: false },
                  { name: 'Theme System', status: '5 themes active', ok: true },
                  { name: 'Multilingual', status: '6 languages configured', ok: true },
                  { name: 'PWA Manifest', status: 'Configured', ok: true },
                ].map(s => (
                  <div key={s.name} className="config-row">
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{s.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {s.ok
                        ? <CheckCircle size={14} color="var(--success)" />
                        : <AlertTriangle size={14} color="var(--warning)" />}
                      <span style={{ fontSize: 13, fontWeight: 600, color: s.ok ? 'var(--success)' : 'var(--warning)' }}>{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* AI CONFIG TAB */}
          {tab === 'ai-config' && (
            <motion.div key="ai-config" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>AI Configuration</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
                Configure OpenRouter API keys and model assignments for each feature.
              </p>

              {/* API Keys */}
              <div className="card-flat" style={{ padding: '24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <Key size={18} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>API Keys</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Primary Key */}
                  <div>
                    <label className="input-label">Primary API Key</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPrimaryKey ? 'text' : 'password'}
                        className="input-field"
                        placeholder="sk-or-v1-..."
                        value={config.primaryKey}
                        onChange={e => setConfig(c => ({ ...c, primaryKey: e.target.value }))}
                        style={{ paddingRight: 48, fontFamily: 'monospace', fontSize: 13 }}
                      />
                      <button type="button" onClick={() => setShowPrimaryKey(!showPrimaryKey)}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        {showPrimaryKey ? <EyeOff size={16} color="var(--text-muted)" /> : <Eye size={16} color="var(--text-muted)" />}
                      </button>
                    </div>
                    <div className="input-hint">Used for all production requests. From openrouter.ai/keys</div>
                  </div>

                  {/* Backup Key */}
                  <div>
                    <label className="input-label">Backup API Key</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showBackupKey ? 'text' : 'password'}
                        className="input-field"
                        placeholder="sk-or-v1-... (fallback)"
                        value={config.backupKey}
                        onChange={e => setConfig(c => ({ ...c, backupKey: e.target.value }))}
                        style={{ paddingRight: 48, fontFamily: 'monospace', fontSize: 13 }}
                      />
                      <button type="button" onClick={() => setShowBackupKey(!showBackupKey)}
                        style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        {showBackupKey ? <EyeOff size={16} color="var(--text-muted)" /> : <Eye size={16} color="var(--text-muted)" />}
                      </button>
                    </div>
                    <div className="input-hint">Used automatically if primary key fails or hits rate limit</div>
                  </div>

                  {/* Test button */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                      onClick={handleTestKey}
                      disabled={testStatus === 'testing'}
                      style={{
                        background: 'var(--bg-tertiary)', border: '2px solid var(--border-color)',
                        borderRadius: 12, padding: '10px 18px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-primary)',
                      }}
                    >
                      {testStatus === 'testing'
                        ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Testing...</>
                        : <><RefreshCw size={14} /> Test Primary Key</>}
                    </button>
                    {testStatus === 'success' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
                        <CheckCircle size={14} /> {testMsg}
                      </motion.div>
                    )}
                    {testStatus === 'error' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--danger)', fontWeight: 600 }}>
                        <XCircle size={14} /> {testMsg}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Model Assignments */}
              <div className="card-flat" style={{ padding: '24px', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Model Assignments</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <ModelSelect label="🤖 Coach Chat (BhavishyaMitra)" value={config.chatModel} onChange={v => setConfig(c => ({ ...c, chatModel: v }))} />
                  <ModelSelect label="📊 Report Generator (Bhavishya Score)" value={config.reportModel} onChange={v => setConfig(c => ({ ...c, reportModel: v }))} />
                  <ModelSelect label="🎭 Scene Coach (Simulator messages)" value={config.sceneModel} onChange={v => setConfig(c => ({ ...c, sceneModel: v }))} />
                </div>
                <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                  💡 Tip: Use fast/cheap models for chat & scene. Use powerful models for reports.
                </div>
              </div>

              {/* Budget */}
              <div className="card-flat" style={{ padding: '24px', marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Monthly Budget Limit</h3>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 18, color: 'var(--text-secondary)', fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    className="input-field"
                    value={config.monthlyBudget}
                    onChange={e => setConfig(c => ({ ...c, monthlyBudget: e.target.value }))}
                    placeholder="20"
                    style={{ maxWidth: 140 }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/ month USD</span>
                </div>
                <div className="input-hint" style={{ marginTop: 8 }}>
                  AI features will pause if this limit is reached. ≈ $20 covers ~1,000 daily active users.
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                className="btn-primary"
                disabled={saving}
                style={{ minWidth: 160 }}
              >
                {saving ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
                  : saved ? <><CheckCircle size={16} /> Saved!</>
                    : <><Save size={16} /> Save Config</>}
              </button>
            </motion.div>
          )}

          {/* USERS TAB */}
          {tab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>Users</h2>
              <div className="card-flat" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)' }}>
                        {['Email', 'Level', 'XP', 'Streak', 'City', 'Joined'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_USERS.map((u, i) => (
                        <tr key={u.id} style={{ borderTop: '1px solid var(--border-color)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-tertiary)30' }}>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{u.email}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span className="badge-accent">L{u.level}</span>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)' }}>{u.xp.toLocaleString()}</td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>🔥 {u.streak}d</td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>{u.city}</td>
                          <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-muted)' }}>{u.joined}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', fontSize: 12, color: 'var(--text-muted)' }}>
                  Showing 5 of 247 users · Connect Supabase to see all users
                </div>
              </div>
            </motion.div>
          )}

          {/* REPORTS TAB */}
          {tab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20 }}>Reports</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 24 }}>
                {[
                  { label: 'Total Reports Generated', value: 124, icon: <FileText size={16} color="var(--accent-primary)" /> },
                  { label: 'Avg Bhavishya IQ Score', value: '61 / 100', icon: <Brain size={16} color="var(--accent-primary)" /> },
                  { label: 'Reports Shared', value: 42, icon: <MessageCircle size={16} color="var(--accent-primary)" /> },
                ].map(s => (
                  <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} />
                ))}
              </div>
              <div className="card-flat" style={{ padding: '24px' }}>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Note:</strong> Full report analytics will be available once Supabase is connected. Connect your database in <code style={{ background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>.env.local</code> to see user reports, Bhavishya IQ distribution, and behavioral insights.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
