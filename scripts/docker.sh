# build without cache
docker compose build --no-cache
docker compose build 

# run in detached mode
docker compose up -d

# real time logs
docker logs -f <container_id_or_name>

# restart containers
docker compose down

docker compose build --no-cache

# Step 2: Validate/check (optional)
docker compose config

# Step 3: Create container dari image
docker compose create

# Step 4: Start container
docker compose start

# Step 5: View logs (optional)
docker compose logs -f
