#!/bin/bash

if [ $# -ne 1 ]; then
	echo "# EXPORT : Build Docker image and export them"
	echo "# Need 1 parameter : the target to export (client, server, all)"
	exit 1
fi

buildTarget=$1

echo "# - clean export folder"
rm -Rf postit-export
mkdir postit-export
cp 4-import.sh ./postit-export/
cp 5-run.sh ./postit-export/

if [ $buildTarget == 'server' ] || [ $buildTarget == 'all' ]; then
	echo "# EXPORT : Start to build server image"
	serverVersion=`cat ./serverImage/version.txt`
	echo "# - server version : $serverVersion"

	echo "# - build docker server"
	rm ./serverImage/postit-server-*.tar
	docker build --tag postit-server:$serverVersion --tag postit-server:latest serverImage
	docker image save postit-server:$serverVersion -o ./serverImage/postit-server-$serverVersion.tar

	echo "# - copy docker image in folder"
	cp ./serverImage/postit-server-$serverVersion.tar ./postit-export/

	if [ -d "../postit-server/sql/$serverVersion" ]; then
		echo "# - copy script sql in folder"
		cp ../postit-server/sql/$serverVersion ./postit-export/sql-$serverVersion
	fi

fi

if [ $buildTarget == 'client' ] || [ $buildTarget == 'all' ]; then
	echo "# EXPORT : Start to build client image"
	clientVersion=`cat ./clientImage/version.txt`
	echo "# - client version : $clientVersion"

	echo "# - build docker client"
	rm ./clientImage/postit-client-*.tar
	docker build --tag postit-client:$clientVersion --tag postit-client:latest clientImage 
	docker image save postit-client:$clientVersion -o ./clientImage/postit-client-$clientVersion.tar

	echo "# - copy docker image in folder"
	cp ./clientImage/postit-client-$clientVersion.tar ./postit-export/

fi

echo "# - zip export folder"
rm postit-export.zip
zip -r postit-export.zip postit-export

echo "# EXPORT : End"
