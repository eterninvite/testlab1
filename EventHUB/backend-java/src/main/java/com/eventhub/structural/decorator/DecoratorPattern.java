// DESIGN PATTERN: Decorator (Structural)
package com.eventhub.structural.decorator;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: Decorator (Structural)
public class DecoratorPattern {

    // DESIGN PATTERN: Decorator (Structural)
    public interface EventTicket {
        String getDescription();
        double getPrice();
    }

    // DESIGN PATTERN: Decorator (Structural)
    static class BaseTicket implements EventTicket {
        public String getDescription() { return "Bilet Acces General"; }
        public double getPrice() { return 120.0; }
    }

    // DESIGN PATTERN: Decorator (Structural)
    static abstract class TicketDecorator implements EventTicket {
        protected final EventTicket wrapped;
        TicketDecorator(EventTicket wrapped) { this.wrapped = wrapped; }
    }

    // DESIGN PATTERN: Decorator (Structural)
    static class BackstageDecorator extends TicketDecorator {
        BackstageDecorator(EventTicket wrapped) { super(wrapped); }
        public String getDescription() { return wrapped.getDescription() + " + Acces Backstage"; }
        public double getPrice() { return wrapped.getPrice() + 180.0; }
    }

    // DESIGN PATTERN: Decorator (Structural)
    static class NetworkingDinnerDecorator extends TicketDecorator {
        NetworkingDinnerDecorator(EventTicket wrapped) { super(wrapped); }
        public String getDescription() { return wrapped.getDescription() + " + Cină Networking"; }
        public double getPrice() { return wrapped.getPrice() + 95.0; }
    }

    // DESIGN PATTERN: Decorator (Structural)
    static class WorkshopKitDecorator extends TicketDecorator {
        WorkshopKitDecorator(EventTicket wrapped) { super(wrapped); }
        public String getDescription() { return wrapped.getDescription() + " + Materiale Workshop"; }
        public double getPrice() { return wrapped.getPrice() + 55.0; }
    }

    // DESIGN PATTERN: Decorator (Structural)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String raw = (input == null || input.isBlank()) ? "backstage, dinner, kit" : input.toLowerCase();

        EventTicket ticket = new BaseTicket();
        logs.add("[Decorator] Bilet de bază: " + ticket.getDescription() + " (" + ticket.getPrice() + " RON).");

        if (raw.contains("backstage")) {
            ticket = new BackstageDecorator(ticket);
            logs.add("[Decorator] + Împachetat cu BackstageDecorator (+180 RON).");
        }
        if (raw.contains("dinner") || raw.contains("cina")) {
            ticket = new NetworkingDinnerDecorator(ticket);
            logs.add("[Decorator] + Împachetat cu NetworkingDinnerDecorator (+95 RON).");
        }
        if (raw.contains("kit") || raw.contains("workshop")) {
            ticket = new WorkshopKitDecorator(ticket);
            logs.add("[Decorator] + Împachetat cu WorkshopKitDecorator (+55 RON).");
        }

        logs.add("[Decorator] Bilet final: " + ticket.getDescription() + " | Total: " + ticket.getPrice() + " RON.");
        return logs;
    }
}
