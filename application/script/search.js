// Annahme: Deine Karte wird bereits in einer anderen Datei initialisiert.
// Daher wird der Initialisierungsteil der Karte hier entfernt.

// Array zum Speichern der Marker
var markers = [];

// Load parcel data
var parcelData = {};
fetch("../data/kataster.json")
    .then(response => response.json())
    .then(data => {
        parcelData = data.reduce((acc, parcel) => {
            const gemeinde = parcel.Gemeinde ? parcel.Gemeinde.toLowerCase() : '';
            const key = parcel.Parzellennummer + "-" + gemeinde;
            acc[key] = parcel;
            return acc;
        }, {});
        console.log("JSON data loaded:", parcelData);
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });

document.getElementById('search-input').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = '';

    if (query.length > 0) {
        // Entferne alle vorhandenen Marker
        removeAllMarkers();

        const matches = [];
        for (const parcelNumber in parcelData) {
            for (let i = 1; i <= 7; i++) {
                const owner = parcelData[parcelNumber][`Grundeigentümer ${i}`];
                if (owner) {
                    const ownerLower = owner.toLowerCase();
                    const words = ownerLower.split(' ');
                    let matchFound = false;
                    for (const word of words) {
                        if (word.startsWith(query)) {
                            matchFound = true;
                            break;
                        }
                    }
                    if (matchFound && !matches.includes(owner)) {
                        matches.push(owner);
                    }
                }
            }
        }

        matches.sort((a, b) => a.localeCompare(b));

        matches.forEach(function(match) {
            const div = document.createElement('div');
            div.textContent = match;
            div.classList.add('dropdown-item');
            div.addEventListener('mousedown', function(event) {
                event.preventDefault();
                document.getElementById('search-input').value = match;
                dropdown.innerHTML = '';
                highlightParcels(match);
            });
            dropdown.appendChild(div);
        });
    }
});

function highlightParcels(ownerName) {
    const bounds = L.latLngBounds();
    for (const parcelKey in parcelData) {
        for (let i = 1; i <= 7; i++) {
            if (parcelData[parcelKey][`Grundeigentümer ${i}`] === ownerName) {
                const parcel = parcelData[parcelKey];
                const gemeinde = parcel.Gemeinde;
                const parcelNumber = parcel.Parzellennummer;
                fetchCoordinates(gemeinde, parcelNumber, bounds);
            }
        }
    }
}

function fetchCoordinates(gemeinde, parcelNumber, bounds) {
    console.log(`Suche Koordinaten für: ${gemeinde} ${parcelNumber}`);

    const query = `${gemeinde} ${parcelNumber}`;
    const searchUrl = `https://www.ag.ch/geoportal/api/v1/location/search?_dc=${Date.now()}&type=locations&searchText=${encodeURIComponent(query)}&limit=50&lang=de&page=1&start=0`;
    const proxyURL = `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(searchUrl)}`;

    fetch(proxyURL)
        .then(response => response.json())
        .then(data => {
            console.log("Proxy-Antwort (search):", data);

            const result = data.results?.find(r => {
            const origin = r.origin || r.attrs?.origin;
            return origin === "parcel";
            });

            if (!result) {
            console.warn("Kein Parcel-Treffer gefunden – Origin-Werte:", data.results.map(r => r.attrs?.origin || r.origin));
            return;
            }
            console.log("Treffer mit origin='parcel':", result);

            const label = result.attrs?.labelraw;
            if (!label) {
                console.warn("Label fehlt im Parcel-Treffer:", result);
                return;
                }
            console.log("labelraw:", label);

            const egridMatch = label.match(/CH\s?(\d{4})\s?(\d{4})\s?(\d{4})/i);
            if (!egridMatch) {
                console.warn(`EGRID konnte nicht extrahiert werden: ${label}`);
                return;
            }

            const egrid = `ch${egridMatch[1]}${egridMatch[2]}${egridMatch[3]}`;
            console.log(`Extrahierte EGRID: ${egrid}`);

            const queryUrl = `https://www.ag.ch/geoportal/rest/services/kai_identify_app/MapServer/1/query?f=json&where=EGRID='${egrid}'&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=&outSR=2056`;
            const proxyURL = `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(queryUrl)}`;

            fetch(proxyURL)
                .then(response => response.json())
                .then(resultData => {
                    console.log("Proxy-Antwort (MapServer):", resultData);

                    if (!resultData.features || resultData.features.length === 0) {
                        console.warn(`MapServer liefert keine Geometrie für EGRID: ${egrid}`);
                        return;
                    }

                    const geom = resultData.features[0].geometry;
                    if (geom.x && geom.y) {
                        latlng = proj4('EPSG:2056', 'EPSG:4326', [geom.x, geom.y]);
                    } else if (geom.rings) {
                        const coords = geom.rings[0].flat();
                        const n = coords.length / 2;
                        const avgX = coords.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0) / n;
                        const avgY = coords.filter((_, i) => i % 2 !== 0).reduce((a, b) => a + b, 0) / n;
                        latlng = proj4('EPSG:2056', 'EPSG:4326', [avgX, avgY]);
                    } else {
                        console.warn(`Keine nutzbare Geometrie für ${egrid}`);
                    }
                    if (latlng) addMarker(latlng, bounds);
                })
                .catch(err => console.error(`Fehler bei MapServer-Abfrage`, err));
        })
        .catch(error => {
            console.error(`Fehler bei Suche`, error);
        });
}



function addMarker(latlng, bounds) {
    const marker = L.marker([latlng[1], latlng[0]], {
        icon: new L.DivIcon({
            className: 'custom-leaflet-marker-icon', // Verwende die benutzerdefinierte CSS-Klasse
            iconSize: [25, 25],
        })
    });
    marker.addTo(map);
    markers.push(marker); // Marker zum Array hinzufügen

    // Füge die Marker-Koordinaten zu den Bounds hinzu
    bounds.extend(marker.getLatLng());

    // Passe den Kartenausschnitt an, um alle Marker anzuzeigen
    map.fitBounds(bounds, { padding: [300, 300] }); // Erhöhe den Padding-Wert, um weniger stark einzuzoomen
}

function removeAllMarkers() {
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
}

function setupClearSearchButton() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search');

  if (!input || !clearBtn) {
    console.warn('Suchfeld oder Clear-Button nicht gefunden.');
    return;
  }

  // Sichtbarkeit des X-Symbols steuern
  const updateClearButtonVisibility = () => {
    clearBtn.style.display = (document.activeElement === input || input.value.trim() !== '') ? 'block' : 'none';
  };

  input.addEventListener('focus', updateClearButtonVisibility);
  input.addEventListener('input', updateClearButtonVisibility);

  clearBtn.addEventListener('click', () => {
    input.value = '';
    updateClearButtonVisibility();

    removeAllMarkers();

    const results = document.querySelector('.search-results');
    if (results) results.innerHTML = '';

    const dropdown = document.getElementById('dropdown');
    if (dropdown) dropdown.innerHTML = '';

    const dropdownContainer = document.getElementById('dropdown-container');
    if (dropdownContainer) dropdownContainer.style.display = 'none';
  });

  // Direkt beim Laden prüfen
  updateClearButtonVisibility();
}

// Ganz am Ende der Datei aufrufen:
setupClearSearchButton();
