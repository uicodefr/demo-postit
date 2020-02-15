VERSION=$(shell sed "s/.*\"version\": \"\(.*\)\".*/\1/;t;d" package.json)
NEXUS_USER=deployment

all:
	@echo "do nothing (version: $(VERSION))"

test:
	@echo "test (version: $(VERSION))"
	npm install
	npm run ng -- test --watch=false

buildOnly:
	@echo "buildOnly (version: $(VERSION))"
	npm install
	npm run ng -- build --prod --localize

build:
	@echo "build (version: $(VERSION))"
	npm install
	npm run ng -- build --prod --localize
	cd ./dist && zip -r ../postit-client-$(VERSION).zip ./postit-client
	curl -v --progress-bar -u $(NEXUS_USER):$$NEXUS_PASSWORD -F "raw.directory=demo/postit-client" -F "raw.asset1=@./postit-client-$(VERSION).zip" -F "raw.asset1.filename=postit-client-$(VERSION).zip" https://nexus.uicode.dev/service/rest/v1/components?repository=raw
	rm postit-client-$(VERSION).zip

containerize:
	@echo "containerize (version: $(VERSION))"
	curl -v --progress-bar -u $(NEXUS_USER):$$NEXUS_PASSWORD https://nexus.uicode.dev/repository/raw/demo/postit-client/postit-client-$(VERSION).zip --output client.zip
	unzip client.zip
	mv postit-client client
	docker build --tag postit-client:$(VERSION) --tag postit-client:latest ./
	echo $$NEXUS_PASSWORD | docker login --username $(NEXUS_USER) --password-stdin nexus.uicode.dev:8123
	docker tag postit-client nexus.uicode.dev:8123/postit-client:$(VERSION)
	docker push nexus.uicode.dev:8123/postit-client:$(VERSION)
	rm client.zip
	rm -R client