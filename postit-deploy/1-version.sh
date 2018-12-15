#!/bin/bash

if [ $# -ne 1 ]; then
	echo "# VERSION : Change the version for the client and the server"
	echo "# Need 1 parameter : the new version"
	exit 1
fi

newVersion=$1

if [[ ! $newVersion =~ ^[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+$ ]]; then
	echo "# VERSION : The version '$newVersion' is invalid"
	exit 2
fi

echo "# VERSION : Change version to $newVersion"

sed -i -e "s/^version = '.*'$/version = '$newVersion'/g" ../postit-server/build.gradle
grep version ../postit-server/build.gradle

sed -i -e "s/^  \"version\": \".*\",$/  \"version\": \"$newVersion\",/g" ../postit-client/package.json
grep version ../postit-client/package.json

echo "# VERSION : End"