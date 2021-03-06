#!/bin/bash

if [ $# -ne 1 ]; then
	echo "# VERSION : Change the version for the client and the server"
	echo "- current server version : "$(sed "s/^\t<version>\(.*\)<\/version>$/\1/;t;d" ./postit-server/pom.xml)
	echo "- current client version : "$(sed "s/^  \"version\": \"\(.*\)\",$/\1/;t;d" ./postit-client/package.json)
	echo "# Need 1 parameter to change version : the new version"
	exit 1
fi

newVersion=$1

if [[ ! $newVersion =~ ^[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+(-SNAPSHOT)?$ ]]; then
	echo "# VERSION : The version '$newVersion' is invalid"
	exit 2
fi

echo "# VERSION : Change version to $newVersion"

sed -i -e "s/^\t<version>.*<\/version>$/\t<version>$newVersion<\/version>/g" ./postit-server/pom.xml
sed -i -e "s/^info.app.version=.*$/info.app.version=$newVersion/g" ./postit-server/src/main/resources/application.properties

sed -i -e "s/^  \"version\": \".*\",$/  \"version\": \"$newVersion\",/g" ./postit-client/package.json
sed -i -e "s/version:.*/version: '$newVersion',/g" ./postit-client/src/app/app.info.ts

echo "# VERSION : End"