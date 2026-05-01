import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback to dummy client if env vars are missing to prevent runtime crash
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (() => {
      let currentUser = null;
      const listeners = new Set();

      const demoCars = [
        { id: 1, name: 'Audi S3 8V Facelift', brand: 'Audi', category: 'Sportive', price_per_day: 32000, rating: 4.9, reviews: 156, specs: { power: '310ch', seats: 5, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/06/de/c5/06dec52d442b75ec7f97d19a6fa87359.jpg', available: true, description: 'L\'élégance sportive allemande dans toute sa splendeur.' },
        { id: 2, name: 'BMW M8 Competition', brand: 'BMW', category: 'Sportive', price_per_day: 55000, rating: 4.8, reviews: 92, specs: { power: '625ch', seats: 4, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/4e/cf/a4/4ecfa48e76fdb167a0f387673cda93b3.jpg', available: true, description: 'Le luxe sportif redéfini.' },
        { id: 3, name: 'Porsche 911 GT3 RS', brand: 'Porsche', category: 'Sportive', price_per_day: 85000, rating: 5.0, reviews: 41, specs: { power: '525ch', seats: 2, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/ad/65/51/ad6551027d0bf68dcbae46106c760e1f.jpg', available: true, description: 'La bête de circuit homologuée pour la route.' },
        { id: 4, name: 'Range Rover Sport SVR', brand: 'Range Rover', category: 'SUV', price_per_day: 48000, rating: 4.7, reviews: 84, specs: { power: '575ch', seats: 5, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/c9/76/68/c97668d5f8a74e7de53551740783e9d3.jpg', available: true, description: 'Le SUV le plus dynamique de Range Rover.' },
        { id: 5, name: 'Mercedes-AMG G 63', brand: 'Mercedes', category: '4x4', price_per_day: 65000, rating: 4.9, reviews: 124, specs: { power: '585ch', seats: 5, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/78/82/a2/7882a250f5ccb69055786d0b831ef97f.jpg', available: true, description: 'L\'icône tout-terrain indémodable.' },
        { id: 6, name: 'Ferrari 488 Pista', brand: 'Ferrari', category: 'Sportive', price_per_day: 150000, rating: 5.0, reviews: 21, specs: { power: '720ch', seats: 2, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/3b/26/88/3b26881433988aeefa8f66e91d27c877.jpg', available: true, description: 'L\'émotion pure à l\'italienne.' },
        { id: 7, name: 'Lamborghini Huracán STO', brand: 'Lamborghini', category: 'Sportive', price_per_day: 140000, rating: 4.9, reviews: 18, specs: { power: '640ch', seats: 2, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/236x/51/94/c2/5194c2fbce6a4476878ecb7530c9b2dc.jpg', available: true, description: 'Inspirée par la course, conçue pour la route.' },
        { id: 8, name: 'McLaren 720S Spider', brand: 'McLaren', category: 'Sportive', price_per_day: 125000, rating: 4.9, reviews: 15, specs: { power: '720ch', seats: 2, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/a3/dc/aa/a3dcaa55d20b0297c57f7302c4950b45.jpg', available: true, description: 'Performance aérodynamique et ciel ouvert.' },
        { id: 9, name: 'Bentley Continental GT V8', brand: 'Bentley', category: 'Sportive', price_per_day: 95000, rating: 4.8, reviews: 32, specs: { power: '550ch', seats: 4, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/70/26/12/7026124e74e18308e43ad3ff8b040c4c.jpg', available: true, description: 'Le luxe artisanal et la puissance.' },
        { id: 10, name: 'Rolls-Royce Ghost 2024', brand: 'Rolls-Royce', category: 'Berline', price_per_day: 210000, rating: 5.0, reviews: 10, specs: { power: '571ch', seats: 5, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/f8/aa/6d/f8aa6d260b2d7d484e3736dde73bcc23.jpg', available: true, description: 'Le silence est le nouveau luxe.' },
        { id: 11, name: 'Maserati GranTurismo', brand: 'Maserati', category: 'Sportive', price_per_day: 52000, rating: 4.7, reviews: 45, specs: { power: '490ch', seats: 4, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/40/01/d1/4001d154bd0cecb84d5f2a2ccf23674e.jpg', available: true, description: 'L\'élégance italienne intemporelle.' },
        { id: 12, name: 'Aston Martin Vantage', brand: 'Aston Martin', category: 'Sportive', price_per_day: 68000, rating: 4.8, reviews: 25, specs: { power: '510ch', seats: 2, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/37/c5/56/37c5562312e9a284420115015944330b.jpg', available: true, description: 'La beauté sauvage.' },
        { id: 13, name: 'Jaguar F-Type SVR', brand: 'Jaguar', category: 'Sportive', price_per_day: 42000, rating: 4.7, reviews: 54, specs: { power: '575ch', seats: 2, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/7d/5d/02/7d5d020fc09aeac5d5481ac6dcc6eb31.jpg', available: true, description: 'Un rugissement légendaire.' },
        { id: 14, name: 'Cadillac Escalade V', brand: 'Cadillac', category: 'SUV', price_per_day: 75000, rating: 4.9, reviews: 41, specs: { power: '682ch', seats: 7, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/0f/d2/26/0fd226a231f5f410fc9fc082f6f0f66c.jpg', available: true, description: 'Le luxe américain sans compromis.' },
        { id: 15, name: 'Lexus LC 500 Bespoke', brand: 'Lexus', category: 'Sportive', price_per_day: 45000, rating: 4.8, reviews: 36, specs: { power: '477ch', seats: 4, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/25/c0/37/25c0377845c05065b299e0ef0d397452.jpg', available: true, description: 'L\'artisanat japonais au service du style.' },
        { id: 16, name: 'Land Rover Defender V8', brand: 'Land Rover', category: '4x4', price_per_day: 38000, rating: 4.8, reviews: 85, specs: { power: '525ch', seats: 5, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/b9/69/b3/b969b335ccc0730ceb2edef29db1befb.jpg', available: true, description: 'L\'aventure avec une touche de puissance.' },
        { id: 17, name: 'Mercedes-Maybach GLS', brand: 'Mercedes', category: 'SUV', price_per_day: 110000, rating: 5.0, reviews: 14, specs: { power: '557ch', seats: 4, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/c8/3e/50/c83e501f5a0714e1ad07511e0d2046b1.jpg', available: true, description: 'Le voyage en première classe.' },
        { id: 18, name: 'Bugatti Divo Custom', brand: 'Bugatti', category: 'Sportive', price_per_day: 450000, rating: 5.0, reviews: 2, specs: { power: '1500ch', seats: 2, fuel: 'Essence' }, image_url: 'https://i.pinimg.com/736x/f3/29/58/f32958e5718ad4ea31c4e48060992fe3.jpg', available: true, description: 'L\'exclusivité redéfinie.' },
      ];

      const notify = (event, user) => {
        currentUser = user;
        listeners.forEach(cb => cb(event, user ? { user } : null));
      };

      const createMockChain = (currentData) => {
        const chain = {
          select: () => createMockChain(currentData),
          eq: (key, val) => {
            if (key === 'id') {
              const car = demoCars.find(c => c.id == val);
              return createMockChain(car ? [car] : []);
            }
            if (key === 'available') return createMockChain(currentData.filter(c => c.available));
            return createMockChain(currentData);
          },
          match: () => chain,
          order: () => chain,
          limit: () => chain,
          range: () => chain,
          single: () => Promise.resolve({ data: currentData[0] || null, error: currentData[0] ? null : { message: 'Not found' } }),
          then: (onFullfilled) => Promise.resolve({ data: currentData, error: null }).then(onFullfilled),
          catch: (onRejected) => Promise.resolve({ data: currentData, error: null }).catch(onRejected),
        };
        return chain;
      };

      return {
        from: () => createMockChain(demoCars),
        auth: {
          getSession: () => Promise.resolve({ data: { session: currentUser ? { user: currentUser } : null }, error: null }),
          getUser: () => Promise.resolve({ data: { user: currentUser }, error: null }),
          signInWithPassword: ({ email, password }) => {
            console.log('Tentative de connexion démo avec:', email);
            if (email === 'demo@autoloc.dz' && password === 'password123') {
              const user = { email: 'demo@autoloc.dz', id: 'demo-user-id' };
              notify('SIGNED_IN', user);
              return Promise.resolve({ data: { user, session: { user } }, error: null });
            }
            return Promise.resolve({ data: { user: null }, error: { message: 'Identifiants invalides pour la démo.' } });
          },
          signUp: () => Promise.resolve({ data: { user: null }, error: null }),
          signOut: () => {
            notify('SIGNED_OUT', null);
            return Promise.resolve({ error: null });
          },
          onAuthStateChange: (cb) => {
            listeners.add(cb);
            return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
          },
        }
      };
    })();
