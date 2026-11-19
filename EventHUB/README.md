# EventHub — 12 Design Patterns în Managementul Evenimentelor (Java + Web)

Aplicație web interactivă și educativă dedicată **managementului evenimentelor** (conferințe, concerte, workshop-uri, bilete, ecusoane, săli, agendă, tarife, notificări, rezervări locuri), care demonstrează **12 design patterns software** în Java standard (**excluzând explicit Singleton**).

## Cele 12 Design Patterns incluse

| Categorie | Pattern | Scenariu în EventHub |
| :--- | :--- | :--- |
| **Creational** | Factory Method | Crearea tipurilor de evenimente (Conferință, Concert, Workshop) |
| **Creational** | Abstract Factory | Generarea kit-urilor compatibile Bilet + Ecuson (VIP vs. Standard) |
| **Creational** | Builder | Construirea pas cu pas a unui eveniment cu opțiuni (sală, capacitate, catering, livestream) |
| **Creational** | Prototype | Clonarea rapidă a unui șablon de conferință pentru alt oraș/dată |
| **Structural** | Adapter | Integrarea unui sistem extern vechi de bilete (CSV + bani) |
| **Structural** | Decorator | Adăugarea dinamică de extraopțiuni la bilet (Backstage, Cină, Materiale Workshop) |
| **Structural** | Facade | Publicarea completă a unui eveniment printr-un singur apel (sală + bilete + notificări) |
| **Structural** | Composite | Agenda ierarhică (Sesiuni individuale și Track-uri compuse cu calcul recursiv al duratei) |
| **Behavioral** | Strategy | Calculul dinamic al tarifului biletelor (Early Bird, Student, Grup, VIP) |
| **Behavioral** | Observer | Notificarea automată a participanților (Email, SMS, Push) la schimbări de agendă |
| **Behavioral** | Command | Rezervarea locurilor în sală cu istoric și anulare (Undo) |
| **Behavioral** | State | Ciclul de viață al evenimentului (`DRAFT` → `PUBLISHED` → `ONGOING` → `COMPLETED` / `CANCELLED`) |

## Structura proiectului

```text
EventHUB/
├── backend-java/src/main/java/com/eventhub/
│   ├── creational/{factorymethod,abstractfactory,builder,prototype}/
│   ├── structural/{adapter,decorator,facade,composite}/
│   ├── behavioral/{strategy,observer,command,state}/
│   └── server/EventPatternServer.java
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .devcontainer/devcontainer.json
├── .github/workflows/deploy.yml
└── Dockerfile
```

## Rulare locală (necesită JDK 17+)

### Windows (PowerShell)
```powershell
New-Item -ItemType Directory -Force backend-java/out | Out-Null
$files = Get-ChildItem -Recurse -Filter *.java backend-java/src/main/java | ForEach-Object { $_.FullName }
javac -encoding UTF-8 -d backend-java/out $files
java -cp backend-java/out com.eventhub.server.EventPatternServer
```

### Linux / macOS / Codespaces
```bash
mkdir -p backend-java/out
javac -encoding UTF-8 -d backend-java/out $(find backend-java/src/main/java -name "*.java")
java -cp backend-java/out com.eventhub.server.EventPatternServer
```

Deschide apoi `http://localhost:8080` în browser.
Dacă deschizi `frontend/index.html` static (ex. pe **GitHub Pages**), aplicația detectează automat lipsa serverului Java și folosește **fallback-ul client-side** fără erori.
