# --- FRONTEND BUILD STAGE ---
FROM node:24-alpine AS frontend

RUN npm install -g pnpm@12.4.2
WORKDIR /app

COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend ./
ARG CONTENT_API_URL=https://mwaibanda.com
RUN CONTENT_API_URL="${CONTENT_API_URL}" pnpm run release

# --- BACKEND BUILD STAGE ---
FROM golang:1.26-trixie AS backend

ENV CGO_ENABLED=1 \
    GOOS=linux

RUN apt-get update && apt-get install -y --no-install-recommends gcc libc6-dev llvm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

# Strip the disallowed LLVM bitcode (.llvmbc) section from go-libsql precompiled static libraries
RUN chmod -R u+w /go/pkg/mod/github.com/tursodatabase/go-libsql* \
    && find /go/pkg/mod/github.com/tursodatabase/go-libsql* -name "*.a" -exec llvm-objcopy --remove-section=.llvmbc --remove-section=.llvmcmd {} \;

COPY . .
COPY --from=frontend /app/dist ./frontend/dist

RUN go vet ./... && go test ./... && go build -o app .

FROM debian:trixie-slim AS runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates libgcc-s1 libstdc++6 \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 10001 app \
    && useradd --system --uid 10001 --gid app --no-create-home --home-dir /nonexistent --shell /usr/sbin/nologin app

WORKDIR /app
COPY --from=backend /app/app /app/app
COPY --from=backend /app/frontend/dist /app/frontend/dist

ARG RELEASE_SHA
ENV RELEASE_SHA=${RELEASE_SHA}

USER 10001:10001
EXPOSE 8080
CMD ["/app/app"]
