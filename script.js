//-----------------------------------------------
// Global Map + Layers
//-----------------------------------------------
let map = L.map("map").setView([18.1978, 120.5936], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let markers = L.markerClusterGroup();
map.addLayer(markers);

let userMarker = null;
let routeLayer = null;

//-----------------------------------------------
// Photon Autocomplete (Town Search)
//-----------------------------------------------
const placeInput = document.getElementById("place-input");
const autoList = document.getElementById("autocomplete-list");

placeInput.addEventListener("input", async () => {
  const query = placeInput.value.trim();
  if (query.length < 2) {
    autoList.style.display = "none";
    return;
  }

  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6`;
  const res = await fetch(url);
  const data = await res.json();

  autoList.innerHTML = "";
  autoList.style.display = "block";

  data.features.forEach((f) => {
    const div = document.createElement("div");
    div.textContent = f.properties.name + ", " + (f.properties.city || "");
    div.onclick = () => {
      selectPlace(f);
    };
    autoList.appendChild(div);
  });
});

function selectPlace(f) {
  autoList.style.display = "none";

  const [lng, lat] = f.geometry.coordinates;
  map.setView([lat, lng], 14);

  // fetch accommodations around this town
  fetchAccommodations(lat, lng);
}

//-----------------------------------------------
// Fetch Accommodations From Overpass API
//-----------------------------------------------
async function fetchAccommodations(lat, lng) {
  markers.clearLayers();
  document.getElementById("results").innerHTML = "Searching…";

  // Overpass query — finds hotels, guesthouses, motels, resorts, etc.
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["tourism"~"hotel|guest_house|hostel|motel|resort"](around:6000,${lat},${lng});
      way["tourism"~"hotel|guest_house|hostel|motel|resort"](around:6000,${lat},${lng});
      relation["tourism"~"hotel|guest_house|hostel|motel|resort"](around:6000,${lat},${lng});
    );
    out center;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: overpassQuery,
  });

  const data = await res.json();

  const filtered = applyFilters(data.elements);

  displayResults(filtered);
  placeMarkers(filtered);
}

//-----------------------------------------------
// Apply Budget + Amenities Filters
//-----------------------------------------------
function applyFilters(elements) {
  const budget = parseInt(document.getElementById("budget").value);
  const minRating = parseFloat(document.getElementById("min-rating").value);

  // random amenities data (because OSM does not store detailed hotel amenities)
  const randomAmenities = ["wifi", "parking", "ac", "pool", "breakfast"];

  return elements
    .map((el) => {
      const lat = el.lat || el.center?.lat;
      const lng = el.lon || el.center?.lon;

      if (!lat || !lng) return null;

      // create realistic fake price + rating since OSM lacks this information
      el.estimated_price = randomPrice();
      el.estimated_rating = randomRating();
      el.amenities = randomAmenities.filter(() => Math.random() > 0.5);

      return el;
    })
    .filter((el) => el && el.estimated_price <= budget)
    .filter((el) => el.estimated_rating >= minRating);
}

function randomPrice() {
  return Math.floor(Math.random() * 4000) + 500;
}

function randomRating() {
  return (Math.random() * 2 + 3).toFixed(1);
}

//-----------------------------------------------
// Display Results in Left Panel
//-----------------------------------------------
function displayResults(list) {
  const results = document.getElementById("results");
  results.innerHTML = "";

  if (!list.length) {
    results.innerHTML = "<p>No matching accommodations found.</p>";
    return;
  }

  list.forEach((el) => {
    const div = document.createElement("div");
    div.className = "result";
    div.innerHTML = `
      <b>${el.tags?.name || "Unnamed Accommodation"}</b><br>
      ₱${el.estimated_price} · ⭐ ${el.estimated_rating}<br>
      <small>${el.amenities.join(", ")}</small>
    `;
    div.onclick = () => {
      map.setView([el.lat || el.center.lat, el.lon || el.center.lon], 17);
    };
    results.appendChild(div);
  });
}

//-----------------------------------------------
// Place Markers
//-----------------------------------------------
function placeMarkers(list) {
  markers.clearLayers();

  list.forEach((el) => {
    const lat = el.lat || el.center.lat;
    const lng = el.lon || el.center.lon;

    const marker = L.marker([lat, lng]).bindPopup(`
      <b>${el.tags?.name || "Unnamed"}</b><br>
      ₱${el.estimated_price}<br>
      ⭐ ${el.estimated_rating}<br>
      ${el.amenities.join(", ")}
      <br><button onclick="routeTo(${lat},${lng})">Route</button>
    `);

    markers.addLayer(marker);
  });
}

//-----------------------------------------------
// Route From User Location to Hotel
//-----------------------------------------------
async function routeTo(lat, lng) {
  if (!userMarker) {
    alert("Enable Your Location first.");
    return;
  }

  const start = userMarker.getLatLng();
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${lng},${lat}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes.length) {
    alert("No route found.");
    return;
  }

  if (routeLayer) map.removeLayer(routeLayer);

  routeLayer = L.geoJSON(data.routes[0].geometry, {
    style: { color: "blue", weight: 4 },
  }).addTo(map);

  document.getElementById("route-panel").hidden = false;
  document.getElementById("route-info").innerHTML =
    `<b>Distance:</b> ${data.routes[0].distance / 1000} km<br>` +
    `<b>Duration:</b> ${(data.routes[0].duration / 60).toFixed(1)} mins`;
}

// Clear route
document.getElementById("directions-clear").onclick = () => {
  if (routeLayer) map.removeLayer(routeLayer);
  routeLayer = null;
  document.getElementById("route-panel").hidden = true;
};

//-----------------------------------------------
// User Location
//-----------------------------------------------
document.getElementById("locate-btn").onclick = () => {
  map.locate({ setView: true, maxZoom: 15 });
};

map.on("locationfound", (e) => {
  if (userMarker) map.removeLayer(userMarker);

  userMarker = L.marker(e.latlng, { title: "You are here" }).addTo(map);
});

map.on("locationerror", () => {
  alert("Unable to get your location.");
});
