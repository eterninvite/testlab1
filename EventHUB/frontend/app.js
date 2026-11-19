// EventHub Frontend — 12 Design Patterns (fără Singleton)
// Rulează prin Backend Java (/api/run) și are fallback client-side complet pentru GitHub Pages.

const PATTERNS = [
  // ===================== CREATIONAL (4) =====================
  {
    id: "factory-method",
    name: "Factory Method",
    category: "Creational",
    packagePath: "com.eventhub.creational.factorymethod.FactoryMethodPattern",
    shortDesc: "Crearea tipurilor de evenimente (Conferință, Concert, Workshop) fără cuplare directă.",
    purpose:
      "În EventHub, organizatorii creează tipuri diferite de evenimente (conferințe, concerte, workshop-uri), fiecare cu pregătire logistică specifică. Factory Method delegă instanțierea către subclase dedicate, eliminând blocurile lungi de if/else din codul client.",
    whenToUse: [
      "Când aplicația gestionează tipuri variate de evenimente și vrei să adaugi ușor tipuri noi (ex: Hackathon, Târg).",
      "Când logica generală de organizare este comună, dar obiectul concret creat diferă.",
      "Când vrei să decuplezi codul care folosește evenimentul de clasele concrete."
    ],
    whenToAvoid: [
      "Când ai un singur tip fix de eveniment care nu se va extinde.",
      "Când introducerea mai multor clase Creator adaugă complexitate inutilă pentru un obiect banal."
    ],
    inputHint: "Format: tip:titlu (ex: conferinta:Java Summit 2026, concert:Rock Night, workshop:Docker Lab)",
    defaultInput: "conferinta:Java Summit 2026",
    presets: [
      "conferinta:Java Summit 2026",
      "concert:Summer Jazz Fest",
      "workshop:Clean Code Lab"
    ],
    javaCode: `// DESIGN PATTERN: Factory Method (Creational)
package com.eventhub.creational.factorymethod;

// DESIGN PATTERN: Factory Method (Creational)
public interface EventItem {
    String getType();
    String prepareDetails();
}

// DESIGN PATTERN: Factory Method (Creational)
abstract class EventCreator {
    protected abstract EventItem createEvent(String title);

    public String organize(String title) {
        EventItem event = createEvent(title);
        return "[" + event.getType() + "] " + event.prepareDetails();
    }
}

// DESIGN PATTERN: Factory Method (Creational)
class ConferenceCreator extends EventCreator {
    protected EventItem createEvent(String title) {
        return new ConferenceEvent(title);
    }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim() || "conferinta:Java Summit 2026";
      const [rawType, ...rest] = raw.split(":");
      const type = (rawType || "").trim().toLowerCase();
      const title = rest.join(":").trim() || "EventHub Live";
      const logs = [
        `[Factory Method] Solicitare creare eveniment de tip '${type}' cu titlul '${title}'.`
      ];
      if (type.includes("concert")) {
        logs.push("[Factory Method] Selectat creator concret: ConcertCreator.");
        logs.push(`[Factory Method] Rezultat: [Concert] Concertul '${title}' -> Sistem sonorizare, lumini scenă, brățări acces, pază.`);
      } else if (type.includes("workshop")) {
        logs.push("[Factory Method] Selectat creator concret: WorkshopCreator.");
        logs.push(`[Factory Method] Rezultat: [Workshop] Workshop-ul '${title}' -> Sală 30 locuri, mese de lucru, prize, materiale tipărite.`);
      } else {
        logs.push("[Factory Method] Selectat creator concret: ConferenceCreator.");
        logs.push(`[Factory Method] Rezultat: [Conferință] Conferința '${title}' -> Scenă principală, microfoane, proiector 4K, ecusoane speakeri.`);
      }
      return logs;
    }
  },
  {
    id: "abstract-factory",
    name: "Abstract Factory",
    category: "Creational",
    packagePath: "com.eventhub.creational.abstractfactory.AbstractFactoryPattern",
    shortDesc: "Generarea de familii compatibile de bilete și ecusoane (VIP vs. Standard).",
    purpose:
      "Un participant VIP trebuie să primească atât un bilet VIP (cu acces Lounge), cât și un ecuson metalic compatibil, în timp ce un participant Standard primește bilet Standard și ecuson cu QR. Abstract Factory garantează că toate elementele kit-ului aparțin aceleiași familii.",
    whenToUse: [
      "Când trebuie să creezi familii de obiecte corelate (bilet + ecuson + brățară) care trebuie să se potrivească între ele.",
      "Când vrei să schimbi întregul pachet (VIP, Standard, Speaker) schimbând o singură fabrică."
    ],
    whenToAvoid: [
      "Când creezi un singur produs independent (Factory Method este suficient).",
      "Când adaugi foarte des noi tipuri de produse în interfața fabricii (necesită modificarea tuturor fabricilor)."
    ],
    inputHint: "Format: pachet:nume_participant (ex: vip:Andrei Popescu sau standard:Ioana Marin)",
    defaultInput: "vip:Andrei Popescu",
    presets: ["vip:Andrei Popescu", "standard:Ioana Marin"],
    javaCode: `// DESIGN PATTERN: Abstract Factory (Creational)
package com.eventhub.creational.abstractfactory;

// DESIGN PATTERN: Abstract Factory (Creational)
public interface EventKitFactory {
    Ticket createTicket(String guestName);
    Badge createBadge(String guestName);
}

// DESIGN PATTERN: Abstract Factory (Creational)
class VipKitFactory implements EventKitFactory {
    public Ticket createTicket(String guestName) {
        return () -> "Bilet VIP (Rândul 1 + Lounge) pentru " + guestName;
    }
    public Badge createBadge(String guestName) {
        return () -> "Ecuson metalic auriu + șnur personalizat pentru " + guestName;
    }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim() || "vip:Andrei Popescu";
      const [rawTier, ...rest] = raw.split(":");
      const isVip = (rawTier || "").trim().toLowerCase().includes("vip");
      const guest = rest.join(":").trim() || "Participant EventHub";
      return [
        `[Abstract Factory] Pachet selectat: ${isVip ? "VIP" : "Standard"}.`,
        `[Abstract Factory] Bilet generat -> ${
          isVip
            ? `Bilet VIP (Rândul 1 + Lounge) pentru ${guest}`
            : `Bilet Standard (Acces General) pentru ${guest}`
        }`,
        `[Abstract Factory] Ecuson generat -> ${
          isVip
            ? `Ecuson metalic auriu + șnur personalizat pentru ${guest}`
            : `Ecuson carton reciclat + QR code pentru ${guest}`
        }`,
        "[Abstract Factory] Familia de obiecte (bilet + ecuson) este 100% compatibilă."
      ];
    }
  },
  {
    id: "builder",
    name: "Builder",
    category: "Creational",
    packagePath: "com.eventhub.creational.builder.BuilderPattern",
    shortDesc: "Construirea pas cu pas a unui eveniment cu opțiuni (sală, capacitate, catering, livestream).",
    purpose:
      "Configurarea unui eveniment implică numeroși parametri opționali (sală, capacitate, catering, livestream, traducere). Builder elimină constructorii cu 8-10 parametri greu de citit și permite construirea fluentă, clară și imutabilă a obiectului EventPlan.",
    whenToUse: [
      "Când un obiect de domeniu (EventPlan, Order) are mulți parametri opționali.",
      "Când vrei obiecte imutabile și cod ușor de citit cu apeluri înlănțuite (.hall().capacity().build())."
    ],
    whenToAvoid: [
      "Pentru clase simple cu 2-3 câmpuri obligatorii.",
      "Când codul extra al clasei Builder nu aduce claritate suplimentară."
    ],
    inputHint: "Format: Nume | Sală | Capacitate | extra (catering,livestream)",
    defaultInput: "TechDays 2026 | Aula Magna | 350 | catering,livestream",
    presets: [
      "TechDays 2026 | Aula Magna | 350 | catering,livestream",
      "Meetup Java | Sala Studio | 80 | livestream",
      "Gala Premii | Grand Ballroom | 500 | catering"
    ],
    javaCode: `// DESIGN PATTERN: Builder (Creational)
package com.eventhub.creational.builder;

// DESIGN PATTERN: Builder (Creational)
public static class EventBuilder {
    private final String name;
    private String hall = "Sala Mare";
    private int capacity = 100;
    private boolean catering = false;
    private boolean livestream = false;

    public EventBuilder(String name) { this.name = name; }
    public EventBuilder hall(String hall) { this.hall = hall; return this; }
    public EventBuilder capacity(int capacity) { this.capacity = capacity; return this; }
    public EventBuilder withCatering(boolean c) { this.catering = c; return this; }
    public EventBuilder withLivestream(boolean l) { this.livestream = l; return this; }
    public EventPlan build() { return new EventPlan(this); }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim() || "TechDays 2026 | Aula Magna | 350 | catering,livestream";
      const parts = raw.split("|");
      const name = (parts[0] || "").trim() || "TechDays 2026";
      const hall = (parts[1] || "").trim() || "Sala Mare";
      const parsedCap = parseInt((parts[2] || "").trim(), 10);
      const capacity = Number.isNaN(parsedCap) ? 200 : parsedCap;
      const extras = (parts[3] || "").toLowerCase();
      const catering = extras.includes("catering");
      const livestream = extras.includes("livestream");

      const logs = [
        `[Builder] Inițializare EventBuilder pentru '${name}'.`,
        `[Builder] Configurat sală: ${hall}, capacitate: ${capacity}.`
      ];
      if (catering) logs.push("[Builder] Adăugat pas opțional: Catering.");
      if (livestream) logs.push("[Builder] Adăugat pas opțional: Livestream HD.");
      logs.push(
        `[Builder] Obiect final construit -> Eveniment '${name}' | Sală: ${hall} (${capacity} locuri) | Catering: ${
          catering ? "Da" : "Nu"
        } | Livestream: ${livestream ? "Da" : "Nu"}`
      );
      return logs;
    }
  },
  {
    id: "prototype",
    name: "Prototype",
    category: "Creational",
    packagePath: "com.eventhub.creational.prototype.PrototypePattern",
    shortDesc: "Clonarea rapidă a unui șablon de eveniment pentru ediții noi în alte orașe.",
    purpose:
      "Când organizezi același format de conferință în mai multe orașe, reconfigurarea de la zero a agendei și setărilor este repetitivă. Prototype clonează un șablon existent (deep copy) și modifică doar orașul și data, păstrând șablonul original intact.",
    whenToUse: [
      "Când vrei să duplici șabloane de evenimente, ecusoane sau agende preconfigurate.",
      "Când crearea obiectului de la zero este costisitoare sau implică multe date implicite."
    ],
    whenToAvoid: [
      "Când obiectele au grafuri complexe cu referințe circulare greu de clonat în profunzime.",
      "Când un constructor simplu de copiere rezolvă mai clar nevoia."
    ],
    inputHint: "Format: Oraș Nou | Dată Nouă (ex: Cluj-Napoca | 15 Noiembrie 2026)",
    defaultInput: "Cluj-Napoca | 15 Noiembrie 2026",
    presets: [
      "Cluj-Napoca | 15 Noiembrie 2026",
      "Timișoara | 22 Ianuarie 2027",
      "Iași | 05 Martie 2027"
    ],
    javaCode: `// DESIGN PATTERN: Prototype (Creational)
package com.eventhub.creational.prototype;

// DESIGN PATTERN: Prototype (Creational)
public static class EventTemplate implements Cloneable {
    private String title, city, date;
    private final List<String> defaultSessions;

    @Override
    public EventTemplate clone() {
        return new EventTemplate(
            this.title, this.city, this.date,
            new ArrayList<>(this.defaultSessions)
        );
    }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim() || "Cluj-Napoca | 15 Noiembrie 2026";
      const parts = raw.split("|");
      const newCity = (parts[0] || "").trim() || "Cluj-Napoca";
      const newDate = (parts[1] || "").trim() || "15 Noiembrie 2026";
      const sessions = "Keynote, Workshop Cloud, Panel Q&A";
      return [
        `[Prototype] Șablon original: EventHub DevConf @ București (10 Octombrie 2026) | Sesiuni: ${sessions}`,
        `[Prototype] Clonă nouă personalizată: EventHub DevConf @ ${newCity} (${newDate}) | Sesiuni: ${sessions}`,
        "[Prototype] Șablonul original a rămas neschimbat (București)."
      ];
    }
  },

  // ===================== STRUCTURAL (4) =====================
  {
    id: "adapter",
    name: "Adapter",
    category: "Structural",
    packagePath: "com.eventhub.structural.adapter.AdapterPattern",
    shortDesc: "Integrarea unui sistem vechi de ticketing extern în interfața modernă EventHub.",
    purpose:
      "EventHub folosește o interfață modernă pentru emiterea biletelor (nume, cod eveniment, preț în RON), dar trebuie să comunice cu un sistem extern vechi care acceptă doar format CSV și sume în bani/cenți. Adapter traduce apelurile fără a modifica sistemul vechi sau codul EventHub.",
    whenToUse: [
      "Când integrezi API-uri externe, gateway-uri de plată sau sisteme legacy cu semnături incompatibile.",
      "Când nu poți sau nu vrei să modifici codul sursă al bibliotecii externe."
    ],
    whenToAvoid: [
      "Când controlezi ambele părți ale codului și poți alinia direct interfețele.",
      "Când ajungi să pui adaptoare peste alte adaptoare în lanț."
    ],
    inputHint: "Format: Participant | Cod Eveniment | Preț RON",
    defaultInput: "Elena Radu | CONF-2026 | 150",
    presets: [
      "Elena Radu | CONF-2026 | 150",
      "Mihai Stan | ROCK-99 | 249.5",
      "Ana Dobre | WKSP-12 | 90"
    ],
    javaCode: `// DESIGN PATTERN: Adapter (Structural)
package com.eventhub.structural.adapter;

// DESIGN PATTERN: Adapter (Structural)
public interface ModernTicketGateway {
    String issueTicket(String guestName, String eventCode, double priceRon);
}

// DESIGN PATTERN: Adapter (Structural)
class LegacyBookingAdapter implements ModernTicketGateway {
    private final LegacyBookingSystem legacySystem;

    public String issueTicket(String guestName, String eventCode, double priceRon) {
        String csv = eventCode.toUpperCase() + ";" + guestName;
        int cents = (int) Math.round(priceRon * 100);
        return legacySystem.bookOldFormat(csv, cents);
    }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim() || "Elena Radu | CONF-2026 | 150";
      const parts = raw.split("|");
      const guest = (parts[0] || "").trim() || "Elena Radu";
      const code = (parts[1] || "").trim() || "CONF-2026";
      const parsedPrice = parseFloat((parts[2] || "").trim());
      const price = Number.isNaN(parsedPrice) ? 150.0 : parsedPrice;
      const cents = Math.round(price * 100);
      return [
        "[Adapter] EventHub apelează interfața modernă ModernTicketGateway.issueTicket(...).",
        `[Adapter] LegacyBookingAdapter traduce '${guest}', '${code}', ${price} RON în format CSV + bani.`,
        `[Adapter] Răspuns sistem extern adaptat -> LEGACY_OK[${code.toUpperCase()};${guest}|BANI=${cents}]`
      ];
    }
  },
  {
    id: "decorator",
    name: "Decorator",
    category: "Structural",
    packagePath: "com.eventhub.structural.decorator.DecoratorPattern",
    shortDesc: "Adăugarea dinamică de extraopțiuni la un bilet (Backstage, Cină, Materiale Workshop).",
    purpose:
      "Participanții pot combina liber extraopțiuni peste un bilet de bază (Backstage, Cină Networking, Kit Workshop). În loc să creăm zeci de subclase prin moștenire, Decorator împachetează dinamic biletul și adaugă prețul și descrierea fiecărei opțiuni.",
    whenToUse: [
      "Când vrei să combini dinamic responsabilități sau extraopțiuni la runtime.",
      "Când moștenirea ar duce la o explozie combinatorică de subclase."
    ],
    whenToAvoid: [
      "Când ordinea decoratorilor devine greu de urmărit sau depinde de detalii ascunse.",
      "Când există doar 1-2 opțiuni fixe care pot fi simple câmpuri booleene."
    ],
    inputHint: "Introdu extraopțiuni separate prin virgulă: backstage, dinner, kit",
    defaultInput: "backstage, dinner, kit",
    presets: ["backstage, dinner, kit", "dinner, kit", "backstage"],
    javaCode: `// DESIGN PATTERN: Decorator (Structural)
package com.eventhub.structural.decorator;

// DESIGN PATTERN: Decorator (Structural)
public interface EventTicket {
    String getDescription();
    double getPrice();
}

// DESIGN PATTERN: Decorator (Structural)
class BackstageDecorator extends TicketDecorator {
    BackstageDecorator(EventTicket wrapped) { super(wrapped); }
    public String getDescription() { return wrapped.getDescription() + " + Acces Backstage"; }
    public double getPrice() { return wrapped.getPrice() + 180.0; }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim().toLowerCase() || "backstage, dinner, kit";
      let desc = "Bilet Acces General";
      let price = 120.0;
      const logs = [`[Decorator] Bilet de bază: ${desc} (${price} RON).`];
      if (raw.includes("backstage")) {
        desc += " + Acces Backstage";
        price += 180.0;
        logs.push("[Decorator] + Împachetat cu BackstageDecorator (+180 RON).");
      }
      if (raw.includes("dinner") || raw.includes("cina")) {
        desc += " + Cină Networking";
        price += 95.0;
        logs.push("[Decorator] + Împachetat cu NetworkingDinnerDecorator (+95 RON).");
      }
      if (raw.includes("kit") || raw.includes("workshop")) {
        desc += " + Materiale Workshop";
        price += 55.0;
        logs.push("[Decorator] + Împachetat cu WorkshopKitDecorator (+55 RON).");
      }
      logs.push(`[Decorator] Bilet final: ${desc} | Total: ${price} RON.`);
      return logs;
    }
  },
  {
    id: "facade",
    name: "Facade",
    category: "Structural",
    packagePath: "com.eventhub.structural.facade.FacadePattern",
    shortDesc: "Unificarea publicării unui eveniment (sală + bilete + notificări) într-un singur apel.",
    purpose:
      "Publicarea unui eveniment presupune coordonarea mai multor subsisteme: rezervarea sălii, deschiderea vânzării de bilete și trimiterea notificărilor. Facade oferă o metodă simplă publishEvent(), ascunzând complexitatea internă față de interfața utilizator.",
    whenToUse: [
      "Când vrei o interfață simplificată pentru un flux care implică mai multe servicii interne.",
      "Când vrei să reduci dependențele directe dintre UI/controller și subsistemele de business."
    ],
    whenToAvoid: [
      "Nu transforma Facade într-un 'God Object' care conține toată logica aplicației.",
      "Nu ascunde operațiuni de care clienții avansați au nevoie granular, dacă nu există acces direct la servicii."
    ],
    inputHint: "Format: Nume Eveniment | Sală (ex: AI & Cloud Expo | Pavilionul Central)",
    defaultInput: "AI & Cloud Expo | Pavilionul Central",
    presets: [
      "AI & Cloud Expo | Pavilionul Central",
      "Festival Film | Cinema Arta"
    ],
    javaCode: `// DESIGN PATTERN: Facade (Structural)
package com.eventhub.structural.facade;

// DESIGN PATTERN: Facade (Structural)
public static class EventPublishFacade {
    private final VenueBookingService venue = new VenueBookingService();
    private final TicketingService ticketing = new TicketingService();
    private final NotificationService notifications = new NotificationService();

    public List<String> publishEvent(String eventName, String hall) {
        // Coordonează toate subsistemele printr-un singur apel simplu
        venue.reserveHall(hall);
        ticketing.openSales(eventName);
        notifications.announce(eventName);
        return steps;
    }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim() || "AI & Cloud Expo | Pavilionul Central";
      const parts = raw.split("|");
      const eventName = (parts[0] || "").trim() || "AI & Cloud Expo";
      const hall = (parts[1] || "").trim() || "Pavilionul Central";
      return [
        `[Facade] Apel unic: EventPublishFacade.publishEvent('${eventName}', '${hall}').`,
        `  1. Sala '${hall}' a fost rezervată și confirmată.`,
        `  2. Vânzarea biletelor pentru '${eventName}' a fost activată.`,
        `  3. Invitațiile și notificările push pentru '${eventName}' au fost trimise.`,
        `[Facade] Evenimentul '${eventName}' este live pe EventHub!`
      ];
    }
  },
  {
    id: "composite",
    name: "Composite",
    category: "Structural",
    packagePath: "com.eventhub.structural.composite.CompositePattern",
    shortDesc: "Structurarea ierarhică a agendei (Sesiuni individuale și Track-uri compuse).",
    purpose:
      "Agenda unei conferințe are o structură arborescentă: zile care conțin track-uri, iar acestea conțin sesiuni individuale. Composite tratează uniform o sesiune simplă și un track compus prin aceeași interfață AgendaComponent, calculând durata totală recursiv.",
    whenToUse: [
      "Când datele formează natural un arbore / ierarhie (agendă, categorii, pachete compuse).",
      "Când vrei să aplici aceeași operație (ex: calcul durată, afișare) atât pe frunze, cât și pe grupuri."
    ],
    whenToAvoid: [
      "Când structura nu este ierarhică (este doar o listă plată).",
      "Când operațiile diferă radical între elementele simple și cele compuse."
    ],
    inputHint: "Adaugă o sesiune personalizată în agendă -> Format: Nume Sesiune:Minute",
    defaultInput: "Workshop Microservicii:60",
    presets: [
      "Workshop Microservicii:60",
      "Demo Live Security:40",
      "Panel Startups:75"
    ],
    javaCode: `// DESIGN PATTERN: Composite (Structural)
package com.eventhub.structural.composite;

// DESIGN PATTERN: Composite (Structural)
public interface AgendaComponent {
    String getName();
    int getDurationMinutes();
    void printTree(String indent, List<String> out);
}

// DESIGN PATTERN: Composite (Structural)
class AgendaTrack implements AgendaComponent {
    private final List<AgendaComponent> children = new ArrayList<>();
    public int getDurationMinutes() {
        return children.stream().mapToInt(AgendaComponent::getDurationMinutes).sum();
    }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim() || "Workshop Microservicii:60";
      const [namePart, minPart] = raw.split(":");
      const customName = (namePart || "").trim() || "Workshop Microservicii";
      const parsedMin = parseInt((minPart || "").trim(), 10);
      const customMin = Number.isNaN(parsedMin) ? 45 : parsedMin;
      const morning = 45 + 50;
      const afternoon = customMin + 30;
      const total = morning + afternoon;
      return [
        "[Composite] Structură ierarhică a agendei tratată uniform (sesiuni + track-uri):",
        `+ Track: Ziua 1 - EventHub Conf [Total: ${total} min]`,
        `   + Track: Sesiuni Dimineață [Total: ${morning} min]`,
        "      - Sesiune: Keynote Deschidere (45 min)",
        "      - Sesiune: Arhitectură Java Modernă (50 min)",
        `   + Track: Sesiuni După-Amiază [Total: ${afternoon} min]`,
        `      - Sesiune: ${customName} (${customMin} min)`,
        "      - Sesiune: Networking & Q&A (30 min)",
        `[Composite] Durată totală calculată recursiv: ${total} minute.`
      ];
    }
  },

  // ===================== BEHAVIORAL (4) =====================
  {
    id: "strategy",
    name: "Strategy",
    category: "Behavioral",
    packagePath: "com.eventhub.behavioral.strategy.StrategyPattern",
    shortDesc: "Calculul dinamic al prețului biletelor (Early Bird, Student, Grup, VIP).",
    purpose:
      "Regulile de tarifare ale biletelor se schimbă frecvent (reduceri Early Bird, Student, Grup 5+, tarif VIP). Strategy încapsulează fiecare algoritm de calcul într-o clasă separată, permițând schimbarea strategiei la runtime fără a modifica TicketPriceCalculator.",
    whenToUse: [
      "Când ai mai multe variante ale unui algoritm (tarifare, sortare, filtrare, validare) interschimbabile la runtime.",
      "Când vrei să înlocuiești blocuri mari de if/switch bazate pe tipul reducerii."
    ],
    whenToAvoid: [
      "Când ai un singur algoritm care nu se va schimba.",
      "Când clienții trebuie să cunoască diferențe prea intime între strategii."
    ],
    inputHint: "Format: strategie:pret_baza (earlybird, student, grup, vip)",
    defaultInput: "earlybird:200",
    presets: ["earlybird:200", "student:200", "grup:200", "vip:200"],
    javaCode: `// DESIGN PATTERN: Strategy (Behavioral)
package com.eventhub.behavioral.strategy;

// DESIGN PATTERN: Strategy (Behavioral)
public interface PricingStrategy {
    String getName();
    double calculate(double basePrice);
}

// DESIGN PATTERN: Strategy (Behavioral)
class TicketPriceCalculator {
    private PricingStrategy strategy;
    TicketPriceCalculator(PricingStrategy strategy) { this.strategy = strategy; }
    public double compute(double basePrice) { return strategy.calculate(basePrice); }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim() || "earlybird:200";
      const [keyRaw, priceRaw] = raw.split(":");
      const key = (keyRaw || "").trim().toLowerCase();
      const parsed = parseFloat((priceRaw || "").trim());
      const basePrice = Number.isNaN(parsed) ? 200.0 : parsed;

      let name = "Early Bird (-25%)";
      let mult = 0.75;
      if (key.includes("student")) {
        name = "Student (-40%)";
        mult = 0.6;
      } else if (key.includes("grup") || key.includes("group")) {
        name = "Grup 5+ (-20%)";
        mult = 0.8;
      } else if (key.includes("vip")) {
        name = "VIP (+50%)";
        mult = 1.5;
      }

      const finalPrice = (basePrice * mult).toFixed(2);
      return [
        `[Strategy] Preț de bază bilet: ${basePrice} RON.`,
        `[Strategy] Strategie injectată la runtime: ${name}.`,
        `[Strategy] Tarif final calculat: ${finalPrice} RON.`
      ];
    }
  },
  {
    id: "observer",
    name: "Observer",
    category: "Behavioral",
    packagePath: "com.eventhub.behavioral.observer.ObserverPattern",
    shortDesc: "Notificarea automată a participanților (Email, SMS, Push) la schimbarea agendei.",
    purpose:
      "Când organizatorul mută o sesiune în altă sală sau schimbă ora, toți participanții abonați trebuie anunțați instant pe canalele lor preferate (Email, SMS, Push). Observer decuplează sursa modificării de canalele de notificare.",
    whenToUse: [
      "Când modificarea stării unui obiect trebuie să notifice automat un număr dinamic de alți obiecte/abonați.",
      "Când vrei să adaugi canale noi de notificare (ex: Slack, WhatsApp) fără să modifici subiectul."
    ],
    whenToAvoid: [
      "Când lanțurile de notificări devin greu de depanat sau produc bucle.",
      "Când ordinea exactă a notificării între observatori este critică."
    ],
    inputHint: "Introdu mesajul de modificare a agendei care va fi transmis abonaților:",
    defaultInput: "Sesiunea 'Java 21' s-a mutat în Sala B la ora 14:30",
    presets: [
      "Sesiunea 'Java 21' s-a mutat în Sala B la ora 14:30",
      "Pauza de cafea începe în 10 minute în Foyer"
    ],
    javaCode: `// DESIGN PATTERN: Observer (Behavioral)
package com.eventhub.behavioral.observer;

// DESIGN PATTERN: Observer (Behavioral)
public interface EventSubscriber {
    String notifyUpdate(String message);
}

// DESIGN PATTERN: Observer (Behavioral)
class EventScheduleTopic {
    private final List<EventSubscriber> subscribers = new ArrayList<>();
    public void subscribe(EventSubscriber s) { subscribers.add(s); }

    public List<String> publishChange(String updateMessage) {
        return subscribers.stream()
            .map(s -> s.notifyUpdate(updateMessage))
            .toList();
    }
}`,
    fallbackRun(input) {
      const update = (input || "").trim() || "Sesiunea 'Java 21' s-a mutat în Sala B la ora 14:30";
      return [
        "[Observer] 3 abonați înregistrați pe canalul de modificări agendă.",
        `[Observer] Publicare actualizare: "${update}"`,
        `  -> [Email -> maria.ionescu@eventhub.ro] ${update}`,
        `  -> [SMS -> +40 722 000 111] ${update}`,
        `  -> [Push App -> @alex_dev] ${update}`,
        "[Observer] Toți observatorii au fost notificați automat fără cuplare directă."
      ];
    }
  },
  {
    id: "command",
    name: "Command",
    category: "Behavioral",
    packagePath: "com.eventhub.behavioral.command.CommandPattern",
    shortDesc: "Încapsularea rezervărilor de locuri cu suport pentru istoric și anulare (Undo).",
    purpose:
      "La rezervarea locurilor dintr-o sală, operatorul sau utilizatorul poate greși și are nevoie de Undo rapid sau de jurnalizarea operațiunilor. Command transformă fiecare rezervare într-un obiect independent cu metodele execute() și undo().",
    whenToUse: [
      "Când ai nevoie de Undo/Redo, cozi de execuție sau audit/istoric al acțiunilor.",
      "Când vrei să decuplezi butonul/apelantul de logica efectivă de rezervare."
    ],
    whenToAvoid: [
      "Pentru apeluri simple, directe, care nu necesită istoric, cozi sau anulare.",
      "Când creează prea multe clase mici pentru acțiuni banale."
    ],
    inputHint: "Secvență de locuri și comenzi 'undo' separate prin virgulă (ex: A1, A2, undo, B5)",
    defaultInput: "A1, A2, undo, B5",
    presets: ["A1, A2, undo, B5", "C10, C11, C12, undo, undo", "VIP1, undo, undo"],
    javaCode: `// DESIGN PATTERN: Command (Behavioral)
package com.eventhub.behavioral.command;

// DESIGN PATTERN: Command (Behavioral)
public interface SeatCommand {
    String execute();
    String undo();
}

// DESIGN PATTERN: Command (Behavioral)
class ReserveSeatCommand implements SeatCommand {
    private final HallSeating hall;
    private final String seat;

    public String execute() { return hall.reserve(seat); }
    public String undo() { return hall.release(seat); }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim() || "A1, A2, undo, B5";
      const tokens = raw.split(",").map((s) => s.trim()).filter(Boolean);
      const reserved = [];
      const history = [];
      const logs = [`[Command] Procesare secvență comenzi de rezervare locuri: ${raw}`];

      for (const cmd of tokens) {
        if (cmd.toLowerCase() === "undo") {
          if (history.length > 0) {
            const lastSeat = history.pop();
            const idx = reserved.lastIndexOf(lastSeat);
            if (idx >= 0) reserved.splice(idx, 1);
            logs.push(`  [UNDO] Locul ${lastSeat} a fost ELIBERAT (Undo). Locuri ocupate: [${reserved.join(", ")}]`);
          } else {
            logs.push("  [UNDO] Istoricul de comenzi este gol.");
          }
        } else {
          const seat = cmd.toUpperCase();
          reserved.push(seat);
          history.push(seat);
          logs.push(`  [EXEC] Locul ${seat} a fost REZERVAT. Locuri ocupate: [${reserved.join(", ")}]`);
        }
      }
      logs.push(`[Command] Total comenzi rămase în istoric: ${history.length}.`);
      return logs;
    }
  },
  {
    id: "state",
    name: "State",
    category: "Behavioral",
    packagePath: "com.eventhub.behavioral.state.StatePattern",
    shortDesc: "Gestionarea ciclului de viață al unui eveniment (Draft → Published → Ongoing → Completed).",
    purpose:
      "Un eveniment trece prin stări clare (DRAFT, PUBLISHED, ONGOING, COMPLETED, CANCELLED), iar acțiunile permise diferă în fiecare stare (ex: un eveniment ONGOING nu poate fi anulat direct). State mută logica fiecărei stări în clase proprii, eliminând condițiile imbricate.",
    whenToUse: [
      "Când comportamentul unui obiect depinde puternic de starea sa curentă și are tranziții bine definite.",
      "Când vrei să elimini blocurile masive de if/switch pe un enum de stare."
    ],
    whenToAvoid: [
      "Când obiectul are doar 2 stări banale (ex: activ/inactiv) fără reguli complexe de tranziție.",
      "Când stările se schimbă rar și nu justifică clase separate."
    ],
    inputHint: "Secvență de acțiuni separate prin virgulă: next, cancel",
    defaultInput: "next, next, cancel, next",
    presets: [
      "next, next, cancel, next",
      "next, cancel, next",
      "next, next, next, next"
    ],
    javaCode: `// DESIGN PATTERN: State (Behavioral)
package com.eventhub.behavioral.state;

// DESIGN PATTERN: State (Behavioral)
public interface EventLifecycleState {
    String getName();
    String next(EventContext ctx);
    String cancel(EventContext ctx);
}

// DESIGN PATTERN: State (Behavioral)
class PublishedState implements EventLifecycleState {
    public String getName() { return "PUBLISHED"; }
    public String next(EventContext ctx) {
        ctx.setState(new OngoingState());
        return "Tranziție PUBLISHED -> ONGOING (check-in activ).";
    }
    public String cancel(EventContext ctx) {
        ctx.setState(new CancelledState());
        return "Tranziție PUBLISHED -> CANCELLED (notificare rambursare bilete).";
    }
}`,
    fallbackRun(input) {
      const raw = (input || "").trim().toLowerCase() || "next, next, cancel, next";
      const actions = raw.split(",").map((s) => s.trim()).filter(Boolean);
      let state = "DRAFT";
      const logs = [`[State] Stare inițială eveniment: ${state}.`];

      for (const act of actions) {
        const isCancel = act.includes("cancel") || act.includes("anuleaza");
        if (isCancel) {
          if (state === "DRAFT") {
            state = "CANCELLED";
            logs.push("  [Acțiune: cancel] -> Tranziție DRAFT -> CANCELLED (eveniment anulat înainte de publicare).");
          } else if (state === "PUBLISHED") {
            state = "CANCELLED";
            logs.push("  [Acțiune: cancel] -> Tranziție PUBLISHED -> CANCELLED (notificare rambursare bilete).");
          } else if (state === "ONGOING") {
            logs.push("  [Acțiune: cancel] -> Acțiune respinsă: un eveniment ONGOING nu poate fi anulat direct.");
          } else if (state === "COMPLETED") {
            logs.push("  [Acțiune: cancel] -> Acțiune respinsă: evenimentul este deja COMPLETED.");
          } else {
            logs.push("  [Acțiune: cancel] -> Evenimentul este deja CANCELLED.");
          }
        } else {
          if (state === "DRAFT") {
            state = "PUBLISHED";
            logs.push("  [Acțiune: next] -> Tranziție DRAFT -> PUBLISHED (vânzarea biletelor este deschisă).");
          } else if (state === "PUBLISHED") {
            state = "ONGOING";
            logs.push("  [Acțiune: next] -> Tranziție PUBLISHED -> ONGOING (check-in activ, eveniment în desfășurare).");
          } else if (state === "ONGOING") {
            state = "COMPLETED";
            logs.push("  [Acțiune: next] -> Tranziție ONGOING -> COMPLETED (eveniment încheiat, feedback trimis).");
          } else if (state === "COMPLETED") {
            logs.push("  [Acțiune: next] -> Evenimentul este deja COMPLETED (stare finală).");
          } else {
            logs.push("  [Acțiune: next] -> Acțiune respinsă: evenimentul este CANCELLED.");
          }
        }
      }
      logs.push(`[State] Stare finală eveniment: ${state}.`);
      return logs;
    }
  }
];

// ===================== STATE & DOM =====================
let activeCategory = "all";
let searchQuery = "";
let selectedPatternId = PATTERNS[0].id;
let javaBackendAvailable = false;

const els = {
  backendStatus: document.getElementById("backendStatus"),
  filterButtons: document.querySelectorAll(".filter-btn"),
  searchInput: document.getElementById("searchInput"),
  visibleCount: document.getElementById("visibleCount"),
  patternList: document.getElementById("patternList"),
  detailCategory: document.getElementById("detailCategory"),
  detailTitle: document.getElementById("detailTitle"),
  detailPackage: document.getElementById("detailPackage"),
  detailPurpose: document.getElementById("detailPurpose"),
  detailWhenToUse: document.getElementById("detailWhenToUse"),
  detailWhenToAvoid: document.getElementById("detailWhenToAvoid"),
  detailInputHint: document.getElementById("detailInputHint"),
  presetButtons: document.getElementById("presetButtons"),
  patternInput: document.getElementById("patternInput"),
  runBtn: document.getElementById("runBtn"),
  runModeTag: document.getElementById("runModeTag"),
  outputConsole: document.getElementById("outputConsole"),
  clearLogsBtn: document.getElementById("clearLogsBtn"),
  detailCode: document.getElementById("detailCode"),
  copyCodeBtn: document.getElementById("copyCodeBtn")
};

// Detectează dacă serverul Java (/api/health) este activ
async function checkBackendHealth() {
  if (window.location.protocol === "file:") {
    setBackendStatus(false);
    return;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const res = await fetch("/api/health", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      setBackendStatus(data && data.status === "ok");
      return;
    }
  } catch (_) {
    // Fallback static (ex: GitHub Pages)
  }
  setBackendStatus(false);
}

function setBackendStatus(isLive) {
  javaBackendAvailable = isLive;
  if (isLive) {
    els.backendStatus.className = "status-badge status-live";
    els.backendStatus.innerHTML = '<span class="dot"></span> Backend Java Live (/api/run)';
  } else {
    els.backendStatus.className = "status-badge status-fallback";
    els.backendStatus.innerHTML = '<span class="dot"></span> Mod Static / GitHub Pages (Fallback Client-Side)';
  }
}

function getFilteredPatterns() {
  const q = searchQuery.trim().toLowerCase();
  return PATTERNS.filter((p) => {
    const matchesCat = activeCategory === "all" || p.category === activeCategory;
    if (!matchesCat) return false;
    if (!q) return true;
    const haystack = `${p.name} ${p.category} ${p.shortDesc} ${p.purpose} ${p.packagePath}`.toLowerCase();
    return haystack.includes(q);
  });
}

function renderPatternList() {
  const filtered = getFilteredPatterns();
  els.visibleCount.textContent = `${filtered.length} afișate`;
  els.patternList.innerHTML = "";

  if (filtered.length === 0) {
    els.patternList.innerHTML = '<div class="empty-state">Niciun design pattern găsit pentru filtrul curent.</div>';
    return;
  }

  filtered.forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `pattern-item${p.id === selectedPatternId ? " selected" : ""}`;
    btn.innerHTML = `
      <div class="pattern-item-top">
        <span class="pattern-item-name">${p.name}</span>
        <span class="category-tag cat-${p.category}">${p.category}</span>
      </div>
      <p class="pattern-item-desc">${p.shortDesc}</p>
    `;
    btn.addEventListener("click", () => {
      selectedPatternId = p.id;
      renderPatternList();
      renderDetail(p);
    });
    els.patternList.appendChild(btn);
  });
}

function renderDetail(pattern) {
  els.detailCategory.textContent = pattern.category;
  els.detailCategory.className = `category-tag cat-${pattern.category}`;
  els.detailTitle.textContent = pattern.name;
  els.detailPackage.textContent = `Pachet Java: ${pattern.packagePath}`;
  els.detailPurpose.textContent = pattern.purpose;

  els.detailWhenToUse.innerHTML = pattern.whenToUse.map((item) => `<li>${item}</li>`).join("");
  els.detailWhenToAvoid.innerHTML = pattern.whenToAvoid.map((item) => `<li>${item}</li>`).join("");

  els.detailInputHint.textContent = pattern.inputHint;
  els.patternInput.value = pattern.defaultInput;

  els.presetButtons.innerHTML = "";
  pattern.presets.forEach((preset) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "preset-chip";
    chip.textContent = preset;
    chip.addEventListener("click", () => {
      els.patternInput.value = preset;
      runCurrentPattern();
    });
    els.presetButtons.appendChild(chip);
  });

  els.detailCode.textContent = pattern.javaCode;
  els.runModeTag.textContent = "Pregătit";
  els.outputConsole.textContent = `Apasă „Rulează exemplul” pentru a testa pattern-ul ${pattern.name}.`;
}

async function runCurrentPattern() {
  const pattern = PATTERNS.find((p) => p.id === selectedPatternId);
  if (!pattern) return;

  const input = els.patternInput.value;
  els.runBtn.disabled = true;
  els.outputConsole.textContent = "Se execută...";

  if (javaBackendAvailable) {
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern: pattern.id, input })
      });
      if (res.ok) {
        const data = await res.json();
        els.runModeTag.textContent = "Executat în Backend Java";
        els.outputConsole.textContent = (data.logs || []).join("\n");
        els.runBtn.disabled = false;
        return;
      }
    } catch (_) {
      setBackendStatus(false);
    }
  }

  // Fallback client-side (fără erori pe GitHub Pages / deschidere statică)
  const logs = pattern.fallbackRun(input);
  els.runModeTag.textContent = "Fallback Client-Side (Mod Static)";
  els.outputConsole.textContent = logs.join("\n");
  els.runBtn.disabled = false;
}

// ===================== EVENT LISTENERS =====================
els.filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    els.filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    renderPatternList();
  });
});

els.searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderPatternList();
});

els.runBtn.addEventListener("click", runCurrentPattern);

els.patternInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runCurrentPattern();
});

els.clearLogsBtn.addEventListener("click", () => {
  els.outputConsole.textContent = "Consolă curățată.";
});

els.copyCodeBtn.addEventListener("click", async () => {
  const text = els.detailCode.textContent;
  try {
    await navigator.clipboard.writeText(text);
    els.copyCodeBtn.textContent = "Copiat!";
    setTimeout(() => (els.copyCodeBtn.textContent = "Copiază codul"), 1400);
  } catch (_) {
    els.copyCodeBtn.textContent = "Selectează manual";
    setTimeout(() => (els.copyCodeBtn.textContent = "Copiază codul"), 1400);
  }
});

// Init
renderPatternList();
renderDetail(PATTERNS[0]);
checkBackendHealth();
