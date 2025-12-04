// -------- MUNICIPALITIES --------
const municipalities = [
  "Adams","Bacarra","Badoc","Bangui","Banna","Burgos","Carasi","Currimao",
  "Dingras","Dumalneg","Laoag City","Batac City","Marcos","Nueva Era",
  "Pagudpud","Paoay","Pasuquin","Piddig","Pinili","San Nicolas",
  "Sarrat","Solsona","Vintar"
];

// Populate dropdown
const locSel = document.getElementById("location");
municipalities.forEach(m => {
  const opt = document.createElement("option");
  opt.value = m;
  opt.textContent = m;
  locSel.appendChild(opt);
});

// -------- KNOWLEDGE BASE --------
const kb = [
  {
    name: "Pagudpud Blue Lagoon Resort",
    municipality: "Pagudpud",
    price: "mid",
    amenities: ["wifi", "beachfront", "parking"],
    coords: [18.566, 120.787],
    notes: "Beachfront resort ideal for leisure/adventure trips."
  },
  {
    name: "Paoay Heritage Inn",
    municipality: "Paoay",
    price: "low",
    amenities: ["wifi", "parking"],
    coords: [18.063, 120.522],
    notes: "Close to Paoay Church; peaceful and cultural."
  },
  {
    name: "Laoag Luxury Suites",
    municipality: "Laoag City",
    price: "high",
    amenities: ["wifi", "pool", "parking"],
    coords: [18.197, 120.593],
    notes: "Premium hotel in central Laoag."
  }
];

// -------- CUSTOM ICONS --------
const resortIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [40, 40]
});

// -------- MAP THEMES --------
const tileLayers = {
  osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
  dark: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"),
  terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png")
};

// -------- INIT MAP --------
const map = L.map("map", {
  center: [18.197, 120.593],
  zoom: 9,
  layers: [tileLayers.osm]
});

// Apply theme
document.getElementById("mapTheme").addEventListener("change", e => {
  const theme = e.target.value;
  tileLayers.osm.remove();
  tileLayers.dark.remove();
  tileLayers.terrain.remove();
  map.addLayer(tileLayers[theme]);
});

// Marker cluster group
let clusterGroup = L.markerClusterGroup();
map.addLayer(clusterGroup);

// -------- RULE ENGINE --------
function getRecommendations(pref) {
  return kb
    .map(acc => {
      let score = 0;
      const reasons = [];

      if (pref.municipality && acc.municipality === pref.municipality) {
        score += 30;
        reasons.push("municipality");
      }
      if (pref.budget && acc.price === pref.budget) {
        score += 25;
        reasons.push("budget");
      }
      const amenMatch = pref.amenities.filter(a => acc.amenities.includes(a)).length;
      if (amenMatch > 0) {
        score += amenMatch * 10;
        reasons.push("amenities");
      }
      if (pref.tripType === "adventure" && acc.municipality === "Pagudpud") {
        score += 10;
        reasons.push("adventure");
      }
      if (pref.tripType === "culture" && acc.municipality === "Paoay") {
        score += 10;
        reasons.push("culture");
      }

      return { ...acc, score, reasons };
    })
    .filter(a => a.score > 0)
    .sort((a, b) => b.score - a.score);
}

// -------- DISPLAY RESULTS --------
function showResults(list) {
  const resDiv = document.getElementById("results");
  resDiv.innerHTML = "";

  if (list.length === 0) {
    resDiv.innerHTML = "<p>No matching accommodations.</p>";
    return;
  }

  list.forEach(a => {
    const d = document.createElement("div");
    d.className = "reco-card";
    d.innerHTML = `
      <h3>${a.name}</h3>
      <p><strong>Municipality:</strong> ${a.municipality}</p>
      <p><strong>Budget:</strong> ${a.price}</p>
      <p>${a.notes}</p>
      <p><em>Matched: ${a.reasons.join(", ")}</em></p>
    `;
    resDiv.appendChild(d);
  });
}

// -------- MAP PLOTTING --------
function plotMarkers(list) {
  clusterGroup.clearLayers();
  list.forEach(a => {
    const marker = L.marker(a.coords, { icon: resortIcon })
      .bindPopup(`<strong>${a.name}</strong><br>${a.municipality}`);
    clusterGroup.addLayer(marker);
  });
  if (list.length > 0) {
    map.setView(list[0].coords, 12);
  }
}

// -------- FORM HANDLER --------
document.getElementById("prefForm").addEventListener("submit", e => {
  e.preventDefault();

  const pref = {
    budget: document.getElementById("budget").value,
    municipality: document.getElementById("location").value,
    tripType: document.getElementById("tripType").value,
    amenities: [...document.querySelectorAll(".amenities input:checked")].map(a => a.value)
  };

  const results = getRecommendations(pref);
  showResults(results);
  plotMarkers(results);
});
