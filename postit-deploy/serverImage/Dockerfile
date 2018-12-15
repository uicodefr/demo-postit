FROM openjdk:8-jre-alpine

MAINTAINER uicode.fr

RUN mkdir /log
VOLUME /log

EXPOSE 8080

COPY ./*.jar /app.jar
COPY ./application.properties /application.properties
COPY ./version.txt /version.txt

ENTRYPOINT ["/usr/bin/java"]
CMD ["-Djava.security.egd=file:/dev/./urandom", "-jar", "/app.jar"]
