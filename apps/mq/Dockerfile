# Base bun image
FROM oven/bun:1.3.0

# Working directory (nama bebas)
WORKDIR /app

# Copy full monorepo (bukan per folder)
COPY . .

# Install dependencies untuk seluruh monorepo
RUN bun install --frozen-lockfile

# Install python & yt-dlp
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip install --upgrade --break-system-packages yt-dlp

# Default worker command (akan override dari docker-compose)
WORKDIR /app/apps/mq