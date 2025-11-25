# ---------- BUILDER STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first (better caching)
COPY package.json vite.config.mjs ./
RUN npm install

# Copy source
COPY client ./client
COPY server.js ./server.js

# Build Vite app
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# If your app needs docker (your previous version used docker-cli)
RUN apk add --no-cache docker-cli

COPY package.json ./
RUN npm install --omit=dev

# Copy built frontend + server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

# ❌ Removed — public folder does not exist
# COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "server.js"]
