# 📡 Exemples d'Utilisation de l'API ESA-TEZ

Ce document fournit des exemples concrets d'utilisation de l'API ESA-TEZ.

## Base URL
```
http://localhost:8001/api
```

---

## 🔐 Authentification

### 1. Créer un compte

```bash
curl -X POST http://localhost:8001/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "username": "jeandupont",
    "first_name": "Jean",
    "last_name": "Dupont",
    "password": "MotDePasseSecure123",
    "password_confirm": "MotDePasseSecure123"
  }'
```

**Réponse:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "jean.dupont@example.com",
    "username": "jeandupont",
    "first_name": "Jean",
    "last_name": "Dupont",
    "display_name": "Jean Dupont",
    "role": "USER",
    "origin": "LOCAL",
    "is_active": true,
    "is_admin": false
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "message": "Compte créé avec succès"
}
```

### 2. Se connecter

```bash
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@esa-tez.com",
    "password": "admin123"
  }'
```

**Réponse:**
```json
{
  "user": {
    "id": "c1b5139f-8f24-41a8-9610-5d020e767c6a",
    "email": "admin@esa-tez.com",
    "username": "admin",
    "first_name": "Admin",
    "last_name": "ESA-TEZ",
    "display_name": "Admin ESA-TEZ",
    "role": "ADMIN",
    "origin": "LOCAL",
    "is_active": true,
    "is_admin": true
  },
  "tokens": {
    "refresh": "eyJhbGc...",
    "access": "eyJhbGc..."
  },
  "message": "Connexion réussie"
}
```

### 3. Rafraîchir le token

```bash
curl -X POST http://localhost:8001/api/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "votre_refresh_token"
  }'
```

### 4. Obtenir les infos utilisateur

```bash
curl -X GET http://localhost:8001/api/auth/me/ \
  -H "Authorization: Bearer votre_access_token"
```

---

## 📄 Gestion des Documents

### 1. Uploader un document

```bash
curl -X POST http://localhost:8001/api/documents/ \
  -H "Authorization: Bearer votre_access_token" \
  -F "file=@/chemin/vers/document.pdf" \
  -F "title=Rapport Annuel 2024" \
  -F "description=Rapport financier de l'année 2024" \
  -F "visibility=PRIVATE" \
  -F "tags=Finance,Rapport,2024"
```

**Réponse:**
```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "title": "Rapport Annuel 2024",
  "description": "Rapport financier de l'année 2024",
  "file": "http://localhost:8001/media/documents/...",
  "file_url": "http://localhost:8001/media/documents/...",
  "file_size": 524288,
  "page_count": 15,
  "owner": {
    "id": "...",
    "email": "admin@esa-tez.com",
    "display_name": "Admin ESA-TEZ"
  },
  "visibility": "PRIVATE",
  "analyzed": false,
  "tags": [
    {"id": "...", "name": "Finance", "color": "#1D4ED8"},
    {"id": "...", "name": "Rapport", "color": "#1D4ED8"}
  ],
  "snippet": "Ce rapport présente les résultats financiers...",
  "created_at": "2024-12-05T10:30:00Z"
}
```

### 2. Lister les documents

```bash
# Tous les documents
curl -X GET http://localhost:8001/api/documents/ \
  -H "Authorization: Bearer votre_access_token"

# Avec filtres
curl -X GET "http://localhost:8001/api/documents/?search=rapport&visibility=PRIVATE&tags=Finance&analyzed=true&ordering=-created_at&page=1" \
  -H "Authorization: Bearer votre_access_token"
```

**Paramètres de filtre disponibles:**
- `search` : Recherche dans titre, description, snippet
- `visibility` : PRIVATE, ROLE_BASED, PUBLIC
- `tags` : Filtrer par tags (séparés par virgules)
- `analyzed` : true/false
- `owner` : ID de l'utilisateur (admin seulement)
- `date_from` : Date de début (YYYY-MM-DD)
- `date_to` : Date de fin (YYYY-MM-DD)
- `ordering` : Tri (-created_at, title, file_size)
- `page` : Numéro de page
- `page_size` : Nombre d'éléments par page

### 3. Récupérer un document

```bash
curl -X GET http://localhost:8001/api/documents/7c9e6679-7425-40de-944b-e07fc1f90ae7/ \
  -H "Authorization: Bearer votre_access_token"
```

### 4. Modifier un document

```bash
curl -X PATCH http://localhost:8001/api/documents/7c9e6679-7425-40de-944b-e07fc1f90ae7/update/ \
  -H "Authorization: Bearer votre_access_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Rapport Annuel 2024 - Version Finale",
    "description": "Version finalisée du rapport",
    "visibility": "PUBLIC",
    "tags": ["Finance", "Rapport", "Public"]
  }'
```

### 5. Supprimer un document

```bash
curl -X DELETE http://localhost:8001/api/documents/7c9e6679-7425-40de-944b-e07fc1f90ae7/delete/ \
  -H "Authorization: Bearer votre_access_token"
```

### 6. Lancer l'analyse IA manuelle

```bash
curl -X POST http://localhost:8001/api/documents/7c9e6679-7425-40de-944b-e07fc1f90ae7/analyze/ \
  -H "Authorization: Bearer votre_access_token"
```

**Réponse:**
```json
{
  "message": "Analyse lancée",
  "document_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
}
```

---

## 🏷️ Tags

### 1. Lister tous les tags

```bash
curl -X GET http://localhost:8001/api/documents/tags/ \
  -H "Authorization: Bearer votre_access_token"
```

**Réponse:**
```json
{
  "count": 4,
  "results": [
    {
      "id": "...",
      "name": "Finance",
      "color": "#1D4ED8",
      "created_at": "2024-12-01T08:00:00Z"
    },
    {
      "id": "...",
      "name": "Rapport",
      "color": "#1D4ED8",
      "created_at": "2024-12-01T08:05:00Z"
    }
  ]
}
```

---

## 📊 Statistiques

### 1. Statistiques des documents (Admin)

```bash
curl -X GET http://localhost:8001/api/documents/stats/ \
  -H "Authorization: Bearer votre_access_token"
```

**Réponse:**
```json
{
  "total_documents": 127,
  "analyzed_documents": 98,
  "analyzed_percentage": 77.17
}
```

---

## 👥 Gestion des Utilisateurs (Admin)

### 1. Lister les utilisateurs

```bash
curl -X GET "http://localhost:8001/api/auth/users/?role=USER&status=active&search=jean" \
  -H "Authorization: Bearer votre_access_token"
```

### 2. Détails d'un utilisateur

```bash
curl -X GET http://localhost:8001/api/auth/users/550e8400-e29b-41d4-a716-446655440000/ \
  -H "Authorization: Bearer votre_access_token"
```

### 3. Modifier un utilisateur

```bash
curl -X PATCH http://localhost:8001/api/auth/users/550e8400-e29b-41d4-a716-446655440000/update/ \
  -H "Authorization: Bearer votre_access_token" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "ADMIN",
    "is_active": true
  }'
```

---

## 🐍 Exemples Python

### Utilisation avec requests

```python
import requests
import time

# Configuration
BASE_URL = "http://localhost:8001"
EMAIL = "admin@esa-tez.com"
PASSWORD = "admin123"

# 1. Se connecter
response = requests.post(
    f"{BASE_URL}/api/auth/login/",
    json={"email": EMAIL, "password": PASSWORD}
)
data = response.json()
access_token = data['tokens']['access']

# Headers pour les requêtes authentifiées
headers = {
    "Authorization": f"Bearer {access_token}"
}

# 2. Uploader un document
with open('document.pdf', 'rb') as file:
    files = {'file': file}
    data = {
        'title': 'Mon Document',
        'description': 'Description',
        'visibility': 'PRIVATE',
        'tags': 'Finance,Rapport'
    }
    response = requests.post(
        f"{BASE_URL}/api/documents/",
        headers=headers,
        files=files,
        data=data
    )
    document = response.json()
    document_id = document['id']

# 3. Attendre l'analyse (polling)
analyzed = False
max_attempts = 30

for attempt in range(max_attempts):
    response = requests.get(
        f"{BASE_URL}/api/documents/{document_id}/",
        headers=headers
    )
    doc = response.json()
    
    if doc.get('analyzed'):
        print(f"Résumé: {doc['analysis']['summary']}")
        print(f"Mots-clés: {', '.join(doc['analysis']['key_points'])}")
        analyzed = True
        break
    
    time.sleep(2)

if not analyzed:
    print("Analyse non terminée après 60 secondes")

# 4. Lister les documents
response = requests.get(
    f"{BASE_URL}/api/documents/",
    headers=headers,
    params={
        'search': 'rapport',
        'analyzed': 'true',
        'ordering': '-created_at'
    }
)
documents = response.json()
print(f"Trouvé {documents['count']} documents")
```

---

## 🌐 Exemples JavaScript/Fetch

```javascript
const BASE_URL = 'http://localhost:8001';

// 1. Se connecter
async function login(email, password) {
  const response = await fetch(`${BASE_URL}/api/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  return data.tokens.access;
}

// 2. Uploader un document
async function uploadDocument(token, file, metadata) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', metadata.title);
  formData.append('description', metadata.description);
  formData.append('visibility', metadata.visibility);
  formData.append('tags', metadata.tags);
  
  const response = await fetch(`${BASE_URL}/api/documents/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  return await response.json();
}

// 3. Récupérer un document avec analyse
async function getDocument(token, documentId) {
  const response = await fetch(
    `${BASE_URL}/api/documents/${documentId}/`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  return await response.json();
}

// Utilisation
(async () => {
  const token = await login('admin@esa-tez.com', 'admin123');
  
  // Upload
  const fileInput = document.querySelector('#file-input');
  const file = fileInput.files[0];
  
  const document = await uploadDocument(token, file, {
    title: 'Mon Document',
    description: 'Test',
    visibility: 'PRIVATE',
    tags: 'Finance,Rapport'
  });
  
  // Attendre l'analyse
  let analyzed = false;
  for (let i = 0; i < 30 && !analyzed; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const doc = await getDocument(token, document.id);
    
    if (doc.analyzed) {
      console.log('Résumé:', doc.analysis.summary);
      console.log('Mots-clés:', doc.analysis.key_points);
      analyzed = true;
    }
  }
})();
```

---

## 🔍 Cas d'Usage Complets

### Scénario 1: Upload et Analyse Automatique

```bash
# 1. Se connecter
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@esa-tez.com","password":"admin123"}' \
  | jq -r '.tokens.access')

# 2. Uploader un document (l'analyse se lance automatiquement)
DOC_ID=$(curl -s -X POST http://localhost:8001/api/documents/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@rapport.pdf" \
  -F "title=Rapport Q4 2024" \
  -F "visibility=PRIVATE" \
  | jq -r '.id')

# 3. Attendre et récupérer l'analyse
sleep 10
curl -X GET http://localhost:8001/api/documents/$DOC_ID/ \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.analysis'
```

### Scénario 2: Recherche et Filtrage

```bash
# Rechercher tous les rapports financiers analysés
curl -X GET "http://localhost:8001/api/documents/?search=finance&tags=Rapport&analyzed=true&ordering=-created_at" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.results[] | {title, analyzed, snippet}'
```

---

**📚 Pour plus d'informations, consultez README.md**
