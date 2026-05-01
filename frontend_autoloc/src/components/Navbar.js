'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 3rem', height: '72px',
      background: 'rgba(10,10,11,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgwQUyL9eubsLtVfY11dkAvQn4tEkG_m0A8Q&s" 
          alt="Auto-Loc Logo" 
          style={{ height: '40px', borderRadius: '8px' }} 
        />
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600,
          letterSpacing: '0.08em', color: 'var(--gold)',
        }}>
          Auto<span style={{ color: 'var(--text-primary)' }}>·Loc</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {[
          { href: '/', label: 'Accueil' },
          { href: '/cars', label: 'Véhicules' },
          { href: '/dashboard', label: 'Mon espace' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            fontSize: '13px', fontWeight: 500, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: isActive(href) ? 'var(--gold)' : 'var(--text-secondary)',
            textDecoration: 'none', transition: 'color var(--transition)',
          }}>
            {label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <span style={{
              fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-muted)',
              border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '20px',
            }}>
              {user.email?.split('@')[0]}
            </span>
            <button onClick={handleLogout} className="btn-nav" style={{ background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/auth" className="btn-ghost" style={{ padding: '8px 18px', fontSize: '13px' }}>
              Connexion
            </Link>
            <Link href="/auth?mode=signup" className="btn-nav">
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
