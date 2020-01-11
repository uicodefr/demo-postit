VERSION=$(shell sed "s/^\t<version>\(.*\)<\/version>/\1/;t;d" pom.xml)
NEXUS_USER=deployment

all:
	@echo "do nothing (version: $(VERSION))"

test:
	@echo "test (version: $(VERSION))"
	chmod u+x mvnw
	./mvnw test
	
buildOnly:
	@echo "buildOnly (version: $(VERSION))"
	chmod u+x mvnw
	./mvnw package

build:
	@echo "build (version: $(VERSION))"
	chmod u+x mvnw
	./mvnw deploy

containerize:
	@echo "containerize (version: $(VERSION))"
	chmod u+x mvnw
	./mvnw dependency:get -DrepoUrl=https://nexus.uicode.dev/repository/maven-public/ -Dartifact=com.uicode.demo.postit:postit-server:$(VERSION)
	./mvnw dependency:copy -Dartifact=com.uicode.demo.postit:postit-server:$(VERSION) -DoutputDirectory=.
	mv postit-server-*.jar server.jar
	echo $$NEXUS_PASSWORD | docker login --username $(NEXUS_USER) --password-stdin nexus.uicode.dev:8123
	docker build --tag postit-server:$(VERSION) --tag postit-server:latest ./
	docker tag postit-server nexus.uicode.dev:8123/postit-server:$(VERSION)
	docker push nexus.uicode.dev:8123/postit-server:$(VERSION)
	rm server.jar
