# --- FRONTEND BUILD STAGE ---
FROM node:20-alpine AS frontend

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Install frontend dependencies
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install

# Copy frontend source and build it
COPY frontend ./
RUN pnpm run build

# --- BACKEND BUILD STAGE ---
FROM golang:1.24 as backend

# Enable CGO
ENV CGO_ENABLED=1 \
    GOOS=linux \
    GOARCH=amd64

# Install required build tools for CGO
RUN apt-get update && apt-get install -y gcc libc6-dev

WORKDIR /app

# Pre-cache Go modules
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy backend source
COPY . .
COPY --from=frontend /app/dist ./frontend/dist

# Build the Go app
RUN go build -o ./out/dist .

# Final image (optional: minimal size)
FROM debian:bookworm-slim

WORKDIR /app
COPY --from=backend /app/out/dist /app/app

CMD ["/app/app"]
