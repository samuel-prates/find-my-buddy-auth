# Docker Setup for Find My Buddy Auth API

This directory contains Docker configuration files for the Find My Buddy Auth API.

## Files

- `Dockerfile`: Defines how to build the Docker image for the Auth API
- `docker-compose.yml`: Defines services for running the Auth API with a PostgreSQL database

## Building and Running

### Using Makefile (Recommended)

A Makefile has been created in the project root directory to simplify Docker operations. You can use it from the project root:

```bash
# Show all available commands
make help

# Start all containers
make up

# View logs
make logs

# Stop containers
make down
```

For more details on available Makefile commands, see the [main README.md](../README.md#usando-o-makefile).

### Using Docker Compose

Alternatively, you can use Docker Compose directly:

```bash
# From the project root
docker-compose -f docker/docker-compose.yml up -d

# Or navigate to the docker directory
cd docker

# Build and start the services
docker-compose up -d

# To view logs
docker-compose logs -f

# To stop the services
docker-compose down
```

### Using Docker Directly

To build and run only the Auth API:

```bash
# Build the Docker image
docker build -t find-my-buddy-auth -f docker/Dockerfile .

# Run the container
docker run -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_USERNAME=your-username \
  -e DB_PASSWORD=your-password \
  -e DB_DATABASE=your-database \
  find-my-buddy-auth
```

## Environment Variables

The following environment variables can be configured:

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | production |
| DB_HOST | PostgreSQL host | postgres |
| DB_PORT | PostgreSQL port | 5432 |
| DB_USERNAME | PostgreSQL username | postgres |
| DB_PASSWORD | PostgreSQL password | postgres |
| DB_DATABASE | PostgreSQL database name | find_my_buddy |

## Accessing the API

Once running, the API will be available at:

- API Endpoint: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api
