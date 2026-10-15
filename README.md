# Kulturkreis Bösel | Saterland | Friesoythe

Eine statische Website ohne Backend oder zusätzliche Build-Abhängigkeiten. Im Repository waren zunächst keine Seiten, Veranstaltungsdaten oder Vereins-/Kontaktdaten vorhanden; bis zur Ergänzung durch den Betreiber zeigt die Website deshalb keine erfundenen Inhalte an. Die Referenzwebsite war während der Umsetzung nicht abrufbar.

## Lokal starten

Voraussetzung ist Python 3 oder ein anderer einfacher HTTP-Server. Im Projektverzeichnis:

```sh
python3 -m http.server 8000
```

Anschließend <http://localhost:8000> öffnen. Ein HTTP-Server ist erforderlich, damit der Browser `events.json` laden kann.

## Veranstaltungen und EVENTIM.Light

Veranstaltungen zentral in [`events.json`](events.json) als JSON-Array pflegen. Unterstützte Felder:

| Feld | Zweck |
| --- | --- |
| `title` | Titel |
| `date` | Datum im ISO-Format `YYYY-MM-DD` |
| `time` | Uhrzeit, z. B. `20:00` |
| `venue` | Veranstaltungsort |
| `description` | Beschreibung |
| `image` | Relativer Bildpfad innerhalb dieses Repositories |
| `imageAlt` | Optionaler Alternativtext zum Bild |
| `category` | Optionale Kategorie |
| `ticketUrl` | Verifizierte HTTPS-URL zum EVENTIM.Light-Shop oder zum konkreten Event |
| `presalePrice` | Optionaler Vorverkaufspreis in Euro, als Zahl (z. B. `15` oder `12.5`, wird als „15,00 €“ angezeigt) oder als Text (z. B. `"ermäßigt 10 €"`) |
| `boxOfficePrice` | Optionaler Preis an der Abendkasse, gleiches Format wie `presalePrice`. Leere oder fehlende Preise werden nicht angezeigt |
| `status` | Optionaler, manuell gepflegter Status, z. B. „Ausverkauft“ oder „Abgesagt“ |

Beispiel für einen **zu ersetzenden Datensatz** (keine echten Veranstaltungsdaten oder Ticketadresse):

```json
[
  {
    "title": "Veranstaltungstitel ergänzen",
    "date": "JJJJ-MM-TT",
    "time": "Uhrzeit ergänzen",
    "venue": "Veranstaltungsort ergänzen",
    "description": "Beschreibung ergänzen",
    "image": "",
    "category": "",
    "presalePrice": "",
    "boxOfficePrice": "",
    "ticketUrl": "",
    "status": ""
  }
]
```

Vor der Veröffentlichung alle Beispieldaten durch bestätigte Informationen ersetzen. Ohne `ticketUrl` wird kein Ticketbutton angezeigt; es wird keine EVENTIM.Light-URL erfunden. Die Website bindet weder EVENTIM-Skripte noch iFrames ein. Der Ticketkauf, die Zahlungsabwicklung und die Ticketausstellung verbleiben beim externen Anbieter. Ein accountbezogener Einbettungscode oder API-Zugang wurde nicht bereitgestellt; beides wird daher nicht vorausgesetzt.

## GitHub Pages veröffentlichen

Der Workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) veröffentlicht die Dateien aus dem Repository-Root direkt über GitHub Pages. Es gibt keinen Build-Schritt. Nach dem Push auf `main` (oder einem manuellen Workflow-Start):

1. Repository-Einstellungen → **Pages** öffnen und als Quelle **GitHub Actions** auswählen.
2. Im Actions-Tab den Workflow **Deploy to GitHub Pages** prüfen.
3. Die bereitgestellte `github.io`-Adresse im Pages-Bereich öffnen.

Bei einem anderen Standardbranch den Push-Filter in `pages.yml` anpassen. Alle Asset- und Datenpfade sind relativ gehalten, damit sie sowohl an der Domainwurzel als auch unter einer GitHub-Pages-Projektadresse funktionieren. Die Website hat keine Unterseiten-Routen und benötigt daher keine Rewrite-Regeln.

## STRATO-Domain und HTTPS

Eine konkrete Domain ist nicht angegeben; daher ist keine `CNAME`-Datei mit erfundenem oder beispielhaftem Domainnamen enthalten.

1. Zuerst die Domain in den GitHub-Kontoeinstellungen verifizieren, um eine mögliche Domainübernahme zu verhindern.
2. Im Repository unter **Settings → Pages → Custom domain** die echte gewünschte Domain (z. B. `www.<ihre-domain>`) eintragen und speichern, **bevor** DNS-Einträge gesetzt werden. Bei einer Projektseite wird die Domain hier am Repository konfiguriert, nicht als Projektpfad.
3. Unter STRATO in den DNS-Einstellungen für `www` einen **CNAME** auf `jenderalex.github.io` setzen. Für die Domain ohne `www` (Apex/root, meist Host `@`) je einen **A-Record** auf `185.199.108.153`, `185.199.109.153`, `185.199.110.153` und `185.199.111.153` setzen. Optional kann IPv6 mit den vier GitHub-**AAAA-Records** eingerichtet werden (siehe offizielle Anleitung). Standard- oder widersprüchliche Apex-Einträge entfernen; keine Wildcard-DNS-Einträge verwenden.
4. DNS kann bis zu 24 Stunden zur Verteilung benötigen. Nach erfolgreicher DNS-Prüfung **Enforce HTTPS** aktivieren; GitHub kann bis zu 24 Stunden für das Zertifikat benötigen.
5. Falls die Domain geändert wird, GitHub Pages die Domainzuordnung aktualisieren lassen. Bei diesem Actions-Deployment wird keine `CNAME`-Datei erzeugt oder benötigt; GitHub verwaltet die Domain über die Repository-Einstellungen.

Offizielle Details: [GitHub Pages: custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) und [STRATO: DNS-Einstellungen](https://www.strato.de/faq/domains/).

## Vor dem Livegang

- Reale Vereins-, Kontakt- und Veranstaltungsinformationen ergänzen; sie sind im Repository nicht vorhanden.
- Verifizierte EVENTIM.Light-Shop- oder Event-URLs sowie rechtmäßig verwendbare Bilder eintragen.
- Die endgültige Domain in GitHub Pages einrichten und die STRATO-DNS-Ziele anhand der GitHub-Anleitung kontrollieren.
- Rechtliche Angaben wie Impressum und Datenschutzhinweise prüfen und bereitstellen.
