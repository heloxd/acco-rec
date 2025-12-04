/* script.js
   Fully client-side — rule-based recommender runs here.
   Replace API key in index.html before running.
*/

(() => {
  // --- Sample dataset (Ilocos Norte) ---
  const ACCOMMODATIONS = [
    { id:1, name:"Laoag Bayview Hotel", lat:18.1959, lng:121.5839, price:1800, rating:4.2, area:"Laoag", amenities:["wifi","breakfast","parking"], description:"Comfortable mid-range hotel in Laoag city."},
    { id:2, name:"Pagudpud Beachfront Cottages", lat:18.5231, lng:120.7651, price:2500, rating:4.5, area:"Pagudpud", amenities:["wifi","beach","breakfast"], description:"Simple cottages right on the beach."},
    { id:3, name:"Burgos Surf Lodge", lat:18.6642, lng:120.6690, price:1200, rating:4.0, area:"Burgos", amenities:["parking","surfboard rental"], description:"Budget-friendly lodge for surfers."},
    { id:4, name:"Currimao Seaview Guesthouse", lat:18.2150, lng:120.5999, price:900, rating:3.8, area:"Currimao", amenities:["parking","wifi"], description:"Quiet guesthouse with sea views."},
    { id:5, name:"Paoay Heritage Inn", lat:18.0970, lng:120.5223, price:1500, rating:4.6, area:"Paoay", amenities:["breakfast","wifi","heritage tours"], description:"Charming inn near Paoay Church."}
  ];

  // --- DOM elements ---
  const mapEl = document.getElementById('map');
  const placeInput = document.getElementById('place-input');
  const locateBtn = document.getElementById('locate-btn');
  const budgetEl = document.getElementById('budget');
  const budgetLabel = document.getElementById('budget-label');
  const areaSelect = document.getElementById('area-select');
  const amenitiesRow = document.getElementById('amenities');
  const minRatingEl = document.getElementById('min-rating');
  const ratingLabel = document.getElementById('rating-label');
  const refreshBtn = document.getElementById('refresh-btn');
  const resultsEl = document.getElementById('results');
  const distanceMatrixBtn = document.getElementById('distance-matrix-btn');
  const routePanel = document.getElementById('route-panel');
  const routeInfo = document.getElementById('route-info');
  const directionsClearBtn = document.getElementById('directions-clear');

  // --- State ---
  let map, autocomplete, markers = [], infoWindow, directionsService, directionsRenderer, distanceService;
  let userPosition = null;
  let prefs = {
    budget: Number(budgetEl.value),
    area: 'any',
    amenities: [],
    minRating: Number(minRatingEl.value),
    center: { lat: 18.1959, lng: 120.5930 } // default Laoag-ish center
  };

  // --- Init UI values ---
  budgetLabel.textContent = prefs.budget;
  ratingLabel.textContent = prefs.minRating.toFixed(1);

  // Populate unique areas and amenities
  const areas = Array.from(new Set(ACCOMMODATIONS.map(a => a.area))).sort();
  areas.forEach(a => {
    const opt = document.createElement('option'); opt.value = a; opt.textContent = a; areaSelect.appendChild(opt);
  });
  const allAmenities = Array.from(new Set(ACCOMMODATIONS.flatMap(a => a.amenities)));
  allAmenities.forEach(am => {
    const b = document.createElement('button'); b.type='button'; b.className='chip'; b.textContent = am;
    b.addEventListener('click', () => {
      b.classList.toggle('active');
      if (prefs.amenities.includes(am)) prefs.amenities = prefs.amenities.filter(x => x !== am);
      else prefs.amenities.push(am);
    });
    amenitiesRow.appendChild(b);
  });

  // --- Map & Google services setup ---
  function initMap() {
    map = new google.maps.Map(mapEl, { center: prefs.center, zoom: 10 });
    infoWindow = new google.maps.InfoWindow();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map });
    distanceService = new google.maps.DistanceMatrixService();

    // Autocomplete
    autocomplete = new google.maps.places.Autocomplete(placeInput, { types: ['geocode','establishment'] });
    autocomplete.addListener('place_changed', () => {
      const p = autocomplete.getPlace();
      if (!p.geometry) return;
      const loc = p.geometry.location;
      map.panTo(loc);
      map.setZoom(13);
      prefs.center = { lat: loc.lat(), lng: loc.lng() };
      refreshRecommendations();
    });

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        userPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        // add user marker
        new google.maps.Marker({ position: userPosition, map, title: 'You are here', icon:{path:google.maps.SymbolPath.CIRCLE, scale:6, fillColor:'#1976d2', fillOpacity:1, strokeWeight:0} });
      }, ()=>{/*ignore*/});
    }

    // initial markers
    refreshRecommendations();
  }

  // --- Rule-based scoring (same logic as earlier) ---
  function haversine([lat1, lon1], [lat2, lon2]) {
    const toRad = x => (x * Math.PI)/180;
    const R = 6371;
    const dLat = toRad(lat2-lat1), dLon = toRad(lon2-lon1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R*c;
  }

  function scoreAccommodation(acco, prefsLocal) {
    let score = 0;
    if (prefsLocal.budget) {
      const diff = acco.price - prefsLocal.budget;
      if (diff <= 0) score += 30 + Math.min(10, Math.abs(diff)/50);
      else if (diff <= prefsLocal.budget * 0.25) score += 10;
      else score -= 10;
    }
    if (prefsLocal.area && prefsLocal.area !== 'any') {
      if (acco.area.toLowerCase() === prefsLocal.area.toLowerCase()) score += 40;
    } else score += 5;
    if (prefsLocal.amenities && prefsLocal.amenities.length>0) {
      const match = prefsLocal.amenities.filter(a=>acco.amenities.includes(a)).length;
      score += match * 12;
    }
    if (prefsLocal.minRating) {
      if (acco.rating >= prefsLocal.minRating) score += (acco.rating - prefsLocal.minRating)*15 + 10;
      else score -= (prefsLocal.minRating - acco.rating)*10;
    } else score += acco.rating*5;
    if (prefsLocal.center) {
      const dist = haversine([acco.lat, acco.lng], [prefsLocal.center.lat, prefsLocal.center.lng]);
      if (dist <= 5) score += 20;
      else if (dist <= 15) score += 10;
      else if (dist <= 30) score += 5;
      else score -= 5;
    }
    return score;
  }

  // --- Render markers and list ---
  function clearMarkers(){ markers.forEach(m=>m.setMap(null)); markers=[]; }
  function renderMarkers(list) {
    clearMarkers();
    list.forEach(a=>{
      const m = new google.maps.Marker({ position:{lat:a.lat,lng:a.lng}, map, title:a.name });
      const content = `<div style="min-width:200px"><strong>${a.name}</strong><div style="font-size:13px">₱${a.price} • ${a.rating}★ • ${a.area}</div><div style="margin-top:6px">${a.description}</div></div>`;
      m.addListener('click', ()=>infoWindow.setContent(content) || infoWindow.open(map,m));
      markers.push(m);
    });
  }

  function renderResults(list) {
    resultsEl.innerHTML = '';
    if (!list.length) { resultsEl.innerHTML = '<div style="color:#6b7280">No matches</div>'; return; }
    list.forEach(a=>{
      const item = document.createElement('div'); item.className='result-item';
      item.innerHTML = `
        <div>
          <div style="font-weight:600">${a.name}</div>
          <div class="meta">${a.area} • ₱${a.price} • ${a.rating}★</div>
          <div style="font-size:13px;color:#374151">${a.description}</div>
        </div>
      `;
      const actions = document.createElement('div');
      const centerBtn = document.createElement('button'); centerBtn.textContent='Center'; centerBtn.addEventListener('click', ()=>{ map.panTo({lat:a.lat, lng:a.lng}); map.setZoom(13); });
      const dirBtn = document.createElement('button'); dirBtn.textContent='Route'; dirBtn.style.marginTop='6px'; dirBtn.addEventListener('click', ()=> routeToAccommodation(a));
      actions.appendChild(centerBtn); actions.appendChild(dirBtn);
      item.appendChild(actions);
      resultsEl.appendChild(item);
    });
  }

  // --- Recommendation computation ---
  function computeRecommendations() {
    // compute score for each accommodation
    const scored = ACCOMMODATIONS.map(a => ({...a, score: scoreAccommodation(a, prefs)}));
    scored.sort((x,y)=> y.score - x.score);
    return scored;
  }

  function refreshRecommendations() {
    const recs = computeRecommendations();
    renderMarkers(recs.slice(0, 20));
    renderResults(recs.slice(0, 10));
  }

  // --- Directions & Distance Matrix ---
  function routeToAccommodation(acco) {
    if (!userPosition) {
      alert('User location unknown. Allow geolocation or center map manually and try again.');
      return;
    }
    const origin = new google.maps.LatLng(userPosition.lat, userPosition.lng);
    const destination = new google.maps.LatLng(acco.lat, acco.lng);
    directionsService.route({ origin, destination, travelMode: 'DRIVING' }, (res, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(res);
        routePanel.hidden = false;
        const leg = res.routes[0].legs[0];
        routeInfo.innerHTML = `<div><strong>${leg.end_address}</strong></div><div>Distance: ${leg.distance.text} — Duration: ${leg.duration.text}</div>`;
      } else {
        alert('Directions request failed: ' + status);
      }
    });
  }

  function computeDistanceMatrix() {
    if (!userPosition) { alert('Unknown user location. Allow location first.'); return; }
    const origins = [new google.maps.LatLng(userPosition.lat, userPosition.lng)];
    const destinations = ACCOMMODATIONS.map(a => new google.maps.LatLng(a.lat, a.lng));
    distanceService.getDistanceMatrix({
      origins, destinations,
      travelMode: 'DRIVING', unitSystem: google.maps.UnitSystem.METRIC, avoidHighways:false, avoidTolls:false
    }, (response, status) => {
      if (status !== 'OK') {
        alert('Distance Matrix failed: ' + status);
        return;
      }
      // show a simple alert (or render in UI)
      const rows = response.rows[0].elements;
      const lines = rows.map((r,i)=> `${ACCOMMODATIONS[i].name}: ${r.status==='OK' ? r.distance.text + ' / ' + r.duration.text : 'N/A'}`);
      alert('Distances from you:\\n' + lines.join('\\n'));
    });
  }

  // --- UI event handlers ---
  budgetEl.addEventListener('input', e => { prefs.budget = Number(e.target.value); budgetLabel.textContent = prefs.budget; });
  minRatingEl.addEventListener('input', e => { prefs.minRating = Number(e.target.value); ratingLabel.textContent = prefs.minRating.toFixed(1); });
  areaSelect.addEventListener('change', e => { prefs.area = e.target.value; });
  refreshBtn.addEventListener('click', () => { refreshRecommendations(); });
  distanceMatrixBtn.addEventListener('click', () => computeDistanceMatrix());
  locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(pos => {
      userPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      map.panTo(userPosition); map.setZoom(12);
      // add a temporary marker
      new google.maps.Marker({ position: userPosition, map, title:'You are here', icon:{path:google.maps.SymbolPath.CIRCLE, scale:6, fillColor:'#1976d2', fillOpacity:1, strokeWeight:0}});
    }, err => alert('Geolocation failed: ' + err.message));
  });
  directionsClearBtn.addEventListener('click', ()=> { directionsRenderer.setDirections({routes:[]}); routePanel.hidden=true; routeInfo.innerHTML=''; });

  // --- Start map when google loaded ---
  function waitForGoogle() {
    if (window.google && google.maps) { initMap(); }
    else setTimeout(waitForGoogle, 200);
  }
  waitForGoogle();

})(); 
