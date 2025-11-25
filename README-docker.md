# simplifyOS (Dockerized)

## Build and run with Docker

```bash
docker build -t simplifyos .
docker run -d --name simplifyos -p 3001:3001 simplifyos
```

## Or with docker-compose

```bash
docker compose up -d
```

The app will then be available at: `http://YOUR-IP:3001`.
