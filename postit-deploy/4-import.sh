#!/bin/bash

echo "# IMPORT : Import Docker images"

if [ $# -ne 0 ]; then
	echo "# Need 0 parameter"
	exit 1
fi

for fileDockerImage in ./postit-*.tar; do

	echo "# - load : $fileDockerImage"
	docker load -i $fileDockerImage

done

echo "# IMPORT : End"
