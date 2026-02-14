FROM gradle:jdk25-corretto AS build

WORKDIR /app

COPY gradle ./gradle
COPY src ./src
COPY build.gradle .
COPY settings.gradle .

USER root

RUN gradle clean bootJar --no-daemon

FROM eclipse-temurin:25-jdk-alpine

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]