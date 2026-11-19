// DESIGN PATTERN: Strategy (Behavioral)
package com.eventhub.behavioral.strategy;

import java.util.ArrayList;
import java.util.List;

// DESIGN PATTERN: Strategy (Behavioral)
public class StrategyPattern {

    // DESIGN PATTERN: Strategy (Behavioral)
    public interface PricingStrategy {
        String getName();
        double calculate(double basePrice);
    }

    // DESIGN PATTERN: Strategy (Behavioral)
    static class EarlyBirdStrategy implements PricingStrategy {
        public String getName() { return "Early Bird (-25%)"; }
        public double calculate(double basePrice) { return basePrice * 0.75; }
    }

    // DESIGN PATTERN: Strategy (Behavioral)
    static class StudentStrategy implements PricingStrategy {
        public String getName() { return "Student (-40%)"; }
        public double calculate(double basePrice) { return basePrice * 0.60; }
    }

    // DESIGN PATTERN: Strategy (Behavioral)
    static class GroupStrategy implements PricingStrategy {
        public String getName() { return "Grup 5+ (-20%)"; }
        public double calculate(double basePrice) { return basePrice * 0.80; }
    }

    // DESIGN PATTERN: Strategy (Behavioral)
    static class VipStrategy implements PricingStrategy {
        public String getName() { return "VIP (+50%)"; }
        public double calculate(double basePrice) { return basePrice * 1.50; }
    }

    // DESIGN PATTERN: Strategy (Behavioral)
    static class TicketPriceCalculator {
        private PricingStrategy strategy;
        TicketPriceCalculator(PricingStrategy strategy) { this.strategy = strategy; }
        public double compute(double basePrice) { return strategy.calculate(basePrice); }
        public String getStrategyName() { return strategy.getName(); }
    }

    // DESIGN PATTERN: Strategy (Behavioral)
    public static List<String> run(String input) {
        List<String> logs = new ArrayList<>();
        String raw = (input == null || input.isBlank()) ? "earlybird:200" : input.trim();
        String[] parts = raw.split(":", 2);
        String key = parts[0].trim().toLowerCase();
        double basePrice = 200.0;
        if (parts.length > 1) {
            try { basePrice = Double.parseDouble(parts[1].trim()); } catch (NumberFormatException ignored) {}
        }

        PricingStrategy strategy;
        if (key.contains("student")) strategy = new StudentStrategy();
        else if (key.contains("grup") || key.contains("group")) strategy = new GroupStrategy();
        else if (key.contains("vip")) strategy = new VipStrategy();
        else strategy = new EarlyBirdStrategy();

        TicketPriceCalculator calculator = new TicketPriceCalculator(strategy);
        double finalPrice = calculator.compute(basePrice);

        logs.add("[Strategy] Preț de bază bilet: " + basePrice + " RON.");
        logs.add("[Strategy] Strategie injectată la runtime: " + calculator.getStrategyName() + ".");
        logs.add("[Strategy] Tarif final calculat: " + String.format("%.2f", finalPrice) + " RON.");
        return logs;
    }
}
