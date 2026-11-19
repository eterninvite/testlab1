// DESIGN PATTERN: Command (Behavioral)
package com.eventhub.behavioral.command;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

// DESIGN PATTERN: Command (Behavioral)
public class CommandPattern {

    // DESIGN PATTERN: Command (Behavioral)
    public interface SeatCommand {
        String execute();
        String undo();
    }

    // DESIGN PATTERN: Command (Behavioral)
    static class HallSeating {
        private final List<String> reservedSeats = new ArrayList<>();
        public String reserve(String seat) {
            reservedSeats.add(seat);
            return "Locul " + seat + " a fost REZERVAT. Locuri ocupate: " + reservedSeats;
        }
        public String release(String seat) {
            reservedSeats.remove(seat);
            return "Locul " + seat + " a fost ELIBERAT (Undo). Locuri ocupate: " + reservedSeats;
        }
    }

    // DESIGN PATTERN: Command (Behavioral)
    static class ReserveSeatCommand implements SeatCommand {
        private final HallSeating hall;
        private final String seat;

        ReserveSeatCommand(HallSeating hall, String seat) {
            this.hall = hall;
            this.seat = seat;
        }

        public String execute() { return hall.reserve(seat); }
        public String undo() { return hall.release(seat); }
    }

    // DESIGN PATTERN: Command (Behavioral)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String raw = (input == null || input.isBlank()) ? "A1, A2, undo, B5" : input.trim();
        String[] actions = raw.split(",");

        HallSeating hall = new HallSeating();
        Stack<SeatCommand> history = new Stack<>();

        logs.add("[Command] Procesare secvență comenzi de rezervare locuri: " + raw);
        for (String token : actions) {
            String cmd = token.trim();
            if (cmd.isEmpty()) continue;

            if (cmd.equalsIgnoreCase("undo")) {
                if (!history.isEmpty()) {
                    SeatCommand last = history.pop();
                    logs.add("  [UNDO] " + last.undo());
                } else {
                    logs.add("  [UNDO] Istoricul de comenzi este gol.");
                }
            } else {
                SeatCommand reserveCmd = new ReserveSeatCommand(hall, cmd.toUpperCase());
                logs.add("  [EXEC] " + reserveCmd.execute());
                history.push(reserveCmd);
            }
        }
        logs.add("[Command] Total comenzi rămase în istoric: " + history.size() + ".");
        return logs;
    }
}
