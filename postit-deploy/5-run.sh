#!/bin/bash

if [ $# -ne 2 ]; then
	echo "# RUN : Run Docker container from image"
	echo "# Need 2 parameter : the target to export (client, server, all), the version to run"
	exit 1
fi

buildTarget=$1
version=$2

if [ $buildTarget == 'server' ] || [ $buildTarget == 'all' ]; then
	echo "# RUN : Start the server docker container"
	
	echo "# - run docker server"
	docker stop postit-server
	docker rm postit-server
	docker run -d -p 8002:8080 --network postit-network --volume /var/myapp/postit-server:/log --name postit-server postit-server:$version

fi

if [ $buildTarget == 'client' ] || [ $buildTarget == 'all' ]; then
	echo "# RUN : Start the client docker container"
	
	echo "# - run docker client"
	docker stop postit-client
	docker rm postit-client
	docker run -d -p 8001:80 --network postit-network --volume /var/myapp/postit-client:/log --name postit-client postit-client:$version

fi

echo "# RUN : End"
