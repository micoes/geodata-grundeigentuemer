# Geodata Grundeigentümer
Die vorliegende Applikation ermöglicht die Abfrage von Grundeigentümern anhand einer interaktiven Kartenansicht. Aus Gründen des Datenschutzes wurden die hier verwendeten Grundeigentümer anonymisiert und dienen ausschliesslich zur Visualisierung. Die Applikation wurde am Beispiel der Gemeinde Gansingen umgesetzt, lässt sich allerdings auf eine oder mehrere beliebige Gemeinde(n) des Kantons Aargaus anwenden (vgl. [Anpassbarkeit](###-4.-Anpassbarkeit)).

![index-color_abfrage](https://github.com/user-attachments/assets/5e53f8bd-d83d-4ff7-9938-50f6ef611b4d)

## Einführung
Um Grundeigentümer von Parzellen abzufragen, können Nutzer auf eine Parzelle im Kartenausschnitt klicken oder im Suchfeld einen Grundeigentümer eingeben und anschliessend im Dropdown auswählen.

## Verwendung
### 1. Start des lokalen Servers
   Um die Applikation lokal auszuführen und Cross-Origin Resource Sharing (CORS) zu ermöglichen, ist ein lokaler HTTP-Server erforderlich.
   1.Terminal oder Eingabeaufforderung in Verzeichnis öffnen.
   2.Lokaler Server via einem der folgenden Befehle starten (Beispiel mit Python):
     *Python (Version 3): `py -m http.server 8000`
     *Python (Version 2): `py -m SimpleHTTPServer 8000`
   3.Die Anwendung ist unter `http://localhost:8000/index_color.html` bzw. `http://localhost:8000/index_grey.html` aufrufbar.

### 2. Navigation innerhalb der Anwendung
Die Applikation umfasst eine interaktive Karte, welche detaillierte Informationen zu Parzellen bereitstellt. Nutzer können dazu zwischen dem aktuellsten **Luftbild (Orthofoto)** `index_color.html` und der **Landeskarte in grau** `index_grey.html` mit AV-Daten wechseln.

![index-color_zoom](https://github.com/user-attachments/assets/e1c22929-565e-418a-b9ad-835675e4add1)

![index-grey_zoom](https://github.com/user-attachments/assets/24bb00fc-dc89-478e-9a3f-53b9401ba1be)


Das Suchfeld ermöglicht die Auswahl eines Grundeigentümers, wodurch sämtliche Parzellen, welche diesem gehören oder an denen er beteiligt ist,via Marker auf der Karte markiert werden (sofern innerhalb von `kataster.json` geführt). Der Zoom wird dazu durch die Anwendung jeweils so angepasst, dass die Marker vollständig im Kartenausschnitt liegen.

![index-grey_zoom_search](https://github.com/user-attachments/assets/7e10ff05-362a-40be-b976-c1f5e24792c3)


### 3. Datenstruktur
- Die Parzellendaten sind in der Datei `kataster.json` im Ordner `data` hinterlegt.
- Die Skripte zur Funktionalität (Klick-Events, Suche, Sortierung und Kartenwechsel) befinden sich im Ordner `script`.
- Die einzelnen Styles sind in `style.css` im Ordner `css` definiert.
- Icons und Bilder sind im Ordner `image` abgelegt.

### 4. Anpassbarkeit
- Kartenausschnitt
  - Der initial dargestellte Kartenausschnitt umfasst im Wesentlichen die Fläche der Gemeinde Gansingen und kann innerhalb von `index_color.html` bzw. `index_grey.html` in Zeile 31 via Längs- und Breitengrad individuell definiert werden.
- Grundeigentümer
  - Um Informationen zu Grundeigentümern hinterlegen und im Anschluss in der Anwendung abfragen zu können, kann die Datei `kataster.json` mit den Eigentümerangaben zu den Parzellen der gewünschten Gemeinde erweitert werden.
  - Dazu sind die bestehenden, anonymisierten Daten mit den gewünschten Daten zu ersetzen, wobei *Gemeinde*, *Parzellennummer* und *Grundeigentümer 1* zwingend notwendig sind.
  - Informationen zu Grundeigentum sind innerhalb des Kantons Aargau online grundsätzlich öffentlich einsehbar. Derzeit (Stand 16.06.2025) sind via [Onlinekarten Kanton Aargau (AGIS)](https://www.ag.ch/app/agisviewer4/v1/agisviewer.html) nach Registrierung pro Tag maximal 10 Grundeigentümer-Abfragen möglich.

## Limitation
- Diese Applikation basiert auf öffentlich zugänglichen Daten und enthält keine Echtzeit-Updates zu Eigentumsverhältnissen.
- Die Genauigkeit der Standortinformationen ist abhängig von den verwendeten API sowie den daraus bereitgestellten Koordinaten.
- Die Applikation wurde für den lokalen Gebrauch konzipiert; eine Online-Bereitstellung erfordert Anpassungen u.a. bezüglich Serverkonfiguration und CORS-Umgehung.
