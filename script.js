// ---------- Initialize Map ----------
var map = L.map('map').setView([17.57, 120.39], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Ensure map renders properly on page load
window.addEventListener('load', () => {
    map.invalidateSize();
});

// ---------- Marker Storage ----------
var markers = [];

// ---------- Town Coordinates ----------
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

// ---------- Accommodations List ----------
const accommodations = [
    // Laoag
    { name: "Java Hotel", lat: 18.20, lng: 120.59, area: "City", budget: 2400, rating: 4.2, town: "laoag" },
    { name: "Viven Hotel", lat: 18.20, lng: 120.60, area: "City", budget: 2000, rating: 4.0, town: "laoag" },
    { name: "Northview Hotel", lat: 18.21, lng: 120.60, area: "City", budget: 1800, rating: 3.9, town: "laoag" },
    { name: "Fort Ilocandia Resort", lat: 18.19, lng: 120.55, area: "Beachfront", budget: 3500, rating: 4.3, town: "laoag" },
    { name: "Isabel Suites", lat: 18.20, lng: 120.58, area: "City", budget: 1500, rating: 3.8, town: "laoag" },
    // Paoay
    { name: "Bellagio Hills Hotel & Restaurant", lat: 18.08, lng: 120.53, area: "City", budget: 2200, rating: 4.1, town: "paoay" },
    { name: "Veranda Suites & Restaurant", lat: 18.07, lng: 120.52, area: "City", budget: 1700, rating: 3.9, town: "paoay" },
    // Pagudpud
    { name: "Alta Vista Ilocandia", lat: 18.59, lng: 120.79, area: "Beachfront", budget: 2200, rating: 4.0, town: "pagudpud" },
    { name: "Blue Lagoon Inn & Restaurant", lat: 18.65, lng: 120.75, area: "Beachfront", budget: 2000, rating: 3.9, town: "pagudpud" },
    { name: "Hannah's Resort", lat: 18.60, lng: 120.80, area: "Beachfront", budget: 3200, rating: 4.4, town: "pagudpud" },
    // Currimao
    { name: "Currimar Addison Beach Resort", lat: 17.98, lng: 120.48, area: "Beachfront", budget: 1900, rating: 3.7, town: "currimao" },
    // Bangui
    { name: "Amerie Rae Resort", lat: 18.33, lng: 120.75, area: "Beachfront", budget: 1700, rating: 3.8, town: "bangui" },
    // Batac
    { name: "Sikatel Hotel", lat: 18.06, lng: 120.56, area: "City", budget: 1500, rating: 3.7, town: "batac" },
    { name: "North Stellar Hotel & Events Place", lat: 18.07, lng: 120.55, area: "City", budget: 1600, rating: 3.8, town: "batac" },
    // San Nicolas
    { name: "Green Meadows Hotel & Restaurant", lat: 18.16, lng: 120.59, area: "City", budget: 1400, rating: 3.6, town: "san nicolas" },
    // Burgos
    { name: "Cape Bojeador Lodge", lat: 18.52, lng: 120.65, area: "Mountain/Coast", budget: 1300, rating: 3.5, town: "burgos" },
    // Badoc
    { name: "Badoc Seaside Resort", lat: 17.92, lng: 120.48, area: "Beachfront", budget: 1900, rating: 4.0, town: "badoc" },
    // Pasuquin
    { name: "Pasuquin Bayview Inn", lat: 18.32, lng: 120.62, area: "Beachfront", budget: 1800, rating: 3.9, town: "pasuquin" },
    // Adams
    { name: "Adams Highland Lodge", lat: 18.45, lng: 120.90, area: "Mountain", budget: 1300, rating: 3.8, town: "adams" },
    // Bacarra
    { name: "Bacarra Heritage Inn", lat: 18.25, lng: 120.61, area: "City", budget: 1400, rating: 3.7, town: "bacarra" },
    { name: "Bacarra Coastline Resort", lat: 18.26, lng: 120.62, area: "Beachfront", budget: 1800, rating: 3.8, town: "bacarra" },
    // Carasi
    { name: "Carasi Riverside Guesthouse", lat: 18.18, lng: 120.85, area: "Mountain", budget: 1200, rating: 3.5, town: "carasi" },
    // Dingras
    { name: "Dingras Traveler’s Rest", lat: 18.10, lng: 120.70, area: "City", budget: 1500, rating: 3.9, town: "dingras" },
    { name: "Dingras Budget Inn", lat: 18.11, lng: 120.69, area: "City", budget: 1100, rating: 3.4, town: "dingras" },
    // Dumalneg
    { name: "Dumalneg Hillside Lodge", lat: 18.46, lng: 120.80, area: "Mountain", budget: 1100, rating: 3.6, town: "dumalneg" },
    // Banna
    { name: "Banna Valley Resort", lat: 18.05, lng: 120.68, area: "Mountain", budget: 1250, rating: 3.7, town: "banna" },
    // Marcos
    { name: "Marcos Town Hotel", lat: 18.05, lng: 120.70, area: "City", budget: 1450, rating: 3.8, town: "marcos" },
    // Piddig
    { name: "Piddig Hillside Inn", lat: 18.12, lng: 120.70, area: "Mountain", budget: 1350, rating: 3.6, town: "piddig" },
    // Sarrat
    { name: "Sarrat Heritage Guesthouse", lat: 18.15, lng: 120.65, area: "City", budget: 1500, rating: 3.9, town: "sarrat" },
    // Vintar
    { name: "Vintar Riverside Lodge", lat: 18.22, lng: 120.70, area: "City", budget: 1400, rating: 3.7, town: "vintar" },
    { name: "Vintar Hills Lodge", lat: 18.23, lng: 120.71, area: "Mountain", budget: 1200, rating: 3.5, town: "vintar" },
    // Pinili
    { name: "Pinili Farmstead Stay", lat: 17.95, lng: 120.48, area: "Mountain", budget: 1300, rating: 3.6, town: "pinili" },
    // Solsona
    { name: "Solsona Mountain Retreat 2", lat: 18.12, lng: 120.85, area: "Mountain", budget: 1250, rating: 3.5, town: "solsona" }
];

// ---------- Clear Map Markers ----------
function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

// ---------- Center Map to Town ----------
function centerMap() {
    const townInput = document.getElementById("townInput");
    const town = townInput.value.toLowerCase().trim();

    if (towns[town]) {
        // Recenter map
        map.setView(towns[town], 12);

        // Optional: highlight town center briefly
        const townMarker = L.circleMarker(towns[town], {
            radius: 8,
            color: "#ff0000",
            fillColor: "#f03",
            fillOpacity: 0.5
        }).addTo(map);

        setTimeout(() => map.removeLayer(townMarker), 2000);

        // Show filtered accommodations
        refreshRecommendations();
    } else {
        alert("Town not found.");
    }
}

// ---------- Refresh Recommendations ----------
function refreshRecommendations() {
    clearMarkers();

    const town = document.getElementById("townInput").value.toLowerCase().trim();
    const budget = parseInt(document.getElementById("budget").value);
    const area = document.getElementById("area").value;
    const rating = parseFloat(document.getElementById("rating").value);

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

    filtered.forEach(a => {
        // List item
        const li = document.createElement("li");
        li.textContent = `${a.name} — ₱${a.budget} — ⭐ ${a.rating}`;
        list.appendChild(li);

        // Map marker
        const marker = L.marker([a.lat, a.lng])
            .addTo(map)
            .bindPopup(`<b>${a.name}</b><br>₱${a.budget}<br>Rating: ${a.rating}`);
        markers.push(marker);
    });
}

// ---------- Autocomplete for Town Input ----------
function autocomplete(input, arr) {
    let currentFocus;

    input.addEventListener("input", function () {
        const val = this.value.toLowerCase();
        closeAllLists();
        if (!val) return false;

        currentFocus = -1;

        const list = document.createElement("DIV");
        list.setAttribute("id", this.id + "-autocomplete-list");
        list.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(list);

        arr.forEach(function (item) {
            if (item.substr(0, val.length).toLowerCase() === val) {
                const itemDiv = document.createElement("DIV");
                itemDiv.innerHTML = "<strong>" + item.substr(0, val.length) + "</strong>";
                itemDiv.innerHTML += item.substr(val.length);
                itemDiv.innerHTML += `<input type='hidden' value='${item}'>`;

                itemDiv.addEventListener("click", function () {
                    input.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                    centerMap(); // <-- recenter map immediately
                });

                list.appendChild(itemDiv);
            }
        });
    });

    input.addEventListener("keydown", function (e) {
        let list = document.getElementById(this.id + "-autocomplete-list");
        if (list) list = list.getElementsByTagName("div");

        if (e.keyCode === 40) { // down
            currentFocus++;
            addActive(list);
        } else if (e.keyCode === 38) { // up
            currentFocus--;
            addActive(list);
        } else if (e.keyCode === 13) { // enter
            e.preventDefault();
            if (currentFocus > -1) {
                if (list) list[currentFocus].click();
            } else {
                centerMap(); // <-- press Enter to recenter
            }
        }
    });

    function addActive(list) {
        if (!list) return false;
        removeActive(list);
        if (currentFocus >= list.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = list.length - 1;
        list[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(list) {
        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        const items = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < items.length; i++) {
            if (elmnt != items[i] && elmnt != input) {
                items[i].parentNode.removeChild(items[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

// Initialize autocomplete with town names
autocomplete(document.getElementById("townInput"), Object.keys(towns));
