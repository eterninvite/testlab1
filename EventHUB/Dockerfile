# EventHub — Dockerfile pentru deploy direct din GitHub pe Render / Railway / Fly.io
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiem backend-ul Java și interfața web
COPY backend-java ./backend-java
COPY frontend ./frontend

# Compilăm toate cele 12 Design Patterns și serverul HTTP Java
RUN mkdir -p backend-java/out && \
    find backend-java/src/main/java -name "*.java" > sources.txt && \
    javac -encoding UTF-8 -d backend-java/out @sources.txt && \
    rm sources.txt

# Render/Railway setează automat variabila de mediu PORT; implicit 8080
ENV PORT=8080
EXPOSE 8080

CMD ["java", "-cp", "backend-java/out", "com.eventhub.server.EventPatternServer"]
