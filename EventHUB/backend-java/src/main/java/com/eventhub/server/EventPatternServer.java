// EventHub Backend Server — Expune endpoint-ul /api/run pentru cele 12 Design Patterns (fără Singleton) și servește interfața web
package com.eventhub.server;

import com.eventhub.behavioral.command.CommandPattern;
import com.eventhub.behavioral.observer.ObserverPattern;
import com.eventhub.behavioral.state.StatePattern;
import com.eventhub.behavioral.strategy.StrategyPattern;
import com.eventhub.creational.abstractfactory.AbstractFactoryPattern;
import com.eventhub.creational.builder.BuilderPattern;
import com.eventhub.creational.factorymethod.FactoryMethodPattern;
import com.eventhub.creational.prototype.PrototypePattern;
import com.eventhub.structural.adapter.AdapterPattern;
import com.eventhub.structural.composite.CompositePattern;
import com.eventhub.structural.decorator.DecoratorPattern;
import com.eventhub.structural.facade.FacadePattern;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public class EventPatternServer {

    private static final Map<String, Function<String, List<String>>> PATTERNS = new HashMap<>();

    static {
        // Creational (4 — fără Singleton)
        PATTERNS.put("factory-method", FactoryMethodPattern::run);
        PATTERNS.put("abstract-factory", AbstractFactoryPattern::run);
        PATTERNS.put("builder", BuilderPattern::run);
        PATTERNS.put("prototype", PrototypePattern::run);

        // Structural (4)
        PATTERNS.put("adapter", AdapterPattern::run);
        PATTERNS.put("decorator", DecoratorPattern::run);
        PATTERNS.put("facade", FacadePattern::run);
        PATTERNS.put("composite", CompositePattern::run);

        // Behavioral (4)
        PATTERNS.put("strategy", StrategyPattern::run);
        PATTERNS.put("observer", ObserverPattern::run);
        PATTERNS.put("command", CommandPattern::run);
        PATTERNS.put("state", StatePattern::run);
    }

    public static void main(String[] args) throws IOException {
        int port = resolvePort();
        Path frontendDir = resolveFrontendDir();

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/api/health", EventPatternServer::handleHealth);
        server.createContext("/api/run", EventPatternServer::handleRun);
        server.createContext("/", exchange -> handleStatic(exchange, frontendDir));
        server.setExecutor(null);
        server.start();

        System.out.println("EventHub Java Server pornit pe http://localhost:" + port);
        System.out.println("Frontend servit din: " + frontendDir.toAbsolutePath());
    }

    private static int resolvePort() {
        String envPort = System.getenv("PORT");
        if (envPort != null && !envPort.isBlank()) {
            try {
                return Integer.parseInt(envPort.trim());
            } catch (NumberFormatException ignored) {}
        }
        return 8080;
    }

    private static Path resolveFrontendDir() {
        Path direct = Paths.get("frontend");
        if (Files.isDirectory(direct)) return direct;
        Path parent = Paths.get("..", "frontend");
        if (Files.isDirectory(parent)) return parent;
        return direct;
    }

    private static void handleHealth(HttpExchange exchange) throws IOException {
        addCorsHeaders(exchange);
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }
        String json = "{\"status\":\"ok\",\"mode\":\"java-backend\",\"patterns\":12}";
        sendResponse(exchange, 200, "application/json; charset=utf-8", json.getBytes(StandardCharsets.UTF_8));
    }

    private static void handleRun(HttpExchange exchange) throws IOException {
        addCorsHeaders(exchange);
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        String pattern = "";
        String input = "";

        if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
            pattern = extractJsonField(body, "pattern");
            input = extractJsonField(body, "input");
        } else {
            Map<String, String> query = parseQuery(exchange.getRequestURI().getRawQuery());
            pattern = query.getOrDefault("pattern", "");
            input = query.getOrDefault("input", "");
        }

        String key = pattern.trim().toLowerCase();
        Function<String, List<String>> runner = PATTERNS.get(key);
        if (runner == null) {
            String error = "{\"error\":\"Pattern necunoscut: " + escapeJson(pattern) + "\"}";
            sendResponse(exchange, 400, "application/json; charset=utf-8", error.getBytes(StandardCharsets.UTF_8));
            return;
        }

        List<String> logs = runner.apply(input);
        StringBuilder json = new StringBuilder();
        json.append("{\"pattern\":\"").append(escapeJson(key))
            .append("\",\"mode\":\"java-backend\",\"logs\":[");
        for (int i = 0; i < logs.size(); i++) {
            if (i > 0) json.append(",");
            json.append("\"").append(escapeJson(logs.get(i))).append("\"");
        }
        json.append("]}");

        sendResponse(exchange, 200, "application/json; charset=utf-8", json.toString().getBytes(StandardCharsets.UTF_8));
    }

    private static void handleStatic(HttpExchange exchange, Path frontendDir) throws IOException {
        String rawPath = exchange.getRequestURI().getPath();
        String relative = ("/".equals(rawPath) || rawPath.isBlank()) ? "index.html" : rawPath.replaceFirst("^/+", "");

        Path base = frontendDir.toAbsolutePath().normalize();
        Path target = base.resolve(relative).normalize();
        if (!target.startsWith(base) || !Files.isRegularFile(target)) {
            byte[] notFound = "404 Not Found".getBytes(StandardCharsets.UTF_8);
            sendResponse(exchange, 404, "text/plain; charset=utf-8", notFound);
            return;
        }

        byte[] content = Files.readAllBytes(target);
        sendResponse(exchange, 200, detectContentType(target.getFileName().toString()), content);
    }

    private static String detectContentType(String filename) {
        if (filename.endsWith(".html")) return "text/html; charset=utf-8";
        if (filename.endsWith(".css")) return "text/css; charset=utf-8";
        if (filename.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (filename.endsWith(".json")) return "application/json; charset=utf-8";
        if (filename.endsWith(".svg")) return "image/svg+xml";
        if (filename.endsWith(".png")) return "image/png";
        return "application/octet-stream";
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void sendResponse(HttpExchange exchange, int status, String contentType, byte[] data) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.sendResponseHeaders(status, data.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(data);
        }
    }

    private static Map<String, String> parseQuery(String rawQuery) {
        Map<String, String> map = new HashMap<>();
        if (rawQuery == null || rawQuery.isBlank()) return map;
        for (String pair : rawQuery.split("&")) {
            String[] kv = pair.split("=", 2);
            String k = URLDecoder.decode(kv[0], StandardCharsets.UTF_8);
            String v = kv.length > 1 ? URLDecoder.decode(kv[1], StandardCharsets.UTF_8) : "";
            map.put(k, v);
        }
        return map;
    }

    private static String extractJsonField(String json, String field) {
        if (json == null) return "";
        String token = "\"" + field + "\"";
        int idx = json.indexOf(token);
        if (idx < 0) return "";
        int colon = json.indexOf(':', idx + token.length());
        if (colon < 0) return "";
        int startQuote = json.indexOf('"', colon + 1);
        if (startQuote < 0) return "";

        StringBuilder sb = new StringBuilder();
        boolean escaped = false;
        for (int i = startQuote + 1; i < json.length(); i++) {
            char c = json.charAt(i);
            if (escaped) {
                if (c == 'n') sb.append('\n');
                else if (c == 'r') sb.append('\r');
                else if (c == 't') sb.append('\t');
                else sb.append(c);
                escaped = false;
            } else if (c == '\\') {
                escaped = true;
            } else if (c == '"') {
                break;
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
