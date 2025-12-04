// -----------------------------------------------------
// LEAFLET MAP SETUP
// -----------------------------------------------------
var map = L.map('map').setView([18.1978, 120.595], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var markers = [];

// -----------------------------------------------------
// COMPLETE TOWN & CITY COORDINATES OF ILOCOS NORTE
// -----------------------------------------------------
const TOWNS = {
  "laoag": [18.1978, 120.595],
  "laoag city": [18.1978, 120.595],
  "batac": [18.0553, 120.5642],
  "batac city": [18.0553, 120.5642],
  "adams": [18.4728, 120.9019],
  "bacarra": [18.2458, 120.6121],
  "badoc": [17.9261, 120.4761],
  "bangui": [18.5409, 120.7686],
  "burgos": [18.5149, 120.6133],
  "carasi": [18.1769, 120.8244],
  "currimao": [18.0090, 120.4952],
  "dingras": [18.1034, 120.6800],
  "dumalneg": [18.4800, 120.9000],
  "marcos": [18.0585, 120.6915],
  "nueva era": [17.9826, 120.7358],
  "pagudpud": [18.5616, 120.7840],
  "paoay": [18.0628, 120.5223],
  "pasuquin": [18.3311, 120.6134],
  "pinili": [17.9561, 120.4821],
  "san nicolas": [18.1675, 120.5950],
  "sarrat": [18.1606, 120.6491],
  "solsona": [18.1333, 120.7667],
  "vintar": [18.3031, 120.6503],
  "banna": [18.0667, 120.6167],
  "espiritu": [18.0667, 120.6167],
  "piddig": [18.1833, 120.7500]
};

// -----------------------------------------------------
// ACCOMMODATION DATA
// -----------------------------------------------------
const accommodations = [
  {name:"Java Hotel", town:"laoag", lat:18.203, lng:120.595, area:"City", budget:2400, rating:4.3},
  {name:"Viven Hotel", town:"laoag", lat:18.182, lng:120.593, area:"City", budget:1800, rating:4.0},
  {name:"Fort Ilocandia Resort", town:"laoag", lat:18.162, lng:120.545, area:"Beachfront", budget:3500, rating:4.5},

  {name:"Hannah’s Resort", town:"pagudpud", lat:18.614, lng:120.784, area:"Beachfront", budget:3200, rating:4.4},
  {name:"Casa Consuelo", town:"pagudpud", lat:18.581, lng:120.794, area:"Beachfront", budget:2500, rating:4.2},

  {name:"Paoay Lake Hotel", town:"paoay", lat:18.063, lng:120.522, area:"Mountain", budget:2200, rating:4.1},

  {name:"BJ Lodge", town:"batac", lat:18.058, lng:120.564, area:"City", budget:1100, rating:3.5},
];

// -----------------------------------------------------
// CLEAR MARKERS
// -----------------------------------------------------
function clearMarkers() {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
}

// -----------------------------------------------------
// SEARCH TOWN
// -----------------------------------------------------
function searchTown() {
  const input = document.getElementById('townInput').value.trim().toLowerCase();

  if (!TOWNS[input]) {
    alert("Town not found! Make sure spelling is correct.");
    return;
  }

  const coords = TOWNS[input];
  map.setView(coords, 13);

  refreshRecommendations(input);
}

// -----------------------------------------------------
// FILTER HOTELS + DISPLAY ON MAP
// -----------------------------------------------------
function refreshRecommendations(filterTown = null) {
  clearMarkers();

  const budget = parseInt(document.getElementById('budget').value);
  const area   = document.getElementById('area').value;
  const rating = parseFloat(document.getElementById('rating').value);

  const list = document.getElementById('recommendations');
  list.innerHTML = '';

  const filtered = accommodations.filter(a =>
    a.budget <= budget &&
    a.rating >= rating &&
    (area === "Any" || a.area === area) &&
    (filterTown === null || a.town === filterTown)
  );

  if (filtered.length === 0) {
    list.innerHTML = "<li>No matching accommodations.</li>";
    return;
  }

  filtered.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${a.name}</strong><br>
      Town: ${a.town.toUpperCase()}<br>
      ₱${a.budget} • ⭐ ${a.rating}<br>
      Area: ${a.area}
    `;
    list.appendChild(li);

    const popup = `
      <b>${a.name}</b><br>
      ₱${a.budget}<br>
      ⭐ Rating: ${a.rating}<br>
      Area: ${a.area}
    `;

    const marker = L.marker([a.lat, a.lng]).addTo(map).bindPopup(popup);
    markers.push(marker);
  });
}
