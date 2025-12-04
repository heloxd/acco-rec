// Initialize map
var map = L.map('map').setView([17.57, 120.39], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

var markers = [];

// Full list of Ilocos Norte towns + coords
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

// Sample dataset
const accommodations = [
    { name: "Java Hotel", lat: 18.20, lng: 120.59, area: "City", budget: 2400, rating: 4.2, town: "laoag" },
    { name: "Viven Hotel", lat: 18.20, lng: 120.60, area: "City", budget: 1800, rating: 4.0, town: "laoag" },
    { name: "Fort Ilocandia Resort", lat: 18.19, lng: 120.55, area: "Beachfront", budget: 3500, rating: 4.3, town: "laoag" },
    { name: "Hannah's Resort", lat: 18.60, lng: 120.80, area: "Beachfront", budget: 3200, rating: 4.4, town: "pagudpud" },
    { name: "Casa Consuelo", lat: 18.62, lng: 120.82, area: "Beachfront", budget: 2500, rating: 4.1, town: "pagudpud" }
];

function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

function centerMap() {
    const town = document.getElementById("townInput").value.toLowerCase().trim();

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

    const list = document.getElementById("recommendations");
    list.innerHTML = "";

    const filtered = accommodations.filter(a =>
        a.budget <= budget &&
        a.rating >= rating &&
        (area === "Any" || a.area === area)
    );

    if (filtered.length === 0) {
        list.innerHTML = "<li>No results found.</li>";
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
    });
}
