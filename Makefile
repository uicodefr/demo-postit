all:
	@echo "do nothing"

test:
	make -C postit-server test
	make -C postit-client test

buildOnly:
	make -C postit-server buildOnly
	make -C postit-client buildOnly
	
build:
	make -C postit-server build
	make -C postit-client build

containerize:
	make -C postit-server containerize
	make -C postit-client containerize
