#!/bin/bash

help_command() {
	echo "# VERSION : Change the version for the client and the server"
	echo "The commands are : "
	echo "- list [all|client|server] : to list version"
	echo "- change _newVersion_ : change the version"
	echo "- remove-snapshot : remove the snapshot from the version"
}

list_command() {
	if [ $# -ne 1 ]; then
		echo "Error: the command 'list' needs the application as parameter"
		exit 1
	fi
	application=$1

	clientVersion=$(sed "s/^\t<version>\(.*\)<\/version>$/\1/;t;d" ./postit-server/pom.xml)
	serverVersion=$(sed "s/^  \"version\": \"\(.*\)\",$/\1/;t;d" ./postit-client/package.json)

	if [[ "$application" = "client" ]]; then
		echo "$clientVersion"
	elif [[ "$application" = "server" ]]; then
		echo "$serverVersion"
	elif [[ "$application" = "all" ]]; then
		echo "client version => $clientVersion"
		echo "server version => $serverVersion"
	else
		echo "Error : application '$application' invalid"
		exit 2
	fi
}

change_version() {
	newVersion=$1
	if [[ ! $newVersion =~ ^[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+(-SNAPSHOT)?$ ]]; then
		echo "Error : the version '$newVersion' is invalid"
		exit 2
	fi
	echo "Change version to $newVersion"

	sed -i -e "s/^\t<version>.*<\/version>$/\t<version>$newVersion<\/version>/g" ./postit-server/pom.xml
	sed -i -e "s/^info.app.version=.*$/info.app.version=$newVersion/g" ./postit-server/src/main/resources/application.properties

	sed -i -e "s/^  \"version\": \".*\",$/  \"version\": \"$newVersion\",/g" ./postit-client/package.json
	sed -i -e "s/version:.*/version: '$newVersion',/g" ./postit-client/src/app/app.info.ts
}

change_command() {
	if [ $# -ne 1 ]; then
		echo "Error: the command 'change' needs the version as parameter"
		exit 1
	fi
	newVersion=$1
	change_version $newVersion
}

remove_snapshot_command() {
	clientVersion=$(sed "s/^\t<version>\(.*\)<\/version>$/\1/;t;d" ./postit-server/pom.xml)
	serverVersion=$(sed "s/^  \"version\": \"\(.*\)\",$/\1/;t;d" ./postit-client/package.json)

	if [[ "$clientVersion" != "$serverVersion" ]]; then
		echo "Error: to remove snapshot the client version must the same as the server version"
		exit 2
	fi

	version="$clientVersion"
	if [[ $version =~ "SNAPSHOT" ]]; then
		echo "=> Remove SNAPSHOT From version"
		version=${version/-SNAPSHOT/}
		change_version $version
	fi
}

if [ $# -eq 0 ]; then
	help_command
	exit 1
fi

command=$1
if [[ "$command" = "list" ]]; then
	list_command $2
elif [[ "$command" = "change" ]]; then
	change_command $2
elif [[ "$command" = "remove-snapshot" ]]; then
	remove_snapshot_command
else
	echo "Error: command '$command' invalid"
	exit 1
fi
