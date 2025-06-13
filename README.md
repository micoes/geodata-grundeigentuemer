# Geodata Grundeigentuemer
Die vorliegende Applikation ermöglicht die Abfrage von Grundeigentümern anhand einer interaktiven Kartenansicht.

## Einführung
Um Grundeigentümer von Parzellen abzufragen, können Nutzer entweder direkt auf eine Parzelle klicken oder im Suchfeld einen Grundeigentümer eingeben, um alle ihm zugehörigen Parzellen anzuzeigen. 

## Verwendung
1. **Start des lokalen Servers**  
   Um die Applikation lokal auszuführen und Cross-Origin Resource Sharing (CORS) zu ermöglichen, ist ein lokaler HTTP-Server erforderlich.
   - Beispiel mit Python
     - Python (Version 3): py -m http.server 8000
     - Python (Version 2): py -m SimpleHTTPServer 8000
   - Dadurch wird die Anwendung unter `http://localhost:8000` bereitgestellt.

3. **Navigation innerhalb der Anwendung**  
- Die Hauptseite enthält eine interaktive Karte, die Parzelleninformationen anzeigt.  
- Nutzer können zwischen **Farbdarstellung** (`index_color.html`) und **Graustufenkarte** (`index_grey.html`) wechseln.  
- Ein Suchfeld ermöglicht die Auswahl eines Grundeigentümers, wodurch alle Parzellen, an denen dieser beteiligt ist, markiert werden.

3. **Datenstruktur**  
- Die Parzellendaten sind in der Datei `kataster.json` im Ordner `data` hinterlegt.  
- Die Skripte zur Funktionalität (Klick-Events, Suche, Sortierung und Kartenwechsel) befinden sich im Ordner `script`.  
- Die visuellen Stile sind in `style.css` im Ordner `css` definiert.  
- Icons und Bilder sind im Ordner `image` gespeichert.

## Limitierungen
- Diese Applikation basiert auf öffentlich zugänglichen Datenquellen und enthält keine Echtzeit-Updates zu Eigentumsverhältnissen.  
- Die Genauigkeit der Standortinformationen hängt von der externen API sowie den bereitgestellten Koordinaten ab.  
- Die Applikation wurde für den lokalen Gebrauch konzipiert. Eine Online-Bereitstellung erfordert weitere Anpassungen zur Serverkonfiguration und CORS-Umgehung.  
- Die WebSocket-Verbindung (`server.py`) wird zur Verwaltung der Serveraktivität genutzt, jedoch setzt eine vollständige Nutzung spezifische Laufzeitvoraussetzungen voraus.
