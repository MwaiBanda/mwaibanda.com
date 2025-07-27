FROM golang:1.24-alpine
WORKDIR /dir

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

RUN go build -o ./out/dist .

CMD ./out/dist