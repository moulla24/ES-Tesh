# 🧪 Guide de Test de l'API ESA-TEZ

Ce document guide à travers les tests de tous les endpoints de l'API.

## 🚀 Prérequis

1. Le serveur backend doit être lancé :
```bash
cd backend
python manage.py runserver 0.0.0.0:8001
```

2. Un utilisateur admin doit être créé :
```bash
python create_admin.py
```

## 📋 Tests Complets

### 1. Test d'Authentification

#### a) Login avec Admin
```bash
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@esa-tez.com",
    "password": "admin123"
  }'
```

**Réponse attendue:**
- Status: 200 OK
- Contient: user object, tokens (access & refresh), message

#### b) Créer un nouvel utilisateur
```bash
curl -X POST http://localhost:8001/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "password": "TestPassword123",
    "password_confirm": "TestPassword123"
  }'
```

**Réponse attendue:**
- Status: 201 Created
- Contient: user object, tokens, message

#### c) Obtenir les infos utilisateur
```bash
# Récupérez d'abord le token
TOKEN=$(curl -s -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@esa-tez.com","password":"admin123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['tokens']['access'])")

# Utilisez le token
curl -X GET http://localhost:8001/api/auth/me/ \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue:**
- Status: 200 OK
- Contient: user object complet

### 2. Test de Gestion des Documents

#### a) Créer un document de test
```bash
# Créer un PDF de test
python3 << EOF
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("/tmp/test_doc.pdf", pagesize=letter)
c.drawString(100, 750, "Test Document ESA-TEZ")
c.drawString(100, 730, "This is a comprehensive test document.")
c.save()
print("PDF créé : /tmp/test_doc.pdf")
EOF
```

#### b) Uploader un document
```bash
curl -X POST http://localhost:8001/api/documents/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test_doc.pdf" \
  -F "title=Rapport Financier Q4" \
  -F "description=Rapport financier du quatrième trimestre" \
  -F "visibility=PRIVATE" \
  -F "tags=Finance,Q4,2024"
```

**Réponse attendue:**
- Status: 201 Created
- Contient: document object complet avec tags
- analyzed: false (sera analysé en arrière-plan)

#### c) Lister tous les documents
```bash
curl -X GET http://localhost:8001/api/documents/ \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue:**
- Status: 200 OK
- Contient: count, next, previous, results[]

#### d) Rechercher des documents
```bash
# Par mot-clé
curl -X GET "http://localhost:8001/api/documents/?search=Financier" \
  -H "Authorization: Bearer $TOKEN"

# Par tag
curl -X GET "http://localhost:8001/api/documents/?tags=Finance" \
  -H "Authorization: Bearer $TOKEN"

# Par visibilité
curl -X GET "http://localhost:8001/api/documents/?visibility=PRIVATE" \
  -H "Authorization: Bearer $TOKEN"

# Combiné
curl -X GET "http://localhost:8001/api/documents/?search=rapport&tags=Finance&analyzed=false" \
  -H "Authorization: Bearer $TOKEN"
```

#### e) Obtenir les détails d'un document
```bash
# Récupérer l'ID du premier document
DOC_ID=$(curl -s -X GET http://localhost:8001/api/documents/ \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import sys, json; d=json.load(sys.stdin); print(d['results'][0]['id'])")

# Obtenir les détails
curl -X GET http://localhost:8001/api/documents/$DOC_ID/ \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue:**
- Status: 200 OK
- Contient: document object complet
- Si analysé: inclut analysis object avec summary et key_points

#### f) Modifier un document
```bash
curl -X PATCH http://localhost:8001/api/documents/$DOC_ID/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Rapport Financier Q4 2024 - Mis à jour",
    "visibility": "PUBLIC",
    "tags": ["Finance", "Q4", "2024", "Public"]
  }'
```

**Réponse attendue:**
- Status: 200 OK
- Contient: document object avec modifications appliquées

#### g) Lancer l'analyse manuelle
```bash
curl -X POST http://localhost:8001/api/documents/$DOC_ID/analyze/ \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue:**
- Status: 200 OK
- message: "Analyse lancée"

#### h) Supprimer un document
```bash
curl -X DELETE http://localhost:8001/api/documents/$DOC_ID/ \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue:**
- Status: 204 No Content

### 3. Test des Tags

#### a) Lister tous les tags
```bash
curl -X GET http://localhost:8001/api/documents/tags/ \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue:**
- Status: 200 OK
- Contient: count, results[] avec tous les tags

### 4. Test des Statistiques (Admin)

```bash
curl -X GET http://localhost:8001/api/documents/stats/ \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue:**
- Status: 200 OK
- Contient: total_documents, analyzed_documents, analyzed_percentage

### 5. Test de Gestion des Utilisateurs (Admin)

#### a) Lister les utilisateurs
```bash
curl -X GET http://localhost:8001/api/auth/users/ \
  -H "Authorization: Bearer $TOKEN"
```

**Réponse attendue:**
- Status: 200 OK
- Contient: count, results[] avec tous les utilisateurs

#### b) Rechercher des utilisateurs
```bash
curl -X GET "http://localhost:8001/api/auth/users/?search=test&role=USER" \
  -H "Authorization: Bearer $TOKEN"
```

#### c) Modifier un utilisateur
```bash
# Récupérer l'ID d'un utilisateur
USER_ID=$(curl -s -X GET http://localhost:8001/api/auth/users/ \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import sys, json; d=json.load(sys.stdin); print([u['id'] for u in d['results'] if u['username']=='testuser'][0])")

# Modifier l'utilisateur
curl -X PATCH http://localhost:8001/api/auth/users/$USER_ID/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test Updated",
    "is_active": true
  }'
```

## 🔍 Tests de Permissions

### Test 1: Utilisateur non-admin ne peut pas voir les documents d'autres utilisateurs (PRIVATE)

1. Créer un utilisateur normal
2. Se connecter avec cet utilisateur
3. Essayer de lister les documents
4. Vérifier que seuls ses propres documents sont visibles

### Test 2: Documents PUBLIC sont visibles par tous

1. Créer un document avec visibility=PUBLIC
2. Se connecter avec un utilisateur différent
3. Vérifier que le document est visible

### Test 3: Utilisateur ne peut pas modifier les documents d'autres utilisateurs

1. Obtenir l'ID d'un document d'un autre utilisateur
2. Essayer de modifier ce document
3. Vérifier le retour d'erreur 403 ou 404

## 🧪 Script de Test Automatique

Créez un fichier `test_api.sh`:

```bash
#!/bin/bash

echo "🧪 Tests de l'API ESA-TEZ"
echo "========================="

# Configuration
BASE_URL="http://localhost:8001"
PASSED=0
FAILED=0

# Fonction de test
test_endpoint() {
    local name=$1
    local command=$2
    local expected_status=$3
    
    echo -n "Test: $name... "
    response=$(eval "$command")
    status=$?
    
    if [ $status -eq 0 ]; then
        echo "✓ PASSED"
        ((PASSED++))
    else
        echo "✗ FAILED"
        ((FAILED++))
    fi
}

# Tests
echo ""
echo "1. Tests d'authentification"
echo "----------------------------"

test_endpoint "Login admin" \
    "curl -s -X POST $BASE_URL/api/auth/login/ -H 'Content-Type: application/json' -d '{\"email\":\"admin@esa-tez.com\",\"password\":\"admin123\"}'" \
    200

# Obtenir le token
TOKEN=$(curl -s -X POST $BASE_URL/api/auth/login/ \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@esa-tez.com","password":"admin123"}' \
    | python3 -c "import sys, json; print(json.load(sys.stdin)['tokens']['access'])")

test_endpoint "Get user info" \
    "curl -s -X GET $BASE_URL/api/auth/me/ -H 'Authorization: Bearer $TOKEN'" \
    200

echo ""
echo "2. Tests des documents"
echo "----------------------"

test_endpoint "List documents" \
    "curl -s -X GET $BASE_URL/api/documents/ -H 'Authorization: Bearer $TOKEN'" \
    200

test_endpoint "Get tags" \
    "curl -s -X GET $BASE_URL/api/documents/tags/ -H 'Authorization: Bearer $TOKEN'" \
    200

test_endpoint "Get stats" \
    "curl -s -X GET $BASE_URL/api/documents/stats/ -H 'Authorization: Bearer $TOKEN'" \
    200

echo ""
echo "3. Tests utilisateurs"
echo "---------------------"

test_endpoint "List users" \
    "curl -s -X GET $BASE_URL/api/auth/users/ -H 'Authorization: Bearer $TOKEN'" \
    200

echo ""
echo "========================="
echo "Résultats: $PASSED passés, $FAILED échecs"
echo "========================="
```

Rendez-le exécutable et lancez-le:
```bash
chmod +x test_api.sh
./test_api.sh
```

## 📊 Résultats Attendus

Tous les tests doivent passer avec succès. Si un test échoue:

1. Vérifiez que le serveur est bien lancé
2. Vérifiez que l'utilisateur admin existe
3. Vérifiez les logs du serveur pour plus de détails
4. Vérifiez que les permissions sont correctes

## 🐛 Débogage

### Activer les logs détaillés

Ajoutez à `settings.py`:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

### Vérifier les erreurs

```bash
# Logs du serveur Django
tail -f /path/to/django/server.log

# Ou regarder directement la console où le serveur tourne
```

## ✅ Checklist de Validation

- [ ] Tous les endpoints d'authentification fonctionnent
- [ ] Upload de documents fonctionne
- [ ] Liste et recherche de documents fonctionnent
- [ ] Filtres (tags, visibility, search) fonctionnent
- [ ] Mise à jour de documents fonctionne
- [ ] Suppression de documents fonctionne
- [ ] Permissions PRIVATE/PUBLIC fonctionnent correctement
- [ ] Tags sont créés automatiquement
- [ ] Stats sont accessibles (admin seulement)
- [ ] Gestion des utilisateurs fonctionne (admin seulement)

## 📝 Notes

- L'analyse IA nécessite Ollama en fonctionnement
- Les documents sont automatiquement analysés après upload
- L'analyse peut prendre quelques secondes selon la taille du document
- Les tags sont créés automatiquement lors de l'upload
