# FROM node:24-alpine

# WORKDIR /app

# RUN apk update && apk upgrade

# COPY package*.json ./

# RUN npm ci --omit=dev

# COPY . .

# EXPOSE 5000

# CMD ["node", "index.js"]

# =========================
# Build stage
# =========================
FROM node:24-alpine AS builder

WORKDIR /app

RUN apk update && apk upgrade

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .


# =========================
# Production stage
# =========================
FROM node:24-alpine

WORKDIR /app

RUN apk update && apk upgrade \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/bin/npm \
              /usr/local/bin/npx

COPY --from=builder /app .

EXPOSE 5000

CMD ["node", "index.js"]