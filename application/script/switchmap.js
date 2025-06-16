// Annahme: Deine Karte wird bereits in einer anderen Datei initialisiert.
// Daher wird der Initialisierungsteil der Karte hier entfernt.

function switchMap() {
    // Speichere den aktuellen Kartenausschnitt und Zoomlevel
    var currentCenter = map.getCenter();
    var currentZoom = map.getZoom();
    
    // Speichere die Eingabe im Suchfeld
    var searchInput = document.getElementById('search-input').value;
    
    // Speichere die Marker-Positionen und Inhalte
    var markersData = markers.map(marker => {
        return {
            lat: marker.getLatLng().lat,
            lng: marker.getLatLng().lng,
            popupContent: marker.getPopup() ? marker.getPopup().getContent() : null
        };
    });

    var targetUrl;
    var currentUrl = window.location.href;

    if (currentUrl.includes('index_color.html')) {
        targetUrl = 'index_grey.html';
    } else {
        targetUrl = 'index_color.html';
    }

    // Füge den Kartenausschnitt, Zoomlevel, Suchfeld-Eingabe und Marker-Daten als URL-Parameter hinzu
    targetUrl += `?lat=${currentCenter.lat}&lng=${currentCenter.lng}&zoom=${currentZoom}&search=${encodeURIComponent(searchInput)}&markers=${encodeURIComponent(JSON.stringify(markersData))}`;

    window.location.href = targetUrl; // Leitet zur neuen Kartenansicht weiter
}
