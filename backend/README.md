# ESA-TEZ Backend API

Backend API pour l'application Document AI Vault (ESA-TEZ).

## 🚀 Installation

### Prérequis

- Python 3.8+
- pip
- (Optionnel) Ollama pour l'analyse IA des documents

### Installation des dépendances

```bash
cd backend
pip install -r requirements.txt
```

### Configuration de la base de données

```bash
python manage.py migrate
```

### Créer un utilisateur admin

```bash
python create_admin.py
```

Ou manuellement :

```bash
python manage.py createsuperuser
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Django
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (optional, defaults to SQLite)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=esatez
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# Ollama API (for AI analysis)
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=mistral:7b
```

### Configuration d'Ollama (Optionnel)

Pour activer l'analyse IA des documents, installez Ollama :

```bash
# Installation d'Ollama
curl https://ollama.ai/install.sh | sh

# Télécharger le modèle Mistral
ollama pull mistral:7b

# Lancer Ollama
ollama serve
```

## 🏃‍♂️ Lancement

### Mode développement

```bash
cd backend
python manage.py runserver 0.0.0.0:8001
```

L'API sera accessible sur : http://localhost:8001

### Interface d'administration

Accédez à l'interface d'administration Django sur :
http://localhost:8001/admin

Utilisez les identifiants créés avec `create_admin.py` :
- Email: admin@esa-tez.com
- Mot de passe: admin123

## 📚 Documentation API

### Base URL

```
http://localhost:8001/api
```

### Authentification

Toutes les requêtes (sauf register et login) nécessitent un token JWT dans le header :

```
Authorization: Bearer <access_token>
```

### Endpoints disponibles

#### 🔐 Authentification

- `POST /api/auth/register/` - Créer un compte
- `POST /api/auth/login/` - Se connecter
- `POST /api/auth/refresh/` - Rafraîchir le token
- `GET /api/auth/me/` - Obtenir les infos utilisateur
- `GET /api/auth/users/` - Lister les utilisateurs (admin)
- `GET /api/auth/users/{id}/` - Détails d'un utilisateur
- `PATCH /api/auth/users/{id}/update/` - Modifier un utilisateur

#### 📄 Documents

- `GET /api/documents/` - Lister les documents (avec filtres)
- `POST /api/documents/` - Uploader un document
- `GET /api/documents/{id}/` - Récupérer un document
- `PATCH /api/documents/{id}/update/` - Modifier un document
- `DELETE /api/documents/{id}/delete/` - Supprimer un document
- `POST /api/documents/{id}/analyze/` - Lancer l'analyse IA

#### 🏷️ Tags

- `GET /api/documents/tags/` - Lister tous les tags

#### 📊 Statistiques

- `GET /api/documents/stats/` - Statistiques des documents (admin)

## 🔍 Exemples d'utilisation

### Se connecter

```bash
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@esa-tez.com",
    "password": "admin123"
  }'
```

### Uploader un document

```bash
curl -X POST http://localhost:8001/api/documents/ \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@document.pdf" \
  -F "title=Mon Document" \
  -F "description=Description du document" \
  -F "visibility=PRIVATE" \
  -F "tags=Finance,Rapport"
```

### Lister les documents avec filtres

```bash
curl -X GET "http://localhost:8001/api/documents/?search=rapport&visibility=PRIVATE&analyzed=true" \
  -H "Authorization: Bearer <access_token>"
```

## 🧪 Tests

```bash
python manage.py test
```

## 📁 Structure du projet

```
backend/
├── authentication/          # App d'authentification
│   ├── models.py           # Modèle User personnalisé
│   ├── serializers.py      # Serializers pour l'API
│   ├── views.py            # Vues de l'API
│   └── urls.py             # Routes
├── documents/              # App de gestion des documents
│   ├── models.py           # Modèles Document, Tag, Analysis
│   ├── serializers.py      # Serializers
│   ├── views.py            # Vues de l'API
│   ├── ai_service.py       # Service d'analyse IA
│   └── urls.py             # Routes
├── esatez/                 # Configuration du projet
│   ├── settings.py         # Configuration Django
│   └── urls.py             # Routes principales
├── media/                  # Fichiers uploadés
├── manage.py               # Script de gestion Django
├── requirements.txt        # Dépendances Python
└── README.md              # Cette documentation
```

## 🔒 Sécurité

- Tokens JWT avec expiration (1h pour access, 7 jours pour refresh)
- Mots de passe hashés avec bcrypt
- CORS configuré pour le frontend
- Permissions basées sur les rôles
- Validation des fichiers (PDF uniquement)

## 🐛 Dépannage

### Erreur de connexion à Ollama

Si l'analyse IA ne fonctionne pas :

1. Vérifiez qu'Ollama est lancé : `ollama serve`
2. Vérifiez que le modèle est téléchargé : `ollama list`
3. Vérifiez l'URL dans `.env` : `OLLAMA_API_URL=http://localhost:11434`

### Erreur de migration

```bash
python manage.py migrate --run-syncdb
```

### Réinitialiser la base de données

```bash
rm db.sqlite3
python manage.py migrate
python create_admin.py
```

## 📝 Licence

Ce projet est sous licence MIT.
