FROM golang:1.24-alpine

WORKDIR /dir

# Pre-cache Go modules
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy all source code
COPY . .

# Build the binary
RUN go build -o ./out/dist .

# Run the app
CMD ["./out/dist"]
