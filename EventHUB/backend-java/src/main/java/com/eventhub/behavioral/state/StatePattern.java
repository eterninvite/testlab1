// DESIGN PATTERN: State (Behavioral)
package com.eventhub.behavioral.state;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: State (Behavioral)
public class StatePattern {

    // DESIGN PATTERN: State (Behavioral)
    public interface EventLifecycleState {
        String getName();
        String next(EventContext ctx);
        String cancel(EventContext ctx);
    }

    // DESIGN PATTERN: State (Behavioral)
    static class EventContext {
        private EventLifecycleState state = new DraftState();
        public void setState(EventLifecycleState state) { this.state = state; }
        public String getStateName() { return state.getName(); }
        public String advance() { return state.next(this); }
        public String cancel() { return state.cancel(this); }
    }

    // DESIGN PATTERN: State (Behavioral)
    static class DraftState implements EventLifecycleState {
        public String getName() { return "DRAFT"; }
        public String next(EventContext ctx) {
            ctx.setState(new PublishedState());
            return "Tranziție DRAFT -> PUBLISHED (vânzarea biletelor este deschisă).";
        }
        public String cancel(EventContext ctx) {
            ctx.setState(new CancelledState());
            return "Tranziție DRAFT -> CANCELLED (eveniment anulat înainte de publicare).";
        }
    }

    // DESIGN PATTERN: State (Behavioral)
    static class PublishedState implements EventLifecycleState {
        public String getName() { return "PUBLISHED"; }
        public String next(EventContext ctx) {
            ctx.setState(new OngoingState());
            return "Tranziție PUBLISHED -> ONGOING (check-in activ, eveniment în desfășurare).";
        }
        public String cancel(EventContext ctx) {
            ctx.setState(new CancelledState());
            return "Tranziție PUBLISHED -> CANCELLED (notificare rambursare bilete).";
        }
    }

    // DESIGN PATTERN: State (Behavioral)
    static class OngoingState implements EventLifecycleState {
        public String getName() { return "ONGOING"; }
        public String next(EventContext ctx) {
            ctx.setState(new CompletedState());
            return "Tranziție ONGOING -> COMPLETED (eveniment încheiat, feedback trimis).";
        }
        public String cancel(EventContext ctx) {
            return "Acțiune respinsă: un eveniment ONGOING nu poate fi anulat direct.";
        }
    }

    // DESIGN PATTERN: State (Behavioral)
    static class CompletedState implements EventLifecycleState {
        public String getName() { return "COMPLETED"; }
        public String next(EventContext ctx) { return "Evenimentul este deja COMPLETED (stare finală)."; }
        public String cancel(EventContext ctx) { return "Acțiune respinsă: evenimentul este deja COMPLETED."; }
    }

    // DESIGN PATTERN: State (Behavioral)
    static class CancelledState implements EventLifecycleState {
        public String getName() { return "CANCELLED"; }
        public String next(EventContext ctx) { return "Acțiune respinsă: evenimentul este CANCELLED."; }
        public String cancel(EventContext ctx) { return "Evenimentul este deja CANCELLED."; }
    }

    // DESIGN PATTERN: State (Behavioral)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String raw = (input == null || input.isBlank()) ? "next, next, cancel, next" : input.toLowerCase();
        String[] actions = raw.split(",");

        EventContext event = new EventContext();
        logs.add("[State] Stare inițială eveniment: " + event.getStateName() + ".");

        for (String token : actions) {
            String action = token.trim();
            if (action.isEmpty()) continue;
            if (action.contains("cancel") || action.contains("anuleaza")) {
                logs.add("  [Acțiune: cancel] -> " + event.cancel());
            } else {
                logs.add("  [Acțiune: next] -> " + event.advance());
            }
        }
        logs.add("[State] Stare finală eveniment: " + event.getStateName() + ".");
        return logs;
    }
}
