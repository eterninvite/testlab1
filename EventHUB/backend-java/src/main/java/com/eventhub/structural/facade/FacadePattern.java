// DESIGN PATTERN: Facade (Structural)
package com.eventhub.structural.facade;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: Facade (Structural)
public class FacadePattern {

    // DESIGN PATTERN: Facade (Structural)
    static class VenueBookingService {
        String reserveHall(String hall) { return "Sala '" + hall + "' a fost rezervată și confirmată."; }
    }

    // DESIGN PATTERN: Facade (Structural)
    static class TicketingService {
        String openSales(String eventName) { return "Vânzarea biletelor pentru '" + eventName + "' a fost activată."; }
    }

    // DESIGN PATTERN: Facade (Structural)
    static class NotificationService {
        String announce(String eventName) { return "Invitațiile și notificările push pentru '" + eventName + "' au fost trimise."; }
    }

    // DESIGN PATTERN: Facade (Structural)
    public static class EventPublishFacade {
        private final VenueBookingService venue = new VenueBookingService();
        private final TicketingService ticketing = new TicketingService();
        private final NotificationService notifications = new NotificationService();

        public List<String> publishEvent(String eventName, String hall) {
            List<String> steps = new ArrayList<>();
            steps.add("[Facade] Apel unic: EventPublishFacade.publishEvent('" + eventName + "', '" + hall + "').");
            steps.add("  1. " + venue.reserveHall(hall));
            steps.add("  2. " + ticketing.openSales(eventName));
            steps.add("  3. " + notifications.announce(eventName));
            steps.add("[Facade] Evenimentul '" + eventName + "' este live pe EventHub!");
            return steps;
        }
    }

    // DESIGN PATTERN: Facade (Structural)
    public static List<String> run(String input) {
        String raw = (input == null || input.isBlank()) ? "AI & Cloud Expo | Pavilionul Central" : input.trim();
        String[] parts = raw.split("\\|");
        String eventName = parts.length > 0 && !parts[0].isBlank() ? parts[0].trim() : "AI & Cloud Expo";
        String hall = parts.length > 1 && !parts[1].isBlank() ? parts[1].trim() : "Pavilionul Central";

        EventPublishFacade facade = new EventPublishFacade();
        return facade.publishEvent(eventName, hall);
    }
}
