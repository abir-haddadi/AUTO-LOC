'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const STATUS_CONFIG = {
  pending:   { label: 'En attente', cls: 'status-pending' },
  active:    { label: 'Active',     cls: 'status-active' },
  completed: { label: 'Terminée',   cls: 'status-completed' },
  cancelled: { label: 'Annulée',    cls: 'status-cancelled' },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reservations');

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/auth'); return; }
      setUser(user);

      const { data } = await supabase
        .from('reservations')
        .select('*, cars(name, category, price_per_day, id)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setReservations(data ?? []);
      setLoading(false);
    }
    init();
  }, []);

  async function cancelReservation(id) {
    if (!confirm('Annuler cette réservation ?')) return;
    await supabase.from('reservations').update({ status: 'cancelled' }).eq('id', id);
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  }

  const stats = {
    total: reservations.length,
    active: reservations.filter(r => r.status === 'active').length,
    upcoming: reservations.filter(r => r.status === 'pending').length,
    spent: reservations.filter(r => r.status !== 'cancelled').reduce((s, r) => s + (r.total_price || 0), 0),
  };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?';

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client';
  const firstName = displayName.split(' ')[0];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 72px)' }}>
      {/* ── SIDEBAR ── */}
      <aside style={{
        background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
        padding: '2rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
      }}>
        {/* User avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(201,168,76,0.15)', border: '1px solid var(--border-bright)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--gold)',
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>{displayName}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Client Auto-Loc</div>
          </div>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem', padding: '0 0.75rem' }}>
          Menu
        </div>

        {[
          { id: 'reservations', icon: '📋', label: 'Mes réservations' },
          { id: 'profile', icon: '👤', label: 'Mon profil' },
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: 'var(--r-md)',
            fontSize: '14px', cursor: 'pointer', transition: 'all var(--transition)',
            border: 'none', width: '100%', textAlign: 'left', fontFamily: 'var(--font-body)',
            background: activeTab === item.id ? 'rgba(201,168,76,0.1)' : 'transparent',
            color: activeTab === item.id ? 'var(--gold)' : 'var(--text-secondary)',
          }}>
            <span style={{ fontSize: '16px', width: '20px' }}>{item.icon}</span> {item.label}
          </button>
        ))}

        <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

        <Link href="/cars" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px', borderRadius: 'var(--r-md)',
          fontSize: '14px', cursor: 'pointer', color: 'var(--text-secondary)',
          textDecoration: 'none', transition: 'color var(--transition)',
        }}>
          <span style={{ fontSize: '16px', width: '20px' }}>🚗</span> Voir les véhicules
        </Link>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px', borderRadius: 'var(--r-md)',
          fontSize: '14px', cursor: 'pointer', color: 'var(--text-secondary)',
          textDecoration: 'none', transition: 'color var(--transition)',
        }}>
          <span style={{ fontSize: '16px', width: '20px' }}>🏠</span> Accueil
        </Link>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ background: 'var(--bg-deep)', padding: '2.5rem', overflowY: 'auto' }}>

        {activeTab === 'reservations' && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400 }}>
                Bonjour, <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{firstName}</em> 👋
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Voici un aperçu de vos locations ·{' '}
                {new Date().toLocaleDateString('fr-DZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { icon: '🚗', val: stats.total, label: 'Total locations', sub: `+${stats.total} au total`, subColor: 'var(--green)' },
                { icon: '✅', val: stats.active, label: 'En cours', sub: stats.active ? '● Active' : '● Aucune', subColor: 'var(--gold)' },
                { icon: '📅', val: stats.upcoming, label: 'En attente', sub: 'À valider', subColor: 'var(--amber)' },
                { icon: '💰', val: stats.spent > 0 ? `${Math.round(stats.spent / 1000)}K` : '0', label: 'Total dépensé (DZD)', sub: '↑ Total cumulé', subColor: 'var(--green)' },
              ].map(({ icon, val, label, sub, subColor }) => (
                <div key={label} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)', padding: '1.25rem',
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '0.75rem' }}>{icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 500 }}>{val}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: subColor, marginTop: '6px' }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Reservations table */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 500 }}>Mes réservations</div>
                <Link href="/cars" className="btn-sm">+ Nouvelle réservation</Link>
              </div>

              {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>⏳ Chargement...</div>
              ) : reservations.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                  <p>Aucune réservation pour le moment.</p>
                  <Link href="/cars" className="btn-sm" style={{ display: 'inline-block', marginTop: '1rem' }}>
                    Explorer les véhicules →
                  </Link>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Réf.', 'Véhicule', 'Dates', 'Montant', 'Statut', 'Action'].map(h => (
                          <th key={h} style={{
                            fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
                            textTransform: 'uppercase', color: 'var(--text-muted)',
                            padding: '10px 14px', textAlign: 'left',
                            borderBottom: '1px solid var(--border)',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map(r => {
                        const cfg = STATUS_CONFIG[r.status] ?? STATUS_CONFIG.pending;
                        return (
                          <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>{r.ref}</td>
                            <td style={{ padding: '14px', fontWeight: 500 }}>{r.cars?.name ?? '—'}</td>
                            <td style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                              {r.start_date} → {r.end_date}
                            </td>
                            <td style={{ padding: '14px', fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '1rem' }}>
                              {Number(r.total_price).toLocaleString('fr-DZ')} DZD
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span className={`status-badge ${cfg.cls}`}>
                                <span className="status-dot" />
                                {cfg.label}
                              </span>
                            </td>
                            <td style={{ padding: '14px' }}>
                              {(r.status === 'pending' || r.status === 'active') ? (
                                <button onClick={() => cancelReservation(r.id)} style={{
                                  background: 'rgba(231,76,60,0.12)', border: '1px solid rgba(231,76,60,0.3)',
                                  color: '#E74C3C', borderRadius: 'var(--r-sm)', padding: '5px 12px',
                                  fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
                                }}>
                                  Annuler
                                </button>
                              ) : r.license_url ? (
                                <a href={r.license_url} target="_blank" rel="noopener noreferrer" style={{
                                  fontSize: '12px', color: 'var(--gold)', textDecoration: 'none',
                                }}>
                                  📄 Permis
                                </a>
                              ) : (
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'profile' && user && (
          <div style={{ maxWidth: '520px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, marginBottom: '2rem' }}>
              Mon <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>profil</em>
            </h2>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '2rem' }}>
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(201,168,76,0.15)', border: '2px solid var(--border-bright)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)',
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{displayName}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Client Auto-Loc</div>
                </div>
              </div>

              <div className="divider" />

              {[
                { label: 'Email', val: user.email },
                { label: 'Nom complet', val: user.user_metadata?.full_name || '—' },
                { label: 'Téléphone', val: user.user_metadata?.phone || '—' },
                { label: 'Membre depuis', val: new Date(user.created_at).toLocaleDateString('fr-DZ', { year: 'numeric', month: 'long' }) },
                { label: 'Réservations totales', val: stats.total },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{val}</span>
                </div>
              ))}

              <div style={{ marginTop: '1.5rem' }}>
                <Link href="/cars" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Faire une nouvelle réservation →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
