#!/bin/bash

if [ $# -ne 1 ]; then
	echo "# BUILD : Build Server or Client (with gradle and npm)"
	echo "# Need 1 parameter : the target to build (client, server, all)"
	exit 1
fi

buildTarget=$1

if [ $buildTarget == 'server' ] || [ $buildTarget == 'all' ]; then
	echo "# BUILD : Start to build server"
	serverVersion=`grep "version =" ../postit-server/build.gradle | sed -r -e "s/^version = '(.+)'$/\1/"`
	echo "# - server version : $serverVersion"
	
	echo "# - build jar server"
	cd ../postit-server
	./gradlew clean
	./gradlew build
	
	cd ../postit-deploy
	rm ./serverImage/postit-server*.jar
	rm ./serverImage/version.txt
	
	cp ../postit-server/build/libs/postit-server-$serverVersion.jar ./serverImage/
	echo $serverVersion > ./serverImage/version.txt
	
fi

if [ $buildTarget == 'client' ] || [ $buildTarget == 'all' ]; then
	echo "# BUILD : Start to build client"
	clientVersion=`grep "\"version\":" ../postit-client/package.json | sed -r -e "s/^  \"version\": \"(.+)\",$/\1/"`
	echo "# - client version : $clientVersion"
	
	echo "# - build angular client"
	cd ../postit-client
	npm install
	npm run ng -- build --prod --base-href /demo/postit/
	
	cd ../postit-deploy
	rm ./clientImage/postit-client/*
	rm ./clientImage/version.txt
	
	cp -r ../postit-client/dist/postit-client ./clientImage/
	echo $clientVersion > ./clientImage/version.txt
	
fi

echo "# BUILD : End"
