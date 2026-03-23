/**
 * Ajoute 20 expéditions de test avec destinations toutes différentes (US, FR, IT, ES).
 * Usage : node seed-test-destinations.js
 *   --force   réinsérer même si les IDs CWTESTDEST01–20 existent déjà (supprime les anciennes du même ID)
 *
 * Nécessite : npm install (uuid, fs)
 */

const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const SHIPMENTS_FILE = path.join(__dirname, 'data', 'shipments.json');
const PREFIX = 'CWTESTDEST';

/** Destinations distinctes : (label, pays, ville, état/région, CP, lat, lng) */
const DESTINATIONS = [
  { label: 'Miami FL', country: 'US', city: 'Miami', state: 'Florida', zip: '33101', lat: 25.7617, lng: -80.1918 },
  { label: 'New York NY', country: 'US', city: 'New York', state: 'New York', zip: '10001', lat: 40.7128, lng: -74.006 },
  { label: 'Los Angeles CA', country: 'US', city: 'Los Angeles', state: 'California', zip: '90001', lat: 34.0522, lng: -118.2437 },
  { label: 'Chicago IL', country: 'US', city: 'Chicago', state: 'Illinois', zip: '60601', lat: 41.8781, lng: -87.6298 },
  { label: 'Seattle WA', country: 'US', city: 'Seattle', state: 'Washington', zip: '98101', lat: 47.6062, lng: -122.3321 },
  { label: 'Paris', country: 'FR', city: 'Paris', state: '', zip: '75001', lat: 48.8566, lng: 2.3522 },
  { label: 'Lyon', country: 'FR', city: 'Lyon', state: '', zip: '69001', lat: 45.764, lng: 4.8357 },
  { label: 'Marseille', country: 'FR', city: 'Marseille', state: '', zip: '13001', lat: 43.2965, lng: 5.3698 },
  { label: 'Bordeaux', country: 'FR', city: 'Bordeaux', state: '', zip: '33000', lat: 44.8378, lng: -0.5792 },
  { label: 'Rome', country: 'IT', city: 'Rome', state: '', zip: '00100', lat: 41.9028, lng: 12.4964 },
  { label: 'Milan', country: 'IT', city: 'Milan', state: '', zip: '20121', lat: 45.4642, lng: 9.19 },
  { label: 'Naples', country: 'IT', city: 'Naples', state: '', zip: '80100', lat: 40.8518, lng: 14.2681 },
  { label: 'Venice', country: 'IT', city: 'Venice', state: '', zip: '30100', lat: 45.4408, lng: 12.3155 },
  { label: 'Turin', country: 'IT', city: 'Turin', state: '', zip: '10100', lat: 45.0703, lng: 7.6869 },
  { label: 'Madrid', country: 'ES', city: 'Madrid', state: '', zip: '28001', lat: 40.4168, lng: -3.7038 },
  { label: 'Barcelona', country: 'ES', city: 'Barcelona', state: '', zip: '08001', lat: 41.3851, lng: 2.1734 },
  { label: 'Valencia ES', country: 'ES', city: 'Valencia', state: '', zip: '46001', lat: 39.4699, lng: -0.3763 },
  { label: 'Bilbao', country: 'ES', city: 'Bilbao', state: '', zip: '48001', lat: 43.263, lng: -2.935 },
  { label: 'Seville', country: 'ES', city: 'Seville', state: '', zip: '41001', lat: 37.3891, lng: -5.9845 },
  { label: 'Palma', country: 'ES', city: 'Palma', state: '', zip: '07001', lat: 39.5696, lng: 2.6502 }
];

/** Origines variées (expéditeur) pour routes différentes sur la carte */
const ORIGINS = [
  { name: 'Hub Test Atlanta', city: 'Atlanta', state: 'Georgia', zip: '30301', country: 'US', lat: 33.749, lng: -84.388 },
  { name: 'Hub Test Boston', city: 'Boston', state: 'Massachusetts', zip: '02101', country: 'US', lat: 42.3601, lng: -71.0589 },
  { name: 'Entrepôt Lyon', city: 'Lyon', state: '', zip: '69002', country: 'FR', lat: 45.764, lng: 4.8357 },
  { name: 'Deposito Roma', city: 'Rome', state: '', zip: '00118', country: 'IT', lat: 41.9028, lng: 12.4964 },
  { name: 'Almacén Madrid', city: 'Madrid', state: '', zip: '28013', country: 'ES', lat: 40.4168, lng: -3.7038 },
  { name: 'Cargo Rotterdam', city: 'Rotterdam', state: '', zip: '3011', country: 'NL', lat: 51.9244, lng: 4.4777 },
  { name: 'Hub Frankfurt', city: 'Frankfurt', state: '', zip: '60311', country: 'DE', lat: 50.1109, lng: 8.6821 },
  { name: 'Terminal CDG', city: 'Roissy-en-France', state: '', zip: '95700', country: 'FR', lat: 49.0097, lng: 2.5479 }
];

function trackingIdForIndex(i) {
  return `${PREFIX}${String(i + 1).padStart(2, '0')}`;
}

function buildShipment(index, dest, origin) {
  const tid = trackingIdForIndex(index);
  const now = new Date().toISOString();
  const street = `${100 + index} Test Avenue`;

  return {
    id: uuidv4(),
    trackingId: tid,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    sender: {
      name: origin.name,
      email: `test.sender.${index + 1}@cargowatch.test`,
      phone: '+10000000000',
      address: {
        street: `${index + 1} Origin Street`,
        city: origin.city,
        state: origin.state || '',
        zipCode: origin.zip,
        country: origin.country,
        lat: origin.lat,
        lng: origin.lng
      }
    },
    recipient: {
      name: `Destinataire Test ${index + 1}`,
      email: `test.recipient.${index + 1}@cargowatch.test`,
      phone: '+19999999999',
      address: {
        street,
        city: dest.city,
        state: dest.state || '',
        zipCode: dest.zip,
        country: dest.country,
        lat: dest.lat,
        lng: dest.lng
      }
    },
    package: {
      type: 'small-box',
      weight: 5 + index * 0.5,
      dimensions: { length: 40, width: 30, height: 25 },
      description: `Jeu de test #${index + 1} — destination: ${dest.label}`,
      value: 100 + index * 10,
      currency: dest.country === 'US' ? 'USD' : 'EUR',
      vehicle: {}
    },
    service: { type: 'standard', priority: 'normal', insurance: false },
    events: [
      {
        id: uuidv4(),
        status: 'pending',
        title: 'Shipment Created',
        description: 'Your shipment has been created and is awaiting pickup',
        location: origin.city,
        timestamp: now,
        completed: true,
        current: false
      }
    ],
    cost: {
      base: 25,
      shipping: 15 + index,
      insurance: 0,
      total: 40 + index,
      currency: dest.country === 'US' ? 'USD' : 'EUR'
    },
    estimatedDelivery: new Date(Date.now() + (5 + index) * 24 * 60 * 60 * 1000).toISOString(),
    currentLocation: {
      lat: origin.lat,
      lng: origin.lng,
      city: origin.city
    },
    autoProgress: {
      enabled: true,
      paused: false,
      pausedAt: null,
      pauseReason: null,
      pausedDuration: 0,
      startedAt: null,
      lastUpdate: null
    }
  };
}

async function main() {
  const force = process.argv.includes('--force');
  const raw = await fs.readFile(SHIPMENTS_FILE, 'utf8');
  let shipments = JSON.parse(raw);

  const testIds = new Set(DESTINATIONS.map((_, i) => trackingIdForIndex(i)));

  if (!force) {
    const existing = shipments.filter((s) => testIds.has(s.trackingId));
    if (existing.length > 0) {
      console.error(
        `❌ ${existing.length} expédition(s) de test existent déjà (${[...testIds].join(', ')}). Lancez avec --force pour les remplacer, ou supprimez-les dans l'admin.`
      );
      process.exit(1);
    }
  } else {
    shipments = shipments.filter((s) => !testIds.has(s.trackingId));
  }

  const summary = [];
  for (let i = 0; i < DESTINATIONS.length; i++) {
    const origin = ORIGINS[i % ORIGINS.length];
    const shipment = buildShipment(i, DESTINATIONS[i], origin);
    shipments.push(shipment);
    summary.push({
      trackingId: shipment.trackingId,
      destination: DESTINATIONS[i].label,
      country: DESTINATIONS[i].country,
      city: DESTINATIONS[i].city,
      originHub: origin.city
    });
  }

  await fs.writeFile(SHIPMENTS_FILE, JSON.stringify(shipments, null, 2));

  const summaryPath = path.join(__dirname, 'data', 'test-destinations-summary.json');
  await fs.writeFile(summaryPath, JSON.stringify({ createdAt: new Date().toISOString(), cases: summary }, null, 2));

  console.log('✅ 20 expéditions de test ajoutées (destinations différentes).\n');
  console.log('IDs de suivi :');
  summary.forEach((row) => {
    console.log(`  ${row.trackingId}  →  ${row.city} (${row.country})  [depuis ${row.originHub}]`);
  });
  console.log(`\nRécap écrit : ${summaryPath}`);
  console.log('\nExemple URL : http://localhost:3000/pages/public_tracking_interface.html?track=CWTESTDEST01');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
