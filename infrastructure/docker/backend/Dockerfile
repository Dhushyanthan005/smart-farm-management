# ==============================================================================
# DairyFlow Backend Dockerfile (Multi-stage Build)
# ==============================================================================

# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY pom.xml .
COPY .mvn .mvn
RUN apk add --no-cache maven && mvn dependency:go-offline -B || true

# Copy source and build
COPY src src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S dairyflow && adduser -S dairyflow -G dairyflow
USER dairyflow

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
