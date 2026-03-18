podman volume create postit-database
podman run -d -p 5432:5432 --volume postit-database:/var/lib/postgresql/data -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecret --name postit-database postgres:18-alpine
