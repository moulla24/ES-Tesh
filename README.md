
# ESA-TEZ - Document AI Vault

Application complète de gestion de documents avec analyse IA. Ce projet comprend un frontend React et un backend Django REST API.

## 📁 Structure du Projet

```
ES-Tesh/
├── src/              # Frontend React (UI Design)
├── backend/          # Backend Django REST API
└── README.md         # Cette documentation
```

## 🚀 Démarrage Rapide

### Frontend

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend sera accessible sur http://localhost:5173

### Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances Python
pip install -r requirements.txt

# Migrer la base de données
python manage.py migrate

# Créer un utilisateur admin
python create_admin.py

# Lancer le serveur
python manage.py runserver 0.0.0.0:8001
```

Le backend sera accessible sur http://localhost:8001

**Identifiants par défaut:**
- Email: `admin@esa-tez.com`
- Mot de passe: `admin123`

## 📚 Documentation

- [Documentation Backend](backend/README.md) - Guide complet du backend
- [Exemples d'API](backend/API_EXAMPLES.md) - Exemples d'utilisation de l'API
- [Frontend README](src/README.md) - Documentation du frontend

## 🐳 Docker

Pour lancer l'application complète avec Docker:

```bash
cd backend
docker-compose up -d
```

Cela lancera:
- Base de données PostgreSQL
- Backend Django sur le port 8001
- Ollama pour l'analyse IA

## ✨ Fonctionnalités

### Backend API
- ✅ Authentification JWT (register, login, refresh)
- ✅ Gestion des utilisateurs (CRUD, rôles)
- ✅ Upload de documents PDF
- ✅ Analyse IA des documents (extraction de texte, résumé, mots-clés)
- ✅ Gestion des tags
- ✅ Filtres et recherche avancée
- ✅ Permissions basées sur la visibilité (PRIVATE, ROLE_BASED, PUBLIC)
- ✅ Statistiques pour les administrateurs

### Frontend
- Interface utilisateur moderne
- Composants React avec shadcn/ui
- Design responsive

## 🔧 Technologies

### Frontend
- React 18
- Vite
- TailwindCSS
- Radix UI
- Recharts

### Backend
- Django 6.0
- Django REST Framework
- JWT Authentication
- PostgreSQL / SQLite
- Ollama (AI Analysis)

## 📝 Licence

MIT

## 🎨 Design

Le design UI est basé sur le projet Figma : https://www.figma.com/design/uZ32f7ZYuzRp7vwLWe8L1Z/Document-AI-Vault-UI-Design
  