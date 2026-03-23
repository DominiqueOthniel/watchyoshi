const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const SHIPMENTS_FILE = path.join(__dirname, 'data', 'shipments.json');

const newShipment = {
  id: uuidv4(),
  trackingId: 'CW' + Date.now().toString(36).toUpperCase().slice(-8),
  status: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sender: {
    name: "MrJacob's Cars",
    email: "mrjacobs@cars.com",
    phone: "+1503426891",
    address: {
      street: "123 Market Street",
      city: "San Francisco",
      state: "California",
      zipCode: "94102",
      country: "US",
      lat: 37.7749,
      lng: -122.4194
    }
  },
  recipient: {
    name: "Djana Campbell",
    email: "djanacampbell@me.com",
    phone: "630-863-0168",
    address: {
      street: "6004 Monta Vista Lane Apt 237",
      city: "Fort Worth",
      state: "Texas",
      zipCode: "76132",
      country: "US",
      lat: 32.7555,
      lng: -97.3308
    }
  },
  package: {
    type: "vehicle",
    weight: 3200,
    dimensions: { length: 192.9, width: 72.9, height: 57.9 },
    description: "2019 Nissan Altima SL Grey",
    value: 3400,
    currency: "USD",
    vehicle: { make: "Nissan", model: "Altima", year: 2019, trim: "SL", color: "Grey", vin: "", mileage: 0 }
  },
  service: { type: "standard", priority: "normal", insurance: true },
  events: [{
    id: uuidv4(),
    status: "pending",
    title: "Shipment Created",
    description: "Your shipment has been created and is awaiting pickup",
    location: "San Francisco",
    timestamp: new Date().toISOString(),
    completed: true,
    current: false
  }],
  cost: { base: 0, shipping: 0, insurance: 300, total: 300, currency: "USD" },
  estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  currentLocation: { lat: 37.7749, lng: -122.4194, city: "San Francisco" },
  autoProgress: { enabled: true, paused: false, pausedAt: null, pauseReason: null, pausedDuration: 0, startedAt: null, lastUpdate: null }
};

async function main() {
  const data = await fs.readFile(SHIPMENTS_FILE, 'utf8');
  const shipments = JSON.parse(data);
  shipments.push(newShipment);
  await fs.writeFile(SHIPMENTS_FILE, JSON.stringify(shipments, null, 2));
  console.log('Shipment créé:', newShipment.trackingId);
  console.log('URL suivi: http://localhost:3000/pages/public_tracking_interface.html?track=' + newShipment.trackingId);
}

main().catch(e => { console.error(e); process.exit(1); });
