# Auto-Loc 🚗 — Location de Véhicules de Prestige

> **Projet de Fin de Module** — Architecture Cloud & Vibe Programming  
> Thème : **Location Auto** | Stack : Next.js 16 · Supabase · Vercel

---

## 🗺️ Mapping du Thème

| Rôle BD | Table | Description |
|---|---|---|
| **Table A** | `auth.users` (Supabase Auth) | Les **clients** : inscription, connexion, profil |
| **Table B** | `cars` | Les **véhicules** : nom, catégorie, prix/jour, specs |
| **Table C** | `reservations` | Les **réservations** : jointure client ↔ voiture, dates, statut |
| **Storage** | bucket `licenses` | **Photo du permis de conduire** uploadée par le client |

---

## ✅ Flux utilisateur complet

1. **Inscription / Connexion** → Supabase Auth (email + password)
2. **Voir les véhicules** → Page `/cars` avec filtres (catégorie, marque, prix)
3. **Détail véhicule** → Page `/cars/[id]` avec panneau de réservation
4. **Réserver** → Page `/book/[id]` : formulaire + upload permis → création dans `reservations`
5. **Dashboard** → Page `/dashboard` : historique personnel (RLS isolé par `user_id`)
6. **Profil** → Infos du compte dans le dashboard

---

## 🏗️ Analyse d'Architecture (README Architecte)

### 1. Vercel + Supabase vs Serveur Classique (CAPEX / OPEX)

Un serveur physique classique implique un investissement initial lourd : achat de machines rack, switches réseau, onduleurs, licences OS — c'est du **CAPEX** (Capital Expenditure), une dépense d'investissement immobilisée au bilan.

Avec **Vercel + Supabase**, tout se passe en **OPEX** (Operational Expenditure) : on paye uniquement ce qu'on consomme (requêtes, bande passante, stockage). Au lancement d'un projet comme Auto-Loc :
- **Coût CAPEX classique** : 300 000 à 800 000 DZD (serveur + réseau + installation)
- **Coût OPEX Vercel/Supabase** : 0 DZD sur les tiers gratuits, puis quelques dizaines de dollars/mois si le trafic monte

Pour un extranet avec trafic imprévisible, le modèle OPEX est **financièrement rationnel** : on ne mobilise pas de capital en début de projet, on scale les dépenses avec la croissance réelle.

### 2. Scalabilité Vercel vs Data Center Physique Local

Un data center local en Algérie implique des coûts cachés permanents : climatisation industrielle (30–40% de la consommation électrique), maintenance préventive des disques et RAM, gestion des pics de charge avec des serveurs surdimensionnés dormants 90% du temps.

**Vercel** utilise un modèle **Serverless Edge** : chaque page Next.js est déployée comme une fonction isolée sur un réseau mondial de points de présence (PoP). Quand 1 000 clients consultent `/cars` simultanément, Vercel instancie automatiquement 1 000 fonctions en parallèle sans intervention humaine. Quand le trafic retombe, aucun serveur ne tourne à vide. Il n'y a ni rack à acheter, ni climatiseur à entretenir, ni technicien d'astreinte.

### 3. Données Structurées vs Non-structurées

**Données structurées** : tout ce qui est en PostgreSQL via Supabase — la table `cars` (colonnes typées : `price_per_day INTEGER`, `rating NUMERIC`) et la table `reservations` (avec clés étrangères, contraintes `CHECK` sur le statut, `TIMESTAMPTZ` pour les dates). Ces données sont interrogeables par SQL, filtrables, agrégables.

**Données non-structurées** : les photos des permis de conduire uploadées dans **Supabase Storage** (bucket `licenses`). Un fichier JPEG ou PDF n'a pas de schéma fixe — c'est un blob binaire de taille variable, stocké avec une URL unique. C'est aussi le cas des specs techniques (`JSONB` dans `cars`), un format semi-structuré flexible qui permet d'avoir des clés variables selon le modèle de voiture.

---

## 🚀 Installation & Déploiement

### 1. Variables d'environnement (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Base de données Supabase
Exécuter `supabase_setup.sql` dans **Supabase > SQL Editor**.  
Créer le bucket `licenses` dans **Supabase > Storage** (Public: ✅).

### 3. Développement local
```bash
npm install
npm run dev
# → http://localhost:3000
```

### 4. Déploiement Vercel (CI/CD)
```bash
git push origin main
# → Vercel rebuild automatique à chaque push
```

---

## 📦 Tech Stack

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16.2 (App Router) + React 19 |
| Base de données | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Hébergement | Vercel (CI/CD via GitHub) |
| Style | CSS custom (dark luxury theme) |
