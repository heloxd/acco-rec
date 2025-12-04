// ---------- towns.js / data.js ----------
// Town coordinates
export const towns = {
  "adams": [18.45, 120.90],
  "bacarra": [18.25, 120.61],
  "badoc": [17.92, 120.48],
  "bangui": [18.33, 120.75],
  "batac": [18.06, 120.56],
  "burgos": [18.51, 120.65],
  "carasi": [18.18, 120.85],
  "currimao": [17.98, 120.48],
  "dingras": [18.10, 120.70],
  "dumalneg": [18.46, 120.80],
  "banna": [18.05, 120.68],
  "laoag": [18.20, 120.59],
  "marcos": [18.05, 120.70],
  "pagudpud": [18.56, 120.76],
  "paoay": [18.06, 120.53],
  "pasuquin": [18.33, 120.62],
  "piddig": [18.12, 120.70],
  "pinili": [17.95, 120.48],
  "san nicolas": [18.16, 120.59],
  "sarrat": [18.15, 120.65],
  "solsona": [18.12, 120.85],
  "vintar": [18.22, 120.70]
};

// Accommodations data
export const accommodations = [
  { name: "Java Hotel", lat: 18.20, lng: 120.59, area: "City", budget: 2400, rating: 4.2, town: "laoag" },
  { name: "Viven Hotel", lat: 18.20, lng: 120.60, area: "City", budget: 2000, rating: 4.0, town: "laoag" },
  { name: "Northview Hotel", lat: 18.21, lng: 120.60, area: "City", budget: 1800, rating: 3.9, town: "laoag" },
  { name: "Fort Ilocandia Resort", lat: 18.19, lng: 120.55, area: "Beachfront", budget: 3500, rating: 4.3, town: "laoag" },
  { name: "Isabel Suites", lat: 18.20, lng: 120.58, area: "City", budget: 1500, rating: 3.8, town: "laoag" },

  { name: "Bellagio Hills Hotel & Restaurant", lat: 18.08, lng: 120.53, area: "City", budget: 2200, rating: 4.1, town: "paoay" },
  { name: "Veranda Suites & Restaurant", lat: 18.07, lng: 120.52, area: "City", budget: 1700, rating: 3.9, town: "paoay" },

  { name: "Alta Vista Ilocandia", lat: 18.59, lng: 120.79, area: "Beachfront", budget: 2200, rating: 4.0, town: "pagudpud" },
  { name: "Blue Lagoon Inn & Restaurant", lat: 18.65, lng: 120.75, area: "Beachfront", budget: 2000, rating: 3.9, town: "pagudpud" },
  { name: "Hannah's Resort", lat: 18.60, lng: 120.80, area: "Beachfront", budget: 3200, rating: 4.4, town: "pagudpud" },

  { name: "Currimar Addison Beach Resort", lat: 17.98, lng: 120.48, area: "Beachfront", budget: 1900, rating: 3.7, town: "currimao" },

  { name: "Amerie Rae Resort", lat: 18.33, lng: 120.75, area: "Beachfront", budget: 1700, rating: 3.8, town: "bangui" },

  { name: "Sikatel Hotel", lat: 18.06, lng: 120.56, area: "City", budget: 1500, rating: 3.7, town: "batac" },
  { name: "North Stellar Hotel & Events Place", lat: 18.07, lng: 120.55, area: "City", budget: 1600, rating: 3.8, town: "batac" },

  { name: "Green Meadows Hotel & Restaurant", lat: 18.16, lng: 120.59, area: "City", budget: 1400, rating: 3.6, town: "san nicolas" },

  { name: "Cape Bojeador Lodge", lat: 18.52, lng: 120.65, area: "Mountain/Coast", budget: 1300, rating: 3.5, town: "burgos" },

  { name: "Badoc Seaside Resort", lat: 17.92, lng: 120.48, area: "Beachfront", budget: 1900, rating: 4.0, town: "badoc" },

  { name: "Pasuquin Bayview Inn", lat: 18.32, lng: 120.62, area: "Beachfront", budget: 1800, rating: 3.9, town: "pasuquin" },

  { name: "Adams Highland Lodge", lat: 18.45, lng: 120.90, area: "Mountain", budget: 1300, rating: 3.8, town: "adams" },

  { name: "Bacarra Heritage Inn", lat: 18.25, lng: 120.61, area: "City", budget: 1400, rating: 3.7, town: "bacarra" },
  { name: "Bacarra Coastline Resort", lat: 18.26, lng: 120.62, area: "Beachfront", budget: 1800, rating: 3.8, town: "bacarra" },

  { name: "Carasi Riverside Guesthouse", lat: 18.18, lng: 120.85, area: "Mountain", budget: 1200, rating: 3.5, town: "carasi" },

  { name: "Dingras Traveler’s Rest", lat: 18.10, lng: 120.70, area: "City", budget: 1500, rating: 3.9, town: "dingras" },
  { name: "Dingras Budget Inn", lat: 18.11, lng: 120.69, area: "City", budget: 1100, rating: 3.4, town: "dingras" },

  { name: "Dumalneg Hillside Lodge", lat: 18.46, lng: 120.80, area: "Mountain", budget: 1100, rating: 3.6, town: "dumalneg" },

  { name: "Banna Valley Resort", lat: 18.05, lng: 120.68, area: "Mountain", budget: 1250, rating: 3.7, town: "banna" },

  { name: "Marcos Town Hotel", lat: 18.05, lng: 120.70, area: "City", budget: 1450, rating: 3.8, town: "marcos" },

  { name: "Piddig Hillside Inn", lat: 18.12, lng: 120.70, area: "Mountain", budget: 1350, rating: 3.6, town: "piddig" },

  { name: "Sarrat Heritage Guesthouse", lat: 18.15, lng: 120.65, area: "City", budget: 1500, rating: 3.9, town: "sarrat" },

  { name: "Vintar Riverside Lodge", lat: 18.22, lng: 120.70, area: "City", budget: 1400, rating: 3.7, town: "vintar" },
  { name: "Vintar Hills Lodge", lat: 18.23, lng: 120.71, area: "Mountain", budget: 1200, rating: 3.5, town: "vintar" }
];
