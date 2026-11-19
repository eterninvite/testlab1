// DESIGN PATTERN: Prototype (Creational)
package com.eventhub.creational.prototype;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: Prototype (Creational)
public class PrototypePattern {

    // DESIGN PATTERN: Prototype (Creational)
    public static class EventTemplate implements Cloneable {
        private String title;
        private String city;
        private String date;
        private final List<String> defaultSessions;

        public EventTemplate(String title, String city, String date, List<String> sessions) {
            this.title = title;
            this.city = city;
            this.date = date;
            this.defaultSessions = new ArrayList<>(sessions);
        }

        public void setCity(String city) { this.city = city; }
        public void setDate(String date) { this.date = date; }

        @Override
        public EventTemplate clone() {
            return new EventTemplate(this.title, this.city, this.date, new ArrayList<>(this.defaultSessions));
        }

        public String describe() {
            return title + " @ " + city + " (" + date + ") | Sesiuni: " + String.join(", ", defaultSessions);
        }
    }

    // DESIGN PATTERN: Prototype (Creational)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String raw = (input == null || input.isBlank()) ? "Cluj-Napoca | 15 Noiembrie 2026" : input.trim();
        String[] parts = raw.split("\\|");
        String newCity = parts.length > 0 && !parts[0].isBlank() ? parts[0].trim() : "Cluj-Napoca";
        String newDate = parts.length > 1 && !parts[1].isBlank() ? parts[1].trim() : "15 Noiembrie 2026";

        EventTemplate original = new EventTemplate(
                "EventHub DevConf",
                "București",
                "10 Octombrie 2026",
                List.of("Keynote", "Workshop Cloud", "Panel Q&A")
        );
        logs.add("[Prototype] Șablon original: " + original.describe());

        EventTemplate cloned = original.clone();
        cloned.setCity(newCity);
        cloned.setDate(newDate);
        logs.add("[Prototype] Clonă nouă personalizată: " + cloned.describe());
        logs.add("[Prototype] Șablonul original a rămas neschimbat (" + original.city + ").");
        return logs;
    }
}
