VERSION=$(shell sed "s/^\t<version>\(.*\)<\/version>/\1/;t;d" pom.xml)
NEXUS_USER=deployment
DOCKER_URL=docker.uicode.dev

MVN_URL=https://nexus.uicode.dev/repository/maven-public/
MVN_GROUP_ID=com.uicode.demo.postit
MVN_ARTIFACT_ID=postit-server
JAR_NAME=postit-server-*.jar
DOCKER_IMG_NAME=postit-server

all:
	@echo "do nothing (version: $(VERSION))"

test:
	@echo "test (version: $(VERSION))"
	./mvnw test
	
buildOnly:
	@echo "buildOnly (version: $(VERSION))"
	./mvnw package

build:
	@echo "build (version: $(VERSION))"
	./mvnw deploy

containerize:
	@echo "containerize (version: $(VERSION))"
	./mvnw jib:build -Djib.to.image=$(DOCKER_URL)/$(DOCKER_IMG_NAME):$(VERSION) \
		-Djib.to.auth.username=$(NEXUS_USER) \
		-Djib.to.auth.password=$$NEXUS_PASSWORD
