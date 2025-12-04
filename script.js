let map = L.map('map').setView([18.1978, 120.595], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = [];
let towns = {};
let hotels = [];

// Load towns.json & hotels.json
fetch("towns.json")
    .then(r => r.json())
    .then(data => towns = data);

fetch("hotels.json")
    .then(r => r.json())
    .then(data => hotels = data);

// --------------------------------------
// CLEAR MARKERS
// --------------------------------------
function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

// --------------------------------------
// SEARCH TOWN
// --------------------------------------
function searchTown() {
    const input = document.getElementById("townInput").value.trim().toLowerCase();

    if (!towns[input]) {
        alert("Town not found.");
        return;
    }

    const [lat, lng] = towns[input];
    map.setView([lat, lng], 13);

    refreshRecommendations(input);
}

// --------------------------------------
// REFRESH RECOMMENDATIONS
// --------------------------------------
function refreshRecommendations(filterTown = null) {
    clearMarkers();

    const budget = parseInt(document.getElementById("budget").value);
    const area = document.getElementById("area").value;
    const rating = parseFloat(document.getElementById("rating").value);

    const list = document.getElementById("recommendations");
    list.innerHTML = "";

    const filtered = hotels.filter(h =>
        h.budget <= budget &&
        h.rating >= rating &&
        (area === "Any" || h.area === area) &&
        (filterTown === null || h.town === filterTown)
    );

    if (filtered.length === 0) {
        list.innerHTML = "<li>No accommodations match your search.</li>";
        return;
    }

    filtered.forEach(h => {
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>${h.name}</strong><br>
            Town: ${h.town.toUpperCase()}<br>
            ₱${h.budget} • Rating: ${h.rating}<br>
            Area: ${h.area}
        `;
        list.appendChild(item);

        const popup = `
            <b>${h.name}</b><br>
            Town: ${h.town.toUpperCase()}<br>
            ₱${h.budget}<br>
            ⭐ ${h.rating}<br>
            ${h.area}
        `;

        const marker = L.marker([h.lat, h.lng]).addTo(map).bindPopup(popup);
        markers.push(marker);
    });
}
