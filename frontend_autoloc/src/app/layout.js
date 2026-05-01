import './globals.css';
import Navbar from '@/components/Navbar';
import Toast from '@/components/Toast';

export const metadata = {
  title: 'Auto-Loc — Luxury Car Rental Algeria',
  description: 'Location de voitures de prestige en Algérie. Réservez votre véhicule de luxe en quelques clics.',
  icons: {
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgwQUyL9eubsLtVfY11dkAvQn4tEkG_m0A8Q&s',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        <main style={{ paddingTop: '72px' }}>
          {children}
        </main>
        <Toast />
      </body>
    </html>
  );
}
