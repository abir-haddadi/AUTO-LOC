'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import CarSVG from '@/components/CarSVG';
import { use } from 'react';

export default function CarDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(null);
  const [total, setTotal] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const today = new Date();
    const fmt = d => d.toISOString().split('T')[0];
    const d1 = new Date(today); d1.setDate(d1.getDate() + 3);
    const d2 = new Date(today); d2.setDate(d2.getDate() + 6);
    setStartDate(fmt(d1));
    setEndDate(fmt(d2));

    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    supabase.from('cars').select('*').eq('id', id).single().then(({ data }) => {
      setCar(data);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!startDate || !endDate || !car) return;
    const d = Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000));
    setDays(d);
    setTotal(d * car.price_per_day);
  }, [startDate, endDate, car]);

  function handleBook() {
    if (!user) {
      router.push('/auth');
      return;
    }
    const params = new URLSearchParams({ start: startDate, end: endDate, days, total });
    router.push(`/book/${id}?${params}`);
  }

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div><p>Chargement...</p></div>
    </div>
  );

  if (!car) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        <p>Véhicule introuvable.</p>
        <Link href="/cars" className="btn-sm" style={{ display: 'inline-block', marginTop: '1rem' }}>← Retour</Link>
      </div>
    </div>
  );

  const specs = car.specs ?? {};
  const EQUIPMENT = ['Climatisation automatique', 'GPS premium', 'Bluetooth', 'Caméra 360°', 'Sièges chauffants', 'Toit panoramique', 'Aide au stationnement', 'Assurance tous risques'];

  return (
    <div style={{ padding: '2.5rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link href="/cars" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Véhicules</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-primary)' }}>{car.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }}>
        {/* ── LEFT: car details ── */}
        <div>
          {/* Main image */}
          <div style={{
            width: '100%', height: '400px', borderRadius: 'var(--r-xl)',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            position: 'relative',
          }}>
            {car.image_url
              ? <img src={car.image_url} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <CarSVG id={car.id} style={{ width: '70%' }} />
            }
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-deep) 0%, transparent 50%)' }} />
          </div>

          {/* Tags & title */}
          <div style={{ marginTop: '2rem' }}>
            <div className="tag-row">
              <span className="tag">📍 Alger Centre</span>
              {specs.power && <span className="tag">⚡ {specs.power}</span>}
              {specs.transmission && <span className="tag">🔧 {specs.transmission}</span>}
              {specs.year && <span className="tag">📅 {specs.year}</span>}
              {car.tag && <span className="tag" style={{ color: 'var(--gold)', borderColor: 'var(--border-bright)' }}>⭐ {car.tag}</span>}
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>
              {car.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span className="stars" style={{ fontSize: '16px' }}>{'★'.repeat(Math.round(car.rating || 5))}</span>
              <span style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500 }}>{car.rating}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>({car.reviews} avis vérifiés)</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.75', maxWidth: '600px' }}>
              {car.description}
            </p>
          </div>

          {/* Specs grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
            {[
              { label: 'Puissance', val: specs.power },
              { label: 'Vitesse max', val: specs.speed },
              { label: 'Transmission', val: specs.transmission },
              { label: 'Carburant', val: specs.fuel },
              { label: 'Places', val: specs.seats ? `${specs.seats} personnes` : null },
              { label: 'Millésime', val: specs.year },
            ].filter(s => s.val).map(({ label, val }) => (
              <div key={label} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)', padding: '1rem',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  {label}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Equipment */}
          <div className="divider" />
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Équipements inclus
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {EQUIPMENT.map(eq => <span key={eq} className="tag">✓ {eq}</span>)}
          </div>
        </div>

        {/* ── RIGHT: booking panel ── */}
        <div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-xl)', padding: '1.75rem',
            position: 'sticky', top: '90px',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 600, color: 'var(--gold)', marginBottom: '4px' }}>
              {Number(car.price_per_day).toLocaleString('fr-DZ')} DZD
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              par jour · Assurance incluse · Livraison gratuite
            </div>
            <div className="car-rating" style={{ marginBottom: '1rem' }}>
              <span className="stars">★</span> {car.rating} · <span style={{ color: 'var(--text-muted)' }}>{car.reviews} avis</span>
            </div>

            <div className="divider" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date de début</label>
                <input type="date" className="form-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date de fin</label>
                <input type="date" className="form-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Créneau horaire de récupération</label>
              <select className="form-input" style={{ width: '100%', cursor: 'pointer' }}>
                <option value="08:00">08:00 - Matin</option>
                <option value="10:00">10:00 - Matin</option>
                <option value="14:00">14:00 - Après-midi</option>
                <option value="16:00">16:00 - Après-midi</option>
                <option value="18:00">18:00 - Soir</option>
              </select>
            </div>

            <div style={{ 
              marginBottom: '1rem', padding: '12px', background: 'rgba(201,168,76,0.05)', 
              borderRadius: 'var(--r-md)', fontSize: '13px', color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>📅</span>
              <span>Location du <strong>{startDate ? new Date(startDate).toLocaleDateString('fr-FR') : '—'}</strong> au <strong>{endDate ? new Date(endDate).toLocaleDateString('fr-FR') : '—'}</strong></span>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Permis de conduire (Obligatoire)</label>
              <input type="file" className="form-input" accept="image/*,.pdf" required style={{ padding: '8px' }} />
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Scan ou photo nette de votre permis</div>
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>Tarif journalier</span><strong style={{ color: 'var(--text-primary)' }}>{Number(car.price_per_day).toLocaleString('fr-DZ')} DZD</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>Durée</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {days ? `${days} jour${days > 1 ? 's' : ''}` : 'Sélectionnez les dates'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>Assurance</span><strong style={{ color: 'var(--green)' }}>✓ Incluse</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>Livraison</span><strong style={{ color: 'var(--text-primary)' }}>Gratuite</strong>
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              <span>Total estimé</span>
              <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
                {total ? `${total.toLocaleString('fr-DZ')} DZD` : '—'}
              </span>
            </div>

            <div style={{ 
              marginTop: '1.25rem', padding: '12px', background: 'rgba(201,168,76,0.1)', 
              border: '1px dashed var(--gold)', borderRadius: 'var(--r-md)',
              fontSize: '12px', color: 'var(--text-primary)', textAlign: 'center'
            }}>
              🤝 **Paiement sur place** le jour de la récupération du véhicule.
            </div>

            <button onClick={handleBook} className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
              {user ? 'Confirmer la réservation →' : 'Se connecter pour réserver →'}
            </button>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
              Annulation gratuite · Vérification du permis sous 2h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
