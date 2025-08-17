FROM node:20-alpine AS frontend

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory to frontend folder
WORKDIR /app

# Copy and install frontend dependencies
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install

# Copy frontend source and build
COPY frontend ./
RUN pnpm run build

FROM golang:1.24-alpine AS backend

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

# Copy all source code
COPY . .
COPY --from=frontend /app/dist ./frontend/dist

# Build the binary
RUN go build -o ./out/dist .

# Run the app
CMD ["./out/dist"]
