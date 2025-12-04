// ---------------- Initial Setup ----------------
let map = L.map("map").setView([18.2, 120.6], 10);
let markerGroup = L.markerClusterGroup();
let currentMarkers = [];

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18
}).addTo(map);

map.addLayer(markerGroup);

// ---------------- Utility: Normalize Town Name ----------------
function normalizeTown(str) {
  return str.trim().toLowerCase().replace(/\./g,"").replace(/\s+/g," ");
}

// ---------------- Populate Dropdowns ----------------
const categorySelect = document.getElementById("categoryFilter");
categories.forEach(cat => {
  const opt = document.createElement("option");
  opt.value = cat;
  opt.textContent = cat;
  categorySelect.appendChild(opt);
});

const areaSelect = document.getElementById("areaFilter");
areas.forEach(a => {
  const opt = document.createElement("option");
  opt.value = a;
  opt.textContent = a;
  areaSelect.appendChild(opt);
});

// ---------------- Autocomplete ----------------
const townInput = document.getElementById("townInput");
const acList = document.getElementById("autocomplete-list");

townInput.addEventListener("input", () => {
  acList.innerHTML = "";
  const val = townInput.value.toLowerCase();

  if (!val) return;

  towns.filter(t => t.toLowerCase().startsWith(val)).forEach(match => {
    const div = document.createElement("div");
    div.classList.add("autocomplete-item");
    div.textContent = match;
    div.onclick = () => {
      townInput.value = match;
      acList.innerHTML = "";
    };
    acList.appendChild(div);
  });
});

// ---------------- Clear Markers ----------------
function clearMarkers() {
  markerGroup.clearLayers();
  currentMarkers = [];
}

// ---------------- Render Recommendations ----------------
function renderRecommendations(list) {
  const rec = document.getElementById("recommendations");
  rec.innerHTML = "";

  list.forEach(acc => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${acc.name}</strong><br>
      ${acc.category} • ${acc.area}<br>
      ₱${acc.price.toLocaleString()}
    `;
    li.onclick = () => {
      map.setView([acc.lat, acc.lng], 15);
    };
    rec.appendChild(li);
  });
}

// ---------------- Search Function ----------------
document.getElementById("searchBtn").onclick = () => {
  const townVal = normalizeTown(townInput.value);
  const budgetVal = parseInt(document.getElementById("budgetRange").value);
  const catVal = categorySelect.value;
  const areaVal = areaSelect.value;

  let results = accommodations.filter(a => {
    const matchTown = !townVal || normalizeTown(a.town) === townVal;
    const matchBudget = a.price <= budgetVal;
    const matchCat = !catVal || a.category === catVal;
    const matchArea = !areaVal || a.area === areaVal;
    return matchTown && matchBudget && matchCat && matchArea;
  });

  clearMarkers();

  results.forEach(a => {
    const m = L.marker([a.lat, a.lng])
      .bindPopup(`<b>${a.name}</b><br>${a.category} • ${a.area}<br>₱${a.price}`);
    markerGroup.addLayer(m);
    currentMarkers.push(m);
  });

  if (results.length > 0) {
    map.fitBounds(markerGroup.getBounds());
  }

  renderRecommendations(results);
};

// ---------------- Budget Display ----------------
const budgetRange = document.getElementById("budgetRange");
const budgetValue = document.getElementById("budgetValue");

budgetRange.oninput = () => {
  budgetValue.textContent = "₱" + parseInt(budgetRange.value).toLocaleString();
};

// ---------------- Clear Button ----------------
document.getElementById("clearBtn").onclick = () => {
  townInput.value = "";
  categorySelect.value = "";
  areaSelect.value = "";
  budgetRange.value = 10000;
  budgetValue.textContent = "₱10,000";

  document.getElementById("recommendations").innerHTML = "";

  clearMarkers();
  map.setView([18.2, 120.6], 10);
};
