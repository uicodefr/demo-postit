#!/bin/bash

if [ $# -ne 1 ]; then
	echo "# BUILD : Build Server or Client (with gradle and npm)"
	echo "# Need 1 parameter : the target to build (client, server, all)"
	exit 1
fi

buildTarget=$1

if [ $buildTarget == 'server' ] || [ $buildTarget == 'all' ]; then
	echo "# BUILD : Start to build server"
	serverVersion=`grep $'^\t<version>' ../postit-server/pom.xml | sed -r -e "s/^\t<version>(.+)<\/version>$/\1/"`
	echo "# - server version : $serverVersion"
	
	echo "# - build jar server"
	cd ../postit-server
	./mvnw clean
	./mvnw package
	
	cd ../postit-deploy
	rm ./serverImage/postit-server*
	rm ./serverImage/version.txt
	
	cp ../postit-server/target/postit-server-$serverVersion.jar ./serverImage/
	echo $serverVersion > ./serverImage/version.txt
	
fi

if [ $buildTarget == 'client' ] || [ $buildTarget == 'all' ]; then
	echo "# BUILD : Start to build client"
	clientVersion=`grep "\"version\":" ../postit-client/package.json | sed -r -e "s/^  \"version\": \"(.+)\",$/\1/"`
	echo "# - client version : $clientVersion"
	
	echo "# - build angular client"
	cd ../postit-client
	npm install
	npm run ng -- build --prod --base-href /demo/postit/en/
	npm run ng -- build --configuration=production-fr --base-href /demo/postit/fr/
	
	cd ../postit-deploy
	rm -R ./clientImage/postit-client/*
	rm ./clientImage/version.txt
	
	cp -r ../postit-client/dist/postit-client ./clientImage/
	echo $clientVersion > ./clientImage/version.txt
	
fi

echo "# BUILD : End"
