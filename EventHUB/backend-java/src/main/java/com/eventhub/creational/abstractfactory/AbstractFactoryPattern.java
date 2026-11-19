// DESIGN PATTERN: Abstract Factory (Creational)
package com.eventhub.creational.abstractfactory;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: Abstract Factory (Creational)
public class AbstractFactoryPattern {

    // DESIGN PATTERN: Abstract Factory (Creational)
    public interface Ticket {
        String getInfo();
    }

    // DESIGN PATTERN: Abstract Factory (Creational)
    public interface Badge {
        String getMaterial();
    }

    // DESIGN PATTERN: Abstract Factory (Creational)
    public interface EventKitFactory {
        Ticket createTicket(String guestName);
        Badge createBadge(String guestName);
    }

    // DESIGN PATTERN: Abstract Factory (Creational)
    static class VipKitFactory implements EventKitFactory {
        public Ticket createTicket(String guestName) {
            return () -> "Bilet VIP (Rândul 1 + Lounge) pentru " + guestName;
        }
        public Badge createBadge(String guestName) {
            return () -> "Ecuson metalic auriu + șnur personalizat pentru " + guestName;
        }
    }

    // DESIGN PATTERN: Abstract Factory (Creational)
    static class StandardKitFactory implements EventKitFactory {
        public Ticket createTicket(String guestName) {
            return () -> "Bilet Standard (Acces General) pentru " + guestName;
        }
        public Badge createBadge(String guestName) {
            return () -> "Ecuson carton reciclat + QR code pentru " + guestName;
        }
    }

    // DESIGN PATTERN: Abstract Factory (Creational)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String raw = (input == null || input.isBlank()) ? "vip:Andrei Popescu" : input.trim();
        String[] parts = raw.split(":", 2);
        String tier = parts[0].trim().toLowerCase();
        String guest = (parts.length > 1 && !parts[1].isBlank()) ? parts[1].trim() : "Participant EventHub";

        EventKitFactory factory = tier.contains("vip") ? new VipKitFactory() : new StandardKitFactory();
        logs.add("[Abstract Factory] Pachet selectat: " + (tier.contains("vip") ? "VIP" : "Standard") + ".");

        Ticket ticket = factory.createTicket(guest);
        Badge badge = factory.createBadge(guest);

        logs.add("[Abstract Factory] Bilet generat -> " + ticket.getInfo());
        logs.add("[Abstract Factory] Ecuson generat -> " + badge.getMaterial());
        logs.add("[Abstract Factory] Familia de obiecte (bilet + ecuson) este 100% compatibilă.");
        return logs;
    }
}
