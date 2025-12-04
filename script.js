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

// Sample accommodations dataset
const accommodations = [
  { name: "Java Hotel", lat: 18.20, lng: 120.59, area: "City", budget: 2400, rating: 4.2, town: "laoag" },
  { name: "Viven Hotel", lat: 18.20, lng: 120.60, area: "City", budget: 2000, rating: 4.0, town: "laoag" },
  { name: "Bellagio Hills Hotel", lat: 18.08, lng: 120.53, area: "City", budget: 2200, rating: 4.1, town: "paoay" },
  { name: "Blue Lagoon Inn", lat: 18.65, lng: 120.75, area: "Beachfront", budget: 2000, rating: 3.9, town: "pagudpud" },
  { name: "Currimar Addison Beach Resort", lat: 18.00, lng: 120.48, area: "Beachfront", budget: 1900, rating: 3.7, town: "currimao" },
  { name: "Sikatel Hotel", lat: 18.06, lng: 120.56, area: "City", budget: 1500, rating: 3.7, town: "batac" },
  { name: "Cape Bojeador Lodge", lat: 18.52, lng: 120.65, area: "Mountain", budget: 1300, rating: 3.5, town: "burgos" }
];

function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

function centerMap() {
    let townInput = document.getElementById("townInput").value.toLowerCase().trim();
    if (towns[townInput]) {
        map.setView(towns[townInput], 12);
    } else {
        alert("Town not found.");
    }
}

function refreshRecommendations() {
    clearMarkers();

    const budget = parseInt(document.getElementById("budget").value);
    const area = document.getElementById("area").value;
    const rating = parseFloat(document.getElementById("rating").value);

    let townInput = document.getElementById("townInput").value.toLowerCase().trim();

    const list = document.getElementById("recommendations");
    const details = document.getElementById("recommendation-details");
    list.innerHTML = "";
    details.innerHTML = "";

    if (!towns[townInput]) {
        list.innerHTML = "<li>Town not found.</li>";
        return;
    }

    map.setView(towns[townInput], 12);

    const filtered = accommodations.filter(a =>
        a.town.toLowerCase() === townInput &&
        a.budget <= budget &&
        a.rating >= rating &&
        (area === "Any" || a.area === area)
    );

    if (filtered.length === 0) {
        list.innerHTML = "<li>No accommodations found in this town.</li>";
        return;
    }

    filtered.forEach(a => {
        const li = document.createElement("li");
        li.textContent = `${a.name} — ₱${a.budget} — ⭐ ${a.rating}`;
        list.appendChild(li);

        const marker = L.marker([a.lat, a.lng])
            .addTo(map)
            .bindPopup(`<b>${a.name}</b><br>₱${a.budget}<br>Rating: ${a.rating}`);

        markers.push(marker);

        li.onclick = () => {
            details.innerHTML = `
                <h3>${a.name}</h3>
                <p><b>Budget:</b> ₱${a.budget}</p>
                <p><b>Rating:</b> ⭐ ${a.rating}</p>
                <p><b>Area:</b> ${a.area}</p>
                <p><b>Town:</b> ${a.town}</p>
            `;
            map.setView([a.lat, a.lng], 15);
            marker.openPopup();
        };
    });
}

// Autocomplete for town input
function showSuggestions() {
    const input = document.getElementById("townInput");
    const listContainer = document.getElementById("autocomplete-list");
    const val = input.value.toLowerCase().trim();

    listContainer.innerHTML = "";
    if (!val) return;

    const matches = Object.keys(towns).filter(town => town.startsWith(val));

    matches.forEach(match => {
        const item = document.createElement("div");
        item.classList.add("autocomplete-item");
        item.innerHTML = match.charAt(0).toUpperCase() + match.slice(1);
        item.addEventListener("click", () => {
            input.value = match;
            listContainer.innerHTML = "";
            centerMap();
            refreshRecommendations();
        });
        listContainer.appendChild(item);
    });
}

document.addEventListener("click", function(e) {
    if (!document.getElementById("townInput").contains(e.target)) {
        document.getElementById("autocomplete-list").innerHTML = "";
    }
});
