# 20 cas de test — destinations différentes

> **Mode fichier JSON** : ce script met à jour `data/shipments.json`. Si le serveur tourne avec **`USE_SUPABASE=true`**, les données lues viennent de Supabase : il faudra alors importer ces envois via l’API ou un outil SQL, ou désactiver temporairement Supabase pour tester en local.

## Ajout des données

Depuis le dossier `Tracking` :

```powershell
node seed-test-destinations.js
```

- Crée **20 expéditions** avec les IDs **`CWTESTDEST01`** … **`CWTESTDEST20`**.
- Destinations : **5 États-Unis**, **4 France**, **5 Italie**, **6 Espagne** (toutes distinctes).
- Expéditeurs variés (hubs US / FR / IT / ES / NL / DE) pour des trajets différents sur la carte.
- Fichier récap : `data/test-destinations-summary.json`.

### Si les IDs existent déjà

```powershell
node seed-test-destinations.js --force
```

Remplace les 20 entrées de test (même préfixe) sans toucher aux autres expéditions.

## Suivi dans l’interface

Exemple :

`http://localhost:3000/pages/public_tracking_interface.html?track=CWTESTDEST01`

Remplace `01` par `02` … `20` selon le cas.

## Liste des destinations

| ID           | Destination   |
|-------------|---------------|
| CWTESTDEST01 | Miami, US     |
| CWTESTDEST02 | New York, US  |
| CWTESTDEST03 | Los Angeles, US |
| CWTESTDEST04 | Chicago, US   |
| CWTESTDEST05 | Seattle, US   |
| CWTESTDEST06 | Paris, FR     |
| CWTESTDEST07 | Lyon, FR      |
| CWTESTDEST08 | Marseille, FR |
| CWTESTDEST09 | Bordeaux, FR  |
| CWTESTDEST10 | Rome, IT      |
| CWTESTDEST11 | Milan, IT     |
| CWTESTDEST12 | Naples, IT    |
| CWTESTDEST13 | Venice, IT    |
| CWTESTDEST14 | Turin, IT     |
| CWTESTDEST15 | Madrid, ES    |
| CWTESTDEST16 | Barcelona, ES |
| CWTESTDEST17 | Valencia, ES  |
| CWTESTDEST18 | Bilbao, ES    |
| CWTESTDEST19 | Seville, ES   |
| CWTESTDEST20 | Palma, ES     |
