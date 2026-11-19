// DESIGN PATTERN: Adapter (Structural)
package com.eventhub.structural.adapter;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: Adapter (Structural)
public class AdapterPattern {

    // DESIGN PATTERN: Adapter (Structural)
    public interface ModernTicketGateway {
        String issueTicket(String guestName, String eventCode, double priceRon);
    }

    // DESIGN PATTERN: Adapter (Structural)
    static class LegacyBookingSystem {
        // Sistem vechi cu semnătură incompatibilă (preț în bani/cenți și format CSV)
        public String bookOldFormat(String csvPayload, int amountInCents) {
            return "LEGACY_OK[" + csvPayload + "|BANI=" + amountInCents + "]";
        }
    }

    // DESIGN PATTERN: Adapter (Structural)
    static class LegacyBookingAdapter implements ModernTicketGateway {
        private final LegacyBookingSystem legacySystem;

        LegacyBookingAdapter(LegacyBookingSystem legacySystem) {
            this.legacySystem = legacySystem;
        }

        @Override
        public String issueTicket(String guestName, String eventCode, double priceRon) {
            String csv = eventCode.toUpperCase() + ";" + guestName;
            int cents = (int) Math.round(priceRon * 100);
            return legacySystem.bookOldFormat(csv, cents);
        }
    }

    // DESIGN PATTERN: Adapter (Structural)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String raw = (input == null || input.isBlank()) ? "Elena Radu | CONF-2026 | 150" : input.trim();
        String[] parts = raw.split("\\|");

        String guest = parts.length > 0 && !parts[0].isBlank() ? parts[0].trim() : "Elena Radu";
        String code = parts.length > 1 && !parts[1].isBlank() ? parts[1].trim() : "CONF-2026";
        double price = 150.0;
        if (parts.length > 2) {
            try { price = Double.parseDouble(parts[2].trim()); } catch (NumberFormatException ignored) {}
        }

        ModernTicketGateway gateway = new LegacyBookingAdapter(new LegacyBookingSystem());
        logs.add("[Adapter] EventHub apelează interfața modernă ModernTicketGateway.issueTicket(...).");
        logs.add("[Adapter] LegacyBookingAdapter traduce '" + guest + "', '" + code + "', " + price + " RON în format CSV + bani.");

        String legacyResponse = gateway.issueTicket(guest, code, price);
        logs.add("[Adapter] Răspuns sistem extern adaptat -> " + legacyResponse);
        return logs;
    }
}
