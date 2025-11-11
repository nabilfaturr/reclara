# Reclara

YouTube video summarization system with automatic transcription and AI-powered summaries.

## Demo

[![Reclara Demo](https://img.youtube.com/vi/K1iApz-vKyU/0.jpg)](https://www.youtube.com/watch?v=K1iApz-vKyU)


## Getting Started

### Prerequisites

- [Bun](https://bun.com) v1.3.0+
- Docker & Docker Compose (for running with Redis)

### Installation

Install dependencies:

```bash
bun install
```

### Environment Setup

Create `.env.docker` file in the root directory with the following variables:

```env
# Node Environment
NODE_ENV=development

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Database (Turso)
TURSO_CONNECTION_URL=your_turso_connection_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# API Keys
FIREWORKS_API_KEY=your_fireworks_api_key
```

For local development, create `.env.local` in the root directory with development values.

### Running Locally

Start all services (Redis, Transcripter, Summarizer):

```bash
docker compose up -d
```

View logs:

```bash
docker compose logs -f
```

Stop services:

```bash
docker compose down
```

## Project Structure

- `apps/web` - Next.js frontend
- `apps/mq` - Message queue workers (BullMQ)
- `packages/db` - Database schemas & queries (Drizzle)
- `packages/redis` - Redis connection & queue setup
- `packages/env` - Environment configuration
- `packages/constants` - Shared constants

## Tech Stack

- **Runtime**: Bun
- **Queue**: BullMQ + Redis
- **Web**: Next.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Containerization**: Docker + Docker Compose
