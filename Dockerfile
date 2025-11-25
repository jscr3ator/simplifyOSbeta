# Multi-stage build for simplifyOS

FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json vite.config.mjs ./
COPY client ./client
COPY server.js ./server.js
COPY public ./public

RUN npm install
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# --- FIX: Install Docker CLI so the app can run docker commands ---
RUN apk add --no-cache docker-cli
# ------------------------------------------------------------------

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node","server.js"]
