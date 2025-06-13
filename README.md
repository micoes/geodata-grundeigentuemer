# Geodata Grundeigentümer
Die vorliegende Applikation ermöglicht die Abfrage von Grundeigentümern anhand einer interaktiven Kartenansicht. Aus Gründen des Datenschutzes wurden die jeweiligen Grundeigentümer anonymisiert. Die Applikation wurde am Beispiel der Gemeinde Gansingen umgesetzt, lässt sich allerdings auf eine oder mehrere beliebige Gemeinde(n) des Kantons Aargaus anwenden (vgl. Limitation).

![index-color_abfrage](https://github.com/user-attachments/assets/5e53f8bd-d83d-4ff7-9938-50f6ef611b4d)

## Einführung
Um Grundeigentümer von Parzellen abzufragen, können Nutzer entweder direkt auf eine Parzelle klicken oder im Suchfeld einen Grundeigentümer eingeben, um alle ihm zugehörigen Parzellen anzuzeigen. 

## Verwendung
### 1. Start des lokalen Servers
   Um die Applikation lokal auszuführen und Cross-Origin Resource Sharing (CORS) zu ermöglichen, ist ein lokaler HTTP-Server erforderlich.
   - Öffne ein Terminal oder eine Eingabeaufforderung in dem Verzeichnis, das deine HTML-Datei enthält.
   - Starte den Server mit folgendem Befehl (Beispiel mit Python):
     - Python (Version 3): py -m http.server 8000
     - Python (Version 2): py -m SimpleHTTPServer 8000
   - Die Anwendung ist unter `http://localhost:8000/index_color.html` bzw. `http://localhost:8000/index_grey.html` aufrufbar.

### 2. Navigation innerhalb der Anwendung
Die Applikation umfasst eine interaktive Karte, die Parzelleninformationen bereitstellt.

![index-color_zoom](https://github.com/user-attachments/assets/e1c22929-565e-418a-b9ad-835675e4add1)


Nutzer können zwischen dem aktuellsten **Luftbild (Orthofoto)** `index_color.html` und der **Landeskarte in grau** `index_grey.html` mit AV-Daten wechseln.

![index-grey_zoom](https://github.com/user-attachments/assets/24bb00fc-dc89-478e-9a3f-53b9401ba1be)


Ein Suchfeld ermöglicht die Auswahl eines Grundeigentümers, wodurch Parzellen, an denen dieser beteiligt ist, markiert werden.

![index-grey_zoom_search](https://github.com/user-attachments/assets/7e10ff05-362a-40be-b976-c1f5e24792c3)


### 3. Datenstruktur
- Die Parzellendaten sind in der Datei `kataster.json` im Ordner `data` hinterlegt.
- Die Skripte zur Funktionalität (Klick-Events, Suche, Sortierung und Kartenwechsel) befinden sich im Ordner `script`.  
- Die visuellen Stile sind in `style.css` im Ordner `css` definiert.  
- Icons und Bilder sind im Ordner `image` gespeichert.

## Limitation
- Diese Applikation basiert auf öffentlich zugänglichen Datenquellen und enthält keine Echtzeit-Updates zu Eigentumsverhältnissen.
  - Die Applikation wurde am Beispiel der Gemeinde Gansingen umgesetzt, lässt sich allerdings auf eine oder mehrere beliebige Gemeinde(n) des Kantons Aargaus anwenden. Dazu muss die Datei `kataster.json` mit den Eigentümerangaben zu den Parzellen der gewünschten Gemeinde erweitert werden.
  - Der initiale Kartenausschnitt stellt andererseits die Gemeinde Gansingen dar und kann innerhalb von `index_color.html` bzw. `index_grey.html` in Zeile 31 via Längs- und Breitengrad definiert werden.
- Die Genauigkeit der Standortinformationen hängt von der externen API sowie den bereitgestellten Koordinaten ab.  
- Die Applikation wurde für den lokalen Gebrauch konzipiert. Eine Online-Bereitstellung erfordert weitere Anpassungen zur Serverkonfiguration und CORS-Umgehung.  
- Die WebSocket-Verbindung (`server.py`) wird zur Verwaltung der Serveraktivität genutzt, jedoch setzt eine vollständige Nutzung spezifische Laufzeitvoraussetzungen voraus.
