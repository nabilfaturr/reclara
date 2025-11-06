# build without cache
docker compose build --no-cache

# run in detached mode
docker compose up -d

# real time logs
docker logs -f <container_id_or_name>

# restart containers
docker compose down


