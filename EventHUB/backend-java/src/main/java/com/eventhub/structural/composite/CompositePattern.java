// DESIGN PATTERN: Composite (Structural)
package com.eventhub.structural.composite;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: Composite (Structural)
public class CompositePattern {

    // DESIGN PATTERN: Composite (Structural)
    public interface AgendaComponent {
        String getName();
        int getDurationMinutes();
        void printTree(String indent, List<String> out);
    }

    // DESIGN PATTERN: Composite (Structural)
    static class SessionLeaf implements AgendaComponent {
        private final String name;
        private final int minutes;

        SessionLeaf(String name, int minutes) {
            this.name = name;
            this.minutes = minutes;
        }

        public String getName() { return name; }
        public int getDurationMinutes() { return minutes; }
        public void printTree(String indent, List<String> out) {
            out.add(indent + "- Sesiune: " + name + " (" + minutes + " min)");
        }
    }

    // DESIGN PATTERN: Composite (Structural)
    static class AgendaTrack implements AgendaComponent {
        private final String name;
        private final List<AgendaComponent> children = new ArrayList<>();

        AgendaTrack(String name) { this.name = name; }
        public void add(AgendaComponent item) { children.add(item); }
        public String getName() { return name; }

        public int getDurationMinutes() {
            int total = 0;
            for (AgendaComponent c : children) total += c.getDurationMinutes();
            return total;
        }

        public void printTree(String indent, List<String> out) {
            out.add(indent + "+ Track: " + name + " [Total: " + getDurationMinutes() + " min]");
            for (AgendaComponent c : children) c.printTree(indent + "   ", out);
        }
    }

    // DESIGN PATTERN: Composite (Structural)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String extraSession = (input == null || input.isBlank()) ? "Workshop Microservicii:60" : input.trim();
        String[] parts = extraSession.split(":", 2);
        String customName = parts[0].trim();
        int customMin = 45;
        if (parts.length > 1) {
            try { customMin = Integer.parseInt(parts[1].trim()); } catch (NumberFormatException ignored) {}
        }

        AgendaTrack fullEvent = new AgendaTrack("Ziua 1 - EventHub Conf");
        AgendaTrack morningTrack = new AgendaTrack("Sesiuni Dimineață");
        morningTrack.add(new SessionLeaf("Keynote Deschidere", 45));
        morningTrack.add(new SessionLeaf("Arhitectură Java Modernă", 50));

        AgendaTrack afternoonTrack = new AgendaTrack("Sesiuni După-Amiază");
        afternoonTrack.add(new SessionLeaf(customName, customMin));
        afternoonTrack.add(new SessionLeaf("Networking & Q&A", 30));

        fullEvent.add(morningTrack);
        fullEvent.add(afternoonTrack);

        logs.add("[Composite] Structură ierarhică a agendei tratată uniform (sesiuni + track-uri):");
        fullEvent.printTree("", logs);
        logs.add("[Composite] Durată totală calculată recursiv: " + fullEvent.getDurationMinutes() + " minute.");
        return logs;
    }
}
