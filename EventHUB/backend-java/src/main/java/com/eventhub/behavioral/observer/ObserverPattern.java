// DESIGN PATTERN: Observer (Behavioral)
package com.eventhub.behavioral.observer;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: Observer (Behavioral)
public class ObserverPattern {

    // DESIGN PATTERN: Observer (Behavioral)
    public interface EventSubscriber {
        String notifyUpdate(String message);
    }

    // DESIGN PATTERN: Observer (Behavioral)
    static class EmailSubscriber implements EventSubscriber {
        private final String email;
        EmailSubscriber(String email) { this.email = email; }
        public String notifyUpdate(String message) {
            return "[Email -> " + email + "] " + message;
        }
    }

    // DESIGN PATTERN: Observer (Behavioral)
    static class SmsSubscriber implements EventSubscriber {
        private final String phone;
        SmsSubscriber(String phone) { this.phone = phone; }
        public String notifyUpdate(String message) {
            return "[SMS -> " + phone + "] " + message;
        }
    }

    // DESIGN PATTERN: Observer (Behavioral)
    static class AppPushSubscriber implements EventSubscriber {
        private final String user;
        AppPushSubscriber(String user) { this.user = user; }
        public String notifyUpdate(String message) {
            return "[Push App -> @" + user + "] " + message;
        }
    }

    // DESIGN PATTERN: Observer (Behavioral)
    static class EventScheduleTopic {
        private final List<EventSubscriber> subscribers = new ArrayList<>();
        public void subscribe(EventSubscriber s) { subscribers.add(s); }

        public List<String> publishChange(String updateMessage) {
            List<String> delivered = new ArrayList<>();
            for (EventSubscriber s : subscribers) {
                delivered.add(s.notifyUpdate(updateMessage));
            }
            return delivered;
        }
    }

    // DESIGN PATTERN: Observer (Behavioral)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String update = (input == null || input.isBlank())
                ? "Sesiunea 'Java 21' s-a mutat în Sala B la ora 14:30"
                : input.trim();

        EventScheduleTopic topic = new EventScheduleTopic();
        topic.subscribe(new EmailSubscriber("maria.ionescu@eventhub.ro"));
        topic.subscribe(new SmsSubscriber("+40 722 000 111"));
        topic.subscribe(new AppPushSubscriber("alex_dev"));

        logs.add("[Observer] 3 abonați înregistrați pe canalul de modificări agendă.");
        logs.add("[Observer] Publicare actualizare: \"" + update + "\"");
        for (String line : topic.publishChange(update)) {
            logs.add("  -> " + line);
        }
        logs.add("[Observer] Toți observatorii au fost notificați automat fără cuplare directă.");
        return logs;
    }
}
