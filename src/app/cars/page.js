'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CarCard from '@/components/CarCard';

const CATEGORIES = ['Tous', 'SUV', 'Berline', 'Sportive', '4x4'];
const BRANDS = ['Tous', 'Mercedes', 'BMW', 'Audi', 'Porsche', 'Range Rover', 'Lamborghini', 'Ferrari', 'Bentley', 'Rolls-Royce', 'Maserati', 'Tesla', 'Land Rover'];

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Tous');
  const [brand, setBrand] = useState('Tous');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [sort, setSort] = useState('rating');

  useEffect(() => {
    supabase.from('cars').select('*').eq('available', true).then(({ data }) => {
      setCars(data ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...cars];
    if (category !== 'Tous') result = result.filter(c => c.category === category);
    if (brand !== 'Tous') result = result.filter(c => c.brand === brand);
    result = result.filter(c => c.price_per_day <= maxPrice);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sort === 'price_asc') result.sort((a, b) => a.price_per_day - b.price_per_day);
    if (sort === 'price_desc') result.sort((a, b) => b.price_per_day - a.price_per_day);
    setFiltered(result);
  }, [cars, category, brand, maxPrice, sort]);

  return (
    <div style={{ padding: '2.5rem 3rem', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="overline">Notre flotte</div>
        <h1 className="section-title">Tous les <em>véhicules</em></h1>
        <p className="section-sub">Filtrez et trouvez le véhicule parfait pour votre prochaine sortie.</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* ── SIDEBAR ── */}
        <aside style={{
          width: '260px', flexShrink: 0,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)', padding: '1.5rem',
          position: 'sticky', top: '90px', height: 'fit-content',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Filtres
          </div>

          {/* Category */}
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Catégorie
            </div>
            <div>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} style={{
                  display: 'inline-block', padding: '6px 12px', margin: '4px 4px 0 0',
                  border: `1px solid ${category === cat ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: '20px', fontSize: '12px',
                  color: category === cat ? 'var(--gold)' : 'var(--text-secondary)',
                  background: category === cat ? 'rgba(201,168,76,0.08)' : 'transparent',
                  cursor: 'pointer', transition: 'all var(--transition)', fontFamily: 'var(--font-body)',
                }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Marque
            </div>
            <div>
              {BRANDS.map(b => (
                <button key={b} onClick={() => setBrand(b)} style={{
                  display: 'inline-block', padding: '6px 12px', margin: '4px 4px 0 0',
                  border: `1px solid ${brand === b ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: '20px', fontSize: '12px',
                  color: brand === b ? 'var(--gold)' : 'var(--text-secondary)',
                  background: brand === b ? 'rgba(201,168,76,0.08)' : 'transparent',
                  cursor: 'pointer', transition: 'all var(--transition)', fontFamily: 'var(--font-body)',
                }}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Prix max / jour
            </div>
            <input
              type="range" min="10000" max="200000" step="5000"
              value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--gold)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span>10 000 DZD</span>
              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{maxPrice.toLocaleString('fr-DZ')} DZD</span>
            </div>
          </div>

          {/* Reset */}
          <button onClick={() => { setCategory('Tous'); setBrand('Tous'); setMaxPrice(200000); }} style={{
            marginTop: '1.5rem', width: '100%', padding: '9px',
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)', color: 'var(--text-muted)', fontSize: '12px',
            cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all var(--transition)',
          }}>
            Réinitialiser
          </button>
        </aside>

        {/* ── MAIN ── */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> véhicule{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)', padding: '8px 12px',
              color: 'var(--text-secondary)', fontSize: '13px',
              fontFamily: 'var(--font-body)', cursor: 'pointer',
            }}>
              <option value="rating">Mieux notés</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Chargement des véhicules...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '4rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)', color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p>Aucun véhicule ne correspond à vos filtres.</p>
              <button onClick={() => { setCategory('Tous'); setBrand('Tous'); setMaxPrice(60000); }}
                className="btn-sm" style={{ marginTop: '1rem' }}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="cars-grid">
              {filtered.map(car => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
