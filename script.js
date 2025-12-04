// Initialize map
var map = L.map('map').setView([17.57, 120.39], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

var markers = [];

// Towns in Ilocos Norte
const towns = {
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

// Autocomplete function for town input
function showSuggestions() {
  const input = document.getElementById("townInput").value.toLowerCase();
  const box = document.getElementById("suggestions");
  if (!input) {
    box.style.display = "none";
    return;
  }
  const suggestions = Object.keys(towns).filter(t => t.startsWith(input));
  if (suggestions.length === 0) {
    box.style.display = "none";
    return;
  }
  box.innerHTML = "";
  box.style.display = "block";
  suggestions.forEach(town => {
    const div = document.createElement("div");
    div.textContent = town.charAt(0).toUpperCase() + town.slice(1);
    div.onclick = () => {
      document.getElementById("townInput").value = town;
      box.style.display = "none";
    };
    box.appendChild(div);
  });
}

// Expanded sample dataset — hotels/inns/resorts in various towns of Ilocos Norte
const accommodations = [
  // Laoag City & nearby
  { name: "Java Hotel", lat: 18.20, lng: 120.59, area: "City", budget: 2400, rating: 4.2, town: "laoag" },
  { name: "Viven Hotel", lat: 18.20, lng: 120.60, area: "City", budget: 2000, rating: 4.0, town: "laoag" },
  { name: "Isabel Suites", lat: 18.20, lng: 120.58, area: "City", budget: 1500, rating: 3.9, town: "laoag" },
  { name: "Northview Hotel", lat: 18.21, lng: 120.60, area: "City", budget: 1800, rating: 3.8, town: "laoag" },
  { name: "Balay de Blas Pension House", lat: 18.20, lng: 120.59, area: "City", budget: 1200, rating: 3.5, town: "laoag" },

  // Paoay
  { name: "Bellagio Hills Hotel & Restaurant", lat: 18.08, lng: 120.53, area: "City", budget: 2200, rating: 4.1, town: "paoay" },
  { name: "Veranda Suites & Restaurant", lat: 18.07, lng: 120.53, area: "City", budget: 1700, rating: 3.9, town: "paoay" },

  // Pagudpud & coastlines
  { name: "Alta Vista Ilocandia", lat: 18.59, lng: 120.79, area: "Beachfront", budget: 2200, rating: 4.0, town: "pagudpud" },
  { name: "Blue Lagoon Inn & Restaurant", lat: 18.65, lng: 120.75, area: "Beachfront", budget: 2000, rating: 3.9, town: "pagudpud" },
  { name: "Nest Resort Pagudpud", lat: 18.55, lng: 120.76, area: "Beachfront", budget: 2100, rating: 3.8, town: "pagudpud" },

  // Currimao / Badoc / coast
  { name: "Currimar Addison Beach Resort", lat: 18.00, lng: 120.48, area: "Beachfront", budget: 1900, rating: 3.7, town: "currimao" },
  { name: "D’Corals Beach Resort & Restaurant", lat: 17.99, lng: 120.47, area: "Beachfront", budget: 1800, rating: 3.6, town: "currimao" },
  { name: "Rubio’s Farm & Resthouse", lat: 17.92, lng: 120.48, area: "Beachfront", budget: 1600, rating: 3.5, town: "badoc" },

  // Bangui
  { name: "Amerie Rae Resort", lat: 18.33, lng: 120.75, area: "Beachfront", budget: 1700, rating: 3.8, town: "bangui" },

  // Batac
  { name: "Sikatel Hotel", lat: 18.06, lng: 120.56, area: "City", budget: 1500, rating: 3.7, town: "batac" },
  { name: "North Stellar Hotel & Events Place", lat: 18.07, lng: 120.55, area: "City", budget: 1600, rating: 3.8, town: "batac" },

  // San Nicolas
  { name: "Green Meadows Hotel & Restaurant", lat: 18.16, lng: 120.59, area: "City", budget: 1400, rating: 3.6, town: "san nicolas" },

  // Burgos (lighthouse / coast)
  { name: "Cape Bojeador Lodge", lat: 18.52, lng: 120.65, area: "Mountain", budget: 1300, rating: 3.5, town: "burgos" }
];

function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

function centerMap() {
  let town = document.getElementById("townInput").value.toLowerCase().trim();
  town = town.replace(/\s+(city|town)$/i, "");
  if (towns[town]) {
    map.setView(towns[town], 12);
  } else {
    alert("Town not found.");
  }
}

function refreshRecommendations() {
  clearMarkers();

  const budget = parseInt(document.getElementById("budget").value);
  const area = document.getElementById("area").value;
  const rating = parseFloat(document.getElementById("rating").value);

  let town = document.getElementById("townInput").value.toLowerCase().trim();
  town = town.replace(/\s+(city|town)$/i, "");

  const list = document.getElementById("recommendations");
  list.innerHTML = "";

  const filtered = accommodations.filter(a =>
    a.town === town &&
    a.budget <= budget &&
    a.rating >= rating &&
    (area === "Any" || a.area === area)
  );

  if (filtered.length === 0) {
    list.innerHTML = "<li>No accommodations found in this town.</li>";
    return;
  }

  if (towns[town]) {
    map.setView(towns[town], 12);
  }

  filtered.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${a.name} — ₱${a.budget} — ⭐ ${a.rating}`;
    list.appendChild(li);

    const marker = L.marker([a.lat, a.lng])
      .addTo(map)
      .bindPopup(`<b>${a.name}</b><br>₱${a.budget}<br>Rating: ${a.rating}`);
    markers.push(marker);
  });
}
