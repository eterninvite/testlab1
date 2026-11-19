// DESIGN PATTERN: Builder (Creational)
package com.eventhub.creational.builder;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: Builder (Creational)
public class BuilderPattern {

    // DESIGN PATTERN: Builder (Creational)
    public static class EventPlan {
        private final String name;
        private final String hall;
        private final int capacity;
        private final boolean catering;
        private final boolean livestream;

        private EventPlan(EventBuilder builder) {
            this.name = builder.name;
            this.hall = builder.hall;
            this.capacity = builder.capacity;
            this.catering = builder.catering;
            this.livestream = builder.livestream;
        }

        public String summary() {
            return "Eveniment '" + name + "' | Sală: " + hall + " (" + capacity + " locuri)"
                    + " | Catering: " + (catering ? "Da" : "Nu")
                    + " | Livestream: " + (livestream ? "Da" : "Nu");
        }
    }

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
        public EventBuilder withCatering(boolean catering) { this.catering = catering; return this; }
        public EventBuilder withLivestream(boolean livestream) { this.livestream = livestream; return this; }
        public EventPlan build() { return new EventPlan(this); }
    }

    // DESIGN PATTERN: Builder (Creational)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String raw = (input == null || input.isBlank()) ? "TechDays 2026 | Aula Magna | 350 | catering,livestream" : input.trim();
        String[] parts = raw.split("\\|");

        String name = parts.length > 0 && !parts[0].isBlank() ? parts[0].trim() : "TechDays 2026";
        String hall = parts.length > 1 && !parts[1].isBlank() ? parts[1].trim() : "Sala Mare";
        int capacity = 200;
        if (parts.length > 2) {
            try { capacity = Integer.parseInt(parts[2].trim()); } catch (NumberFormatException ignored) {}
        }
        String extras = parts.length > 3 ? parts[3].toLowerCase() : "";

        logs.add("[Builder] Inițializare EventBuilder pentru '" + name + "'.");
        EventBuilder builder = new EventBuilder(name).hall(hall).capacity(capacity);
        logs.add("[Builder] Configurat sală: " + hall + ", capacitate: " + capacity + ".");

        if (extras.contains("catering")) {
            builder.withCatering(true);
            logs.add("[Builder] Adăugat pas opțional: Catering.");
        }
        if (extras.contains("livestream")) {
            builder.withLivestream(true);
            logs.add("[Builder] Adăugat pas opțional: Livestream HD.");
        }

        EventPlan plan = builder.build();
        logs.add("[Builder] Obiect final construit -> " + plan.summary());
        return logs;
    }
}
