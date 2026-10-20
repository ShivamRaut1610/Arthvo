'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, MessageCircle, Map, User } from 'lucide-react';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/quests', icon: Zap, label: 'Quests' },
  { href: '/chat', icon: MessageCircle, label: 'Coach' },
  { href: '/journey', icon: Map, label: 'Journey' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
