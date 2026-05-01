'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) router.replace('/dashboard');
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (mode === 'signup') {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      });
      if (err) { setError(err.message); }
      else { setSuccess('Compte créé ! Vérifiez votre email pour confirmer.'); }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError('Email ou mot de passe incorrect.'); }
      else { router.push('/dashboard'); }
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', background: 'var(--bg-deep)',
      backgroundImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,168,76,0.05) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600,
            color: 'var(--gold)', marginBottom: '0.5rem',
          }}>Auto·Loc</div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Location de véhicules de prestige</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)', padding: '2.5rem',
        }}>
          {/* Mode tabs */}
          <div style={{
            display: 'flex', background: 'var(--bg-raised)', borderRadius: 'var(--r-md)',
            padding: '4px', marginBottom: '2rem',
          }}>
            {[['login', 'Connexion'], ['signup', "S'inscrire"]].map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '9px', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                fontFamily: 'var(--font-body)', transition: 'all var(--transition)',
                background: mode === m ? 'var(--bg-card)' : 'transparent',
                color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
              }}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <div className="form-group">
                  <label className="form-label">Nom complet</label>
                  <input
                    type="text" className="form-input"
                    placeholder="Mohammed Benali"
                    value={fullName} onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel" className="form-input"
                    placeholder="+213 555 000 000"
                    value={phone} onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Adresse email</label>
              <input
                type="email" className="form-input"
                placeholder="votre@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Mot de passe</label>
              <input
                type="password" className="form-input"
                placeholder={mode === 'signup' ? 'Minimum 8 caractères' : '••••••••'}
                value={password} onChange={e => setPassword(e.target.value)}
                required minLength={8}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
                borderRadius: 'var(--r-md)', padding: '10px 14px',
                fontSize: '13px', color: '#E74C3C', marginBottom: '1rem',
              }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{
                background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.3)',
                borderRadius: 'var(--r-md)', padding: '10px 14px',
                fontSize: '13px', color: 'var(--green)', marginBottom: '1rem',
              }}>
                ✅ {success}
              </div>
            )}

            <button type="submit" className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              disabled={loading}
            >
              {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Pas encore de compte ? " : "Déjà inscrit ? "}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{
              background: 'none', border: 'none', color: 'var(--gold)',
              cursor: 'pointer', fontWeight: 600, fontSize: '13px',
              fontFamily: 'var(--font-body)',
            }}>
              {mode === 'login' ? "S'inscrire" : 'Se connecter'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          En vous inscrivant, vous acceptez nos conditions d'utilisation.
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  );
}
