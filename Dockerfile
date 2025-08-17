# --- FRONTEND BUILD STAGE ---
FROM node:20-alpine AS frontend

RUN npm install -g pnpm
WORKDIR /app

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install

COPY frontend ./
RUN pnpm run build

# --- BACKEND BUILD STAGE ---
FROM golang:1.24 AS backend

ENV CGO_ENABLED=1 \
    GOOS=linux \
    GOARCH=amd64

RUN apt-get update && apt-get install -y gcc libc6-dev

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=frontend /app/dist ./frontend/dist

RUN go build -o app .

# --- FINAL STAGE: SAME AS BUILDER TO AVOID GLIBC ISSUES ---
FROM golang:1.24

WORKDIR /app
COPY --from=backend /app/app /app/app
# Copy built frontend files
COPY --from=backend /app/frontend/dist /app/frontend/dist

CMD ["/app/app"]
