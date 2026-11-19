// DESIGN PATTERN: Factory Method (Creational)
package com.eventhub.creational.factorymethod;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: Factory Method (Creational)
public class FactoryMethodPattern {

    // DESIGN PATTERN: Factory Method (Creational)
    public interface EventItem {
        String getType();
        String prepareDetails();
    }

    // DESIGN PATTERN: Factory Method (Creational)
    static class ConferenceEvent implements EventItem {
        private final String title;
        ConferenceEvent(String title) { this.title = title; }
        public String getType() { return "Conferință"; }
        public String prepareDetails() {
            return "Conferința '" + title + "' -> Scenă principală, microfoane, proiector 4K, ecusoane speakeri.";
        }
    }

    // DESIGN PATTERN: Factory Method (Creational)
    static class ConcertEvent implements EventItem {
        private final String title;
        ConcertEvent(String title) { this.title = title; }
        public String getType() { return "Concert"; }
        public String prepareDetails() {
            return "Concertul '" + title + "' -> Sistem sonorizare, lumini scenă, brățări acces, pază.";
        }
    }

    // DESIGN PATTERN: Factory Method (Creational)
    static class WorkshopEvent implements EventItem {
        private final String title;
        WorkshopEvent(String title) { this.title = title; }
        public String getType() { return "Workshop"; }
        public String prepareDetails() {
            return "Workshop-ul '" + title + "' -> Sală 30 locuri, mese de lucru, prize, materiale tipărite.";
        }
    }

    // DESIGN PATTERN: Factory Method (Creational)
    static abstract class EventCreator {
        // Metoda factory suprascrisă de subclase
        protected abstract EventItem createEvent(String title);

        public String organize(String title) {
            EventItem event = createEvent(title);
            return "[" + event.getType() + "] " + event.prepareDetails();
        }
    }

    // DESIGN PATTERN: Factory Method (Creational)
    static class ConferenceCreator extends EventCreator {
        protected EventItem createEvent(String title) { return new ConferenceEvent(title); }
    }

    // DESIGN PATTERN: Factory Method (Creational)
    static class ConcertCreator extends EventCreator {
        protected EventItem createEvent(String title) { return new ConcertEvent(title); }
    }

    // DESIGN PATTERN: Factory Method (Creational)
    static class WorkshopCreator extends EventCreator {
        protected EventItem createEvent(String title) { return new WorkshopEvent(title); }
    }

    // DESIGN PATTERN: Factory Method (Creational)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String raw = (input == null || input.isBlank()) ? "conferinta:Java Summit 2026" : input.trim();
        String[] parts = raw.split(":", 2);
        String type = parts[0].trim().toLowerCase();
        String title = (parts.length > 1 && !parts[1].isBlank()) ? parts[1].trim() : "EventHub Live";

        logs.add("[Factory Method] Solicitare creare eveniment de tip '" + type + "' cu titlul '" + title + "'.");

        EventCreator creator;
        if (type.contains("concert")) {
            creator = new ConcertCreator();
            logs.add("[Factory Method] Selectat creator concret: ConcertCreator.");
        } else if (type.contains("workshop")) {
            creator = new WorkshopCreator();
            logs.add("[Factory Method] Selectat creator concret: WorkshopCreator.");
        } else {
            creator = new ConferenceCreator();
            logs.add("[Factory Method] Selectat creator concret: ConferenceCreator.");
        }

        String result = creator.organize(title);
        logs.add("[Factory Method] Rezultat: " + result);
        return logs;
    }
}
