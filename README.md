# CargoWatch

**Système professionnel de suivi d'expéditions en temps réel.**

CargoWatch est une application web monolithique (Node.js/Express) permettant de créer, suivre et gérer des expéditions avec carte interactive, génération de reçus PDF multilingues, avis clients et chat support.

---

## Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Documentation API (Swagger)](#-documentation-api-swagger)
- [Scripts utilitaires](#-scripts-utilitaires)
- [Déploiement sur Render](#-déploiement-sur-render)
- [Dépannage](#-dépannage)

---

## Fonctionnalités

- **Suivi d'expéditions** : suivi en temps réel par Tracking ID avec carte Leaflet et routage OSRM
- **Création de shipments** : formulaire admin pour créer des expéditions (expéditeur, destinataire, colis)
- **Authentification admin** : session sécurisée avec bcrypt
- **Reçus PDF** : génération multilingue (EN/FR)
- **Avis clients** : système CRUD d'évaluations et commentaires
- **Chat support** : support en direct via Socket.io
- **Documentation API** : Swagger/OpenAPI interactif

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Backend | Node.js, Express |
| Base de données | MongoDB Atlas ou JSON (fallback) |
| Frontend | HTML, CSS, Tailwind, JavaScript |
| Carte | Leaflet + OSRM |
| Temps réel | Socket.io |
| API | REST, Swagger UI |

---

## Structure du projet

```
cargowatchAC/
├── server.js              # Serveur Express principal
├── db.js                  # Connexion MongoDB + logique de stockage
├── swagger.json           # Spécification OpenAPI
├── package.json
├── render.yaml            # Config Render pour déploiement
├── .env.example           # Variables d'environnement (modèle)
├── data/                  # Fichiers JSON (si pas MongoDB)
│   ├── shipments.json
│   ├── users.json
│   ├── chats.json
│   └── reviews.json
├── pages/                 # Pages HTML
│   ├── homepage.html
│   ├── admin_dashboard.html
│   ├── admin_login.html
│   ├── public_tracking_interface.html
│   ├── shipment_creation_portal.html
│   └── support_hub.html
├── public/                # Assets statiques
├── css/                   # Styles Tailwind
└── create-shipment-*.js   # Scripts de création de shipments
```

---

## Installation

### Prérequis

- **Node.js** 18+
- **npm** ou **yarn**
- **MongoDB Atlas** (recommandé pour la production) ou fichiers JSON

### Étapes

```bash
# Cloner le dépôt
git clone https://github.com/DominiqueOthniel/cargoowatch.git
cd cargoowatch

# Installer les dépendances
npm install

# Compiler le CSS Tailwind
npm run build:css
```

---

## Configuration

Créez un fichier `.env` à la racine (copiez `.env.example`) :

```env
# MongoDB (obligatoire en production)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cargowatchAc?retryWrites=true&w=majority
MONGODB_DB_NAME=cargowatchAc

# Session (obligatoire)
SESSION_SECRET=votre-secret-fort-change-in-production

# Serveur
PORT=3000
NODE_ENV=development
```

**Sans `MONGODB_URI`** : l'application utilise les fichiers JSON dans `data/`.

**Générer un SESSION_SECRET** :
```bash
openssl rand -base64 32
```

---

## Démarrage

```bash
npm start
```

L'application est accessible sur `http://localhost:3000` (ou le PORT configuré).

### URLs principales

| URL | Description |
|-----|-------------|
| `/` | Page d'accueil / tracking public |
| `/pages/admin_dashboard.html` | Dashboard admin |
| `/pages/admin_login.html` | Connexion admin |
| `/pages/shipment_creation_portal.html` | Création de shipments |
| `/pages/support_hub.html` | Support chat |
| `/api-docs` | Documentation Swagger |

---

## Documentation API (Swagger)

Accédez à la documentation interactive : **`/api-docs`**

- Local : `http://localhost:3000/api-docs`
- Production : `https://votre-app.onrender.com/api-docs`

---

## Scripts utilitaires

### Créer un shipment via script

Pour créer des shipments depuis la ligne de commande (utile après déploiement) :

```bash
# San Francisco → Texas
RENDER_URL=https://votre-app.onrender.com node create-shipment-sanfrancisco-texas.js

# Oklahoma → Texas
RENDER_URL=https://votre-app.onrender.com node create-shipment-oklahoma-texas.js

# Avec date de livraison personnalisée (ISO 8601 ou YYYY-MM-DD)
RENDER_URL=https://votre-app.onrender.com node create-shipment-sanfrancisco-texas.js "2024-12-15T13:00:00Z"
```

### Autres scripts

- `add-shipment.js` – Ajout manuel de shipment
- `clear-reviews.js` – Vider les avis
- `set-shipment-in-transit.js` – Mettre un shipment en transit

---

## Déploiement sur Render

### Architecture

Un seul service Web Node.js sert le frontend et le backend. MongoDB Atlas stocke les données.

### 1. Préparer le dépôt

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin master
```

### 2. Créer le Web Service sur Render

1. [render.com](https://render.com) → **New +** → **Web Service**
2. Connecter le dépôt GitHub : `DominiqueOthniel/cargoowatch`
3. Configuration :

| Paramètre | Valeur |
|-----------|--------|
| **Name** | `cargowatch` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build:css` |
| **Start Command** | `npm start` |
| **Plan** | Free |
| **Health Check Path** | `/api` |

### 3. Variables d'environnement (obligatoire)

| Variable | Valeur |
|----------|--------|
| `NODE_ENV` | `production` |
| `SESSION_SECRET` | Chaîne aléatoire (ex: `openssl rand -base64 32`) |
| `MONGODB_URI` | URI MongoDB Atlas (ex: `mongodb+srv://user:pass@cluster.mongodb.net/cargowatchAc`) |
| `MONGODB_DB_NAME` | `cargowatchAc` (optionnel) |

⚠️ **MongoDB Atlas** : dans Network Access, ajoutez `0.0.0.0/0` pour autoriser Render.

### 4. Déploiement

Cliquez sur **Create Web Service**. Chaque `git push` déclenche un redéploiement automatique.

### Limitations du plan gratuit

- **Sleep après 15 min d'inactivité** : première requête lente (30–60 s)
- **Conseil** : utilisez [UptimeRobot](https://uptimerobot.com) pour ping l’app toutes les 5 min et éviter le sleep

---

## Dépannage

### Le build échoue

- Vérifiez les logs Render
- Testez localement : `npm install && npm run build:css`

### L'application ne démarre pas

- Vérifiez les variables d'environnement (`MONGODB_URI`, `SESSION_SECRET`)
- Testez : `npm start` en local

### Les données disparaissent

- Utilisez **MongoDB Atlas**. Les données JSON ne persistent pas entre redéploiements.

### Erreur ECONNREFUSED sur les scripts

- Vérifiez l’URL Render
- Attendez que l’app soit active (réveillée après sleep)

---

## Licence

MIT

---

## Auteur

**POUGOM TCHATCHOUA DOMINIQUE OTHNIEL**  
Rousseau High Institute of Technology — Computer Engineering and Electronics — Year 3
