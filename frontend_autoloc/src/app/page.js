import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import CarCard from '@/components/CarCard';

async function getFeaturedCars() {
  const { data } = await supabase
    .from('cars')
    .select('*')
    .eq('available', true)
    .order('rating', { ascending: false })
    .limit(6);
  return data ?? [];
}

export default async function Home() {
  const cars = await getFeaturedCars();

  return (
    <>
      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 3rem',
        overflow: 'hidden',
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'linear-gradient(135deg, #0A0A0B 0%, #12100E 40%, #1A1510 100%)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
          }} />
        </div>

        {/* Decorative car silhouette side */}
        <div style={{
          position: 'absolute', right: '0', bottom: '0',
          width: '55%', height: '80%',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
          opacity: 0.8, zIndex: 1,
          pointerEvents: 'none',
        }}>
          <img 
            src="https://img.pikbest.com/ai/illus_our/20230423/9815450df1b7da43db06745d5636f66f.jpg!w700wp" 
            alt="Voiture Orange" 
            style={{ 
              width: '100%', height: '100%', objectFit: 'contain', 
              maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
            }} 
          />
        </div>

        {/* Gradient overlay on right */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%', zIndex: 1,
          background: 'linear-gradient(270deg, var(--bg-deep) 0%, transparent 100%)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '620px' }}>
          <div className="animate" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(201,168,76,0.1)', border: '1px solid var(--border-bright)',
            borderRadius: '20px', padding: '6px 16px',
            fontSize: '12px', fontWeight: 500, letterSpacing: '0.06em',
            color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '2rem',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            Disponible 24h/24 · Livraison gratuite à Alger
          </div>

          <h1 className="animate delay-1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 300, lineHeight: 1.1, color: 'var(--text-primary)',
            letterSpacing: '-0.02em', marginBottom: '1.5rem',
          }}>
            Conduisez l'<strong style={{ fontWeight: 600, color: 'var(--gold)', fontStyle: 'italic' }}>excellence</strong><br />
            à votre rythme
          </h1>

          <p className="animate delay-2" style={{
            fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.75',
            marginBottom: '2.5rem', maxWidth: '440px',
          }}>
            La première plateforme algérienne de location de véhicules de prestige. 
            Mercedes, BMW, Porsche — réservez en ligne, conduisez en luxe.
          </p>

          <div className="animate delay-3" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/cars" className="btn-primary" style={{ fontSize: '15px', padding: '16px 32px' }}>
              Explorer les véhicules →
            </Link>
            <Link href="/auth" className="btn-ghost" style={{ fontSize: '15px', padding: '16px 32px' }}>
              Se connecter
            </Link>
          </div>

          <div className="animate delay-4" style={{
            display: 'flex', gap: '2.5rem', marginTop: '4rem',
            paddingTop: '2rem', borderTop: '1px solid var(--border)',
          }}>
            {[
              { num: '10+', label: 'Véhicules premium' },
              { num: '500+', label: 'Réservations' },
              { num: '4.9★', label: 'Note moyenne' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 500, color: 'var(--gold)', lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CARS ── */}
      <section className="section">
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <div className="overline">Sélection du moment</div>
          <h2 className="section-title">Véhicules <em>d'exception</em></h2>
          <p className="section-sub">Notre flotte de prestige soigneusement sélectionnée pour votre standing.</p>
        </div>

        {cars.length > 0 ? (
          <div className="cars-grid">
            {cars.map(car => <CarCard key={car.id} car={car} />)}
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', minHeight: '450px', overflow: 'hidden', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
            <img 
              src="/orange_bmw_hero.png" 
              alt="No vehicles" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} 
            />
            <div style={{
              position: 'absolute', inset: 0, 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(to top, rgba(10,10,11,0.8), transparent)',
              padding: '2rem', textAlign: 'center'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>Aucun véhicule disponible</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                Notre flotte est actuellement en cours de mise à jour. Revenez bientôt pour découvrir nos nouveautés.
              </p>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/cars" className="btn-outline">
            Voir tous les véhicules ({cars.length < 6 ? 'chargez la DB' : '10+'}) →
          </Link>
        </div>
      </section>

      {/* ── WHY AUTO-LOC ── */}
      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div className="overline" style={{ justifyContent: 'center' }}>Pourquoi nous choisir</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>L'<em>expérience</em> Auto-Loc</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '🔐', title: 'Réservation sécurisée', desc: 'Vos données personnelles et documents protégés avec le plus haut niveau de sécurité.' },
            { icon: '🚗', title: 'Flotte premium', desc: 'Uniquement des véhicules récents, entretenus et inspectés régulièrement.' },
            { icon: '📱', title: '100% en ligne', desc: 'Réservez depuis votre mobile ou ordinateur, 24h/24 et 7j/7 sans appel ni agence.' },
            { icon: '✅', title: 'Assurance incluse', desc: 'Tous nos véhicules sont couverts tous risques. Roulez l\'esprit tranquille.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              background: 'var(--bg-raised)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)', padding: '1.75rem',
              transition: 'border-color var(--transition)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.65' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section" style={{ textAlign: 'center' }}>
        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
          Prêt à prendre le <em>volant</em> ?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
          Inscrivez-vous gratuitement et réservez votre premier véhicule en moins de 5 minutes.
        </p>
        <Link href="/auth?mode=signup" className="btn-primary" style={{ fontSize: '15px', padding: '16px 36px' }}>
          Commencer maintenant →
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgwQUyL9eubsLtVfY11dkAvQn4tEkG_m0A8Q&s" 
                alt="Logo" 
                style={{ height: '45px', borderRadius: '8px' }} 
              />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 600, color: 'var(--gold)' }}>Auto·Loc</div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.7', maxWidth: '260px' }}>
              La première plateforme de location de voitures de luxe en Algérie. Qualité, sécurité, élégance.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Navigation</div>
            {['Véhicules', 'Mon espace', 'Connexion'].map(l => (
              <div key={l} style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Informations</div>
            {['Alger Centre, Algérie', 'contact@autoloc.dz', '+213 555 123 456'].map(l => (
              <div key={l} style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>© 2025 Auto-Loc. Tous droits réservés.</span>
          <span>Projet académique — Architecture Cloud & Vibe Programming</span>
        </div>
      </footer>
    </>
  );
}
