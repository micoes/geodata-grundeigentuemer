// Add popups as layers (leafletjs.com/examples/quick-start#dealing-with-events)
var popup = L.popup();
var parcelData = {};

// Define the source and destination projections
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
proj4.defs("EPSG:2056", "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346 +units=m +no_defs");

// Load and parse the JSON file
fetch("../data/kataster.json")
    .then(response => response.json())
    .then(data => {
        parcelData = data.reduce((acc, parcel) => {
            acc[parcel.Parzellennummer + "-" + parcel.Gemeinde.toLowerCase()] = parcel;
            return acc;
        }, {});
        console.log("JSON data loaded:", parcelData);
        console.log("All Keys:", Object.keys(parcelData));  // Konsolenausgabe aller Schlüssel
    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });

function onMapClick(e) {
    console.log("Map clicked at:", e.latlng);

    // Convert latitude and longitude to EPSG:2056 projection (CH1903+/LV95)
    var latlng = [e.latlng.lng, e.latlng.lat];
    var projected = proj4('EPSG:4326', 'EPSG:2056', latlng);

    var x = projected[0].toFixed(3); // Using fixed decimal points for precision
    var y = projected[1].toFixed(3);

    console.log("Converted coordinates:", x, y);

    // Construct the URL with the current timestamp and coordinates
    var apiUrl = `https://www.ag.ch/geoportal/api/v1/location/info?_dc=${Date.now()}&x=${x}&y=${y}`;
    var proxyUrl = `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(apiUrl)}`;
    console.log("Fetching URL:", proxyUrl);

    // Fetch data from the API using Thingproxy
    fetch(proxyUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Raw API Response Data:", data);
            var parsedData;
            try {
                parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                console.log("Parsed API Response Data:", parsedData);

                if (!parsedData.parzelle || !parsedData.gemeinde) {
                    throw new Error('Missing parzelle or gemeinde in response');
                }
            } catch (error) {
                throw new Error('Failed to parse API response as JSON or missing expected fields');
            }

            var areaUnit = parsedData.parzelle.unit === "SquareMeter" ? "m²" : parsedData.parzelle.unit;
            var parcelNumber = parsedData.parzelle.parzellenNr.toString();
            var parcelInfoKey = parcelNumber + "-" + parsedData.gemeinde.gemeinde.toLowerCase();
            var parcelInfo = parcelData[parcelInfoKey];
            console.log("Parcel Info Key:", parcelInfoKey);
            console.log("Parcel Info:", parcelInfo);

            var additionalInfo = "<p>Keine Eigentumsinformationen verfügbar.</p>";
            // Check if the parcel number and municipality match
            if (parcelInfo) {
                additionalInfo = `
                    <p><strong>${parcelInfo["Eigentumsform"]}</strong></p>
                `;
                for (var i = 1; i <= 7; i++) {
                    var ownerKey = `Grundeigentümer ${i}`;
                    var owner = parcelInfo[ownerKey];
                    console.log(`Checking owner: ${ownerKey} -> ${owner}`);
                    if (owner && owner.trim() !== "") {
                        additionalInfo += `<p>${owner}</p>`;
                    }
                }
            }

            var infoContent = `
                <p>Koordinaten: ${x} / ${y}</p>
                <p>Gemeinde: ${parsedData.gemeinde.displayValue}</p>
                <p>Adresse: ${parsedData.adresse.displayValue}</p>
                <p>Höhe: ${parsedData.hoehe.displayValue}</p>
                <p>Parzellennummer: ${parcelNumber}</p>
                <p>Fläche: ${parsedData.parzelle.area} ${areaUnit}</p>
                <br>
                ${additionalInfo}
            `;

            console.log("Popup Content:", infoContent);

            popup
                .setLatLng(e.latlng)
                .setContent(infoContent)
                .openOn(map);
        })
        .catch(error => {
            console.error('Error fetching location info:', error);
            popup
                .setLatLng(e.latlng)
                .setContent("Failed to load location information. " + error.message)
                .openOn(map);
        });
}

map.on('click', onMapClick);
