# Coffre-Fort Documentaire IA

Application web moderne et sécurisée pour la gestion de documents avec analyse IA intégrée, connectée à Mayan EDMS.

## 🎯 Fonctionnalités

### Pour tous les utilisateurs
- **Dashboard personnalisé** avec documents récents et statistiques IA
- **Recherche intelligente** alimentée par l'IA locale
- **Visualisation des documents** avec métadonnées complètes
- **Analyse IA automatique** : résumés et extraction de mots-clés
- **Gestion des tags** pour une organisation optimale
- **Interface responsive** : desktop, tablette et mobile

### Pour les administrateurs
- **Gestion des documents** : upload, permissions, visibilité
- **Gestion des utilisateurs** : rôles, activation/désactivation
- **Fenêtres d'accès temporaire** : contrôle fin des permissions
- **Dashboard admin** avec métriques et statistiques
- **Gestion des permissions** par utilisateur ou par rôle

## 🎨 Design System

### Couleurs
- **Background**: `#F3F4F6` (gris clair)
- **Surface**: `#FFFFFF` (blanc)
- **Primary**: `#1D4ED8` (bleu profond)
- **Secondary**: `#06B6D4` (cyan/teal)
- **Success**: `#10B981` (vert)
- **Warning**: `#F59E0B` (orange)
- **Error**: `#EF4444` (rouge)

### Typographie
- Police : Inter / SF Pro / système
- H1 : 2rem (32px), bold
- H2 : 1.5rem (24px), semi-bold
- H3 : 1.125rem (18px), semi-bold
- Body : 0.875rem (14px)
- Caption : 0.75rem (12px)

### Breakpoints
- Mobile : 390px
- Tablet : 1024px
- Desktop : 1440px+

## 🚀 Utilisation

### Connexion

**Pour tester en tant qu'utilisateur standard :**
- Email : `user@entreprise.fr`
- Mot de passe : n'importe quel mot de passe

**Pour tester en tant qu'administrateur :**
- Email : `admin@entreprise.fr`
- Mot de passe : n'importe quel mot de passe

### Navigation

#### Utilisateur standard
1. **Dashboard** : Vue d'ensemble avec documents récents et activité IA
2. **Mes documents** : Liste complète avec filtres et recherche
3. **Recherche** : Recherche intelligente avec suggestions IA
4. **Paramètres** : Configuration personnelle et notifications

#### Administrateur
Toutes les fonctions utilisateur +
1. **Admin** : Dashboard administrateur avec métriques
2. **Gestion documents** : Upload et gestion complète
3. **Gestion utilisateurs** : Modification des rôles et statuts
4. **Permissions** : Fenêtres d'accès temporaire par document

## 📱 Responsive Design

### Desktop (1440px+)
- Sidebar fixe à gauche
- Layout 2-3 colonnes pour les contenus
- Tables complètes avec toutes les colonnes
- Modals centrées

### Tablet (1024px)
- Sidebar collapsible
- Layout 2 colonnes
- Tables adaptées

### Mobile (390px)
- Sidebar en drawer/hamburger
- Layout 1 colonne
- Tables converties en cartes
- Actions tactiles optimisées

## 🔐 Niveaux de visibilité

- **PRIVATE** (🔒) : Accessible uniquement par le propriétaire
- **ROLE_BASED** (👥) : Accessible selon les rôles définis
- **PUBLIC** (🌐) : Accessible à tous les utilisateurs

## 🤖 Analyse IA

L'application utilise une IA **100% locale** pour :
- Générer des résumés automatiques
- Extraire les mots-clés pertinents
- Améliorer la recherche documentaire
- Suggérer des tags

**Modèles disponibles :**
- `local-llm-v1` : Rapide, optimisé pour la vitesse
- `local-llm-v2` : Précis, optimisé pour la qualité

## 📋 Structure des composants

```
/components
  /ui
    - Button.tsx        : Composant bouton (primary, secondary, ghost, danger)
    - Input.tsx         : Champ de saisie avec label et erreur
    - Card.tsx          : Carte conteneur
    - Badge.tsx         : Badge de statut
    - Chip.tsx          : Tag avec possibilité de suppression
    - Select.tsx        : Liste déroulante
    - Skeleton.tsx      : État de chargement
    - Toast.tsx         : Notification temporaire
    
  /layout
    - Layout.tsx        : Layout principal
    - Sidebar.tsx       : Barre latérale de navigation
    - TopBar.tsx        : Barre supérieure
    
  /pages
    - LoginPage.tsx           : Page de connexion
    - UserDashboard.tsx       : Dashboard utilisateur
    - DocumentsList.tsx       : Liste des documents
    - DocumentDetail.tsx      : Détail d'un document avec IA
    - SearchPage.tsx          : Recherche avancée
    - AdminDashboard.tsx      : Dashboard admin
    - AdminDocuments.tsx      : Gestion documents (admin)
    - AdminPermissions.tsx    : Gestion permissions (admin)
    - AdminUsers.tsx          : Gestion utilisateurs (admin)
    - SettingsPage.tsx        : Paramètres utilisateur
```

## 🎭 États et feedback

### États de chargement
- Skeletons pour les cartes et listes
- Spinners pour les actions
- Barres de progression pour les uploads

### États vides
- Icône + message pour les listes vides
- Bouton d'action principale

### Notifications
- Toast success (vert) en bas à droite
- Toast error (rouge) en bas à droite
- Auto-dismiss après 5 secondes

## 🔄 Flux de travail

### Upload d'un document (Admin)
1. Admin Dashboard → "Téléverser un document"
2. Glisser-déposer ou sélection fichier
3. Remplir titre, visibilité, tags
4. Upload avec barre de progression
5. Analyse IA automatique lancée
6. Notification de succès

### Gestion des permissions (Admin)
1. Sélectionner un document
2. Cliquer sur l'icône permissions
3. Ajouter une permission
4. Sélectionner utilisateur/rôle
5. Définir fenêtre temporelle (début/fin)
6. Enregistrer

### Recherche de documents (User)
1. Utiliser la barre de recherche
2. Filtrer par date, visibilité, tags
3. Voir résultats avec pertinence IA
4. Cliquer pour accéder au détail

## 🛠️ Technologies

- **React** : Framework UI
- **TypeScript** : Typage statique
- **Tailwind CSS v4** : Styling avec design tokens
- **Lucide React** : Icônes
- **Mayan EDMS** : Backend documentaire
- **IA Locale** : Analyse sans cloud

## ⚡ Performance

- Chargement lazy des pages
- Optimisation des images
- Composants mémorisés
- Animations fluides (transitions CSS)

## 🌐 Internationalisation

Interface en français avec support pour :
- Formats de date français (dd/mm/yyyy)
- Formats d'heure 24h
- Terminologie métier française

## 📝 Notes importantes

- **Sécurité** : Authentification SSO supportée
- **Confidentialité** : IA 100% locale, aucune donnée externe
- **Accessibilité** : Labels, contraste, navigation clavier
- **Production-ready** : États d'erreur, validations, feedback utilisateur

---

Développé avec ❤️ pour une expérience documentaire moderne et sécurisée.
