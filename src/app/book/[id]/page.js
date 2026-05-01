'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import CarSVG from '@/components/CarSVG';
import { use } from 'react';

function BookingContent({ carId }) {
  const router = useRouter();
  const params = useSearchParams();
  const startDate = params.get('start') || '';
  const endDate = params.get('end') || '';
  const days = parseInt(params.get('days') || '1');
  const total = parseInt(params.get('total') || '0');

  const [car, setCar] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [licenseFile, setLicenseFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refNum, setRefNum] = useState('');

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/auth'); return; }
      setUser(user);
      const { data: carData } = await supabase.from('cars').select('*').eq('id', carId).single();
      setCar(carData);
      setLoading(false);
    }
    init();
  }, [carId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!licenseFile) { setError('Le téléchargement de votre permis de conduire est obligatoire.'); return; }
    setSubmitting(true);
    setError('');

    try {
      // 1. Upload license to Supabase Storage
      const fileExt = licenseFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('licenses')
        .upload(fileName, licenseFile, { upsert: true });

      if (uploadError) throw new Error('Erreur upload: ' + uploadError.message);

      // 2. Get public URL
      const { data: urlData } = supabase.storage.from('licenses').getPublicUrl(fileName);

      // 3. Create reservation
      const ref = `ALQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      const { error: resError } = await supabase.from('reservations').insert({
        user_id: user.id,
        car_id: carId,
        start_date: startDate,
        end_date: endDate,
        status: 'pending',
        total_price: total,
        license_url: urlData.publicUrl,
        ref,
      });

      if (resError) throw new Error('Erreur réservation: ' + resError.message);

      setRefNum(ref);
      setSuccess('Réservation confirmée !');
    } catch (err) {
      setError(err.message);
    }
    setSubmitting(false);
  }

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div><p>Chargement...</p></div>
    </div>
  );

  if (success) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-xl)', padding: '3rem', maxWidth: '480px', width: '100%', textAlign: 'center',
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 400, marginBottom: '0.75rem' }}>
          Réservation confirmée !
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Votre réservation pour <strong style={{ color: 'var(--gold)' }}>{car?.name}</strong> a été enregistrée avec succès. 
          Vous recevrez une confirmation dès que notre équipe validera votre dossier.
        </p>
        <div style={{
          background: 'var(--bg-raised)', borderRadius: 'var(--r-lg)',
          padding: '1.25rem', marginBottom: '2rem',
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Référence de réservation
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--gold)', fontWeight: 600 }}>
            {refNum}
          </div>
        </div>
        <Link href="/dashboard" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Voir mes réservations →
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '2.5rem 3rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1.5rem', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
        <Link href="/cars" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Véhicules</Link>
        <span>›</span>
        <Link href={`/cars/${carId}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{car?.name}</Link>
        <span>›</span>
        <span style={{ color: 'var(--text-primary)' }}>Réservation</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 400, marginBottom: '4px' }}>
          Finaliser la <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>réservation</em>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Complétez vos informations et uploadez votre permis de conduire.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
          {/* ── LEFT FORM ── */}
          <div>
            {/* Dates card */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)', padding: '2rem', marginBottom: '1.5rem',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 500, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--gold)', color: '#0A0A0B', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                Dates de location
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Date de début</label>
                  <div className="form-input" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>{startDate || '—'}</div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Date de fin</label>
                  <div className="form-input" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>{endDate || '—'}</div>
                </div>
              </div>
            </div>

            {/* Personal info */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)', padding: '2rem', marginBottom: '1.5rem',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 500, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--gold)', color: '#0A0A0B', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                Informations personnelles
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nom complet</label>
                  <input type="text" className="form-input"
                    defaultValue={user?.user_metadata?.full_name || ''}
                    placeholder="Mohammed Benali" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input type="tel" className="form-input"
                    defaultValue={user?.user_metadata?.phone || ''}
                    placeholder="+213 555 000 000" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={user?.email || ''} readOnly
                  style={{ color: 'var(--text-muted)', cursor: 'not-allowed' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Adresse de livraison (Alger)</label>
                <input type="text" className="form-input"
                  placeholder="Ex: 12 Rue Didouche Mourad, Alger Centre" required />
              </div>
            </div>

            {/* File upload */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)', padding: '2rem', marginBottom: '1.5rem',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 500, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--gold)', color: '#0A0A0B', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                Document obligatoire
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Uploadez une photo ou scan de votre permis de conduire valide.
              </p>

              <label style={{
                display: 'block',
                border: `2px dashed ${licenseFile ? 'var(--gold)' : 'var(--border-bright)'}`,
                borderRadius: 'var(--r-lg)', padding: '2.5rem', textAlign: 'center',
                cursor: 'pointer', transition: 'all var(--transition)',
                background: licenseFile ? 'rgba(201,168,76,0.04)' : 'transparent',
              }}>
                <input type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                  onChange={e => setLicenseFile(e.target.files[0])} />
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--gold)' }}>
                  {licenseFile ? '✅' : '📄'}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {licenseFile ? licenseFile.name : 'Cliquez pour uploader votre permis'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {licenseFile ? `${(licenseFile.size / 1024).toFixed(0)} KB` : 'JPG, PNG ou PDF · Max 5 MB'}
                </div>
              </label>
            </div>

            {error && (
              <div style={{
                background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
                borderRadius: 'var(--r-md)', padding: '12px 16px',
                fontSize: '13px', color: '#E74C3C', marginBottom: '1.5rem',
              }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '15px' }}
              disabled={submitting}>
              {submitting ? '⏳ Traitement en cours...' : '✓ Confirmer la réservation'}
            </button>
          </div>

          {/* ── RIGHT SUMMARY ── */}
          <div>
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)', padding: '1.75rem', position: 'sticky', top: '90px',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 500, marginBottom: '1.25rem' }}>
                Récapitulatif
              </div>

              {/* Car preview */}
              <div style={{
                background: 'var(--bg-raised)', borderRadius: 'var(--r-lg)',
                padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                <div style={{ width: '72px', height: '50px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  {car && <CarSVG id={car.id} style={{ width: '100%' }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{car?.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{car?.category} · {car?.specs?.year}</div>
                </div>
              </div>

              <div className="divider" />

              {[
                ['Dates', `${startDate} → ${endDate}`],
                ['Durée', `${days} jour${days > 1 ? 's' : ''}`],
                ['Prix/jour', `${Number(car?.price_per_day || 0).toLocaleString('fr-DZ')} DZD`],
                ['Assurance', '✓ Incluse'],
                ['Livraison', 'Gratuite'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>{label}</span>
                  <strong style={{ color: label === 'Assurance' ? 'var(--green)' : 'var(--text-primary)' }}>{val}</strong>
                </div>
              ))}

              <div className="divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '15px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
                  {total.toLocaleString('fr-DZ')} DZD
                </span>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.25rem', lineHeight: '1.6' }}>
                Paiement sécurisé · Annulation gratuite 48h avant · Assurance tous risques incluse
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function BookPage({ params }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><p>Chargement...</p></div>}>
      <BookingContent carId={id} />
    </Suspense>
  );
}
