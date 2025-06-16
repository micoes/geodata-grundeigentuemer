// Annahme: Deine Karte wird bereits in einer anderen Datei initialisiert.
// Daher wird der Initialisierungsteil der Karte hier entfernt.

document.getElementById('search-input').addEventListener('focus', function() {
    showAllOwners(); // Alle Grundeigentümer anzeigen
    document.getElementById('dropdown-container').style.display = 'block';
    document.getElementById('dropdown').style.display = 'block';

    // Sortierfunktion zurücksetzen
    document.getElementById('sort-dropdown').value = 'default';
});

document.getElementById('clear-search').addEventListener('click', function() {
    document.getElementById('search-input').value = '';
    document.getElementById('dropdown').innerHTML = '';
    document.getElementById('dropdown-container').style.display = 'none'; // Verstecke das Dropdown-Container-Element
    this.style.display = 'none'; // Verstecke den Clear-Button nach dem Klicken

    // Sortierfunktion zurücksetzen
    document.getElementById('sort-dropdown').value = 'default';
});

document.getElementById('sort-dropdown').addEventListener('change', function() {
    var sortBy = this.value;
    sortOwners(sortBy);
});

function showAllOwners() {
    var dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = '';

    var allOwners = [];
    for (var parcelNumber in parcelData) {
        for (var i = 1; i <= 7; i++) {
            var owner = parcelData[parcelNumber][`Grundeigentümer ${i}`];
            if (owner) {
                allOwners.push(owner);
            }
        }
    }
    var uniqueOwners = [...new Set(allOwners)];

    uniqueOwners.forEach(function(owner) {
        var div = document.createElement('div');
        div.textContent = owner;
        div.classList.add('dropdown-item');
        div.addEventListener('mousedown', function(event) {
            event.preventDefault(); // Verhindert, dass das Eingabefeld den Fokus verliert
            document.getElementById('search-input').value = owner;
            dropdown.innerHTML = '';
            highlightParcels(owner);
            document.getElementById('dropdown-container').style.display = 'none'; // Verstecke das Dropdown-Container-Element
        });
        dropdown.appendChild(div);
    });
}

function sortOwners(sortBy) {
    var query = document.getElementById('search-input').value.toLowerCase();
    var allOwners = [];
    for (var parcelNumber in parcelData) {
        for (var i = 1; i <= 7; i++) {
            var owner = parcelData[parcelNumber][`Grundeigentümer ${i}`];
            if (owner) {
                allOwners.push(owner);
            }
        }
    }
    var uniqueOwners = [...new Set(allOwners)];

    var sortedOwners = [];
    if (sortBy === 'area') {
        sortedOwners = uniqueOwners.map(owner => ({ owner, value: getTotalArea(owner), unit: 'm²' }))
                                   .sort((a, b) => b.value - a.value);
    } else if (sortBy === 'parcel') {
        sortedOwners = uniqueOwners.map(owner => ({ owner, value: getParcelCount(owner), unit: 'Parzellen' }))
                                   .sort((a, b) => b.value - a.value);
    }

    var dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = '';

    sortedOwners.filter(item => item.owner.toLowerCase().includes(query)).forEach(function(item) {
        var div = document.createElement('div');
        div.textContent = `${item.owner} (${item.value} ${item.unit})`;
        div.classList.add('dropdown-item');
        div.addEventListener('mousedown', function(event) {
            event.preventDefault(); // Verhindert, dass das Eingabefeld den Fokus verliert
            document.getElementById('search-input').value = item.owner;
            dropdown.innerHTML = '';
            highlightParcels(item.owner);
            document.getElementById('dropdown-container').style.display = 'none'; // Verstecke das Dropdown-Container-Element
        });
        dropdown.appendChild(div);
    });
}

function getTotalArea(owner) {
    var totalArea = 0;
    for (var key in parcelData) {
        for (var i = 1; i <= 7; i++) {
            if (parcelData[key][`Grundeigentümer ${i}`] === owner) {
                totalArea += parcelData[key].Fläche;
            }
        }
    }
    return totalArea;
}

function getParcelCount(owner) {
    var count = 0;
    for (var key in parcelData) {
        for (var i = 1; i <= 7; i++) {
            if (parcelData[key][`Grundeigentümer ${i}`] === owner) {
                count++;
                break;
            }
        }
    }
    return count;
}
