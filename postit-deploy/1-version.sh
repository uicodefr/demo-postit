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
sed -i -e "s/String VERSION = \".*\";$/String VERSION = \"$newVersion\";/g" ../postit-server/src/main/java/com/uicode/postit/postitserver/service/impl/GlobalServiceImpl.java
grep "VERSION =" ../postit-server/src/main/java/com/uicode/postit/postitserver/service/impl/GlobalServiceImpl.java

sed -i -e "s/^  \"version\": \".*\",$/  \"version\": \"$newVersion\",/g" ../postit-client/package.json
grep version ../postit-client/package.json
sed -i -e "s/version: '.*'<\/div>$/version: '$newVersion'<\/div>/g" ../postit-client/src/app/app.component.html
grep version ../postit-client/src/app/app.component.html

echo "# VERSION : End"