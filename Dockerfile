FROM golang:1.20-alpine
WORKDIR /dir

COPY . .

RUN go build -o ./out/dist .

CMD ./out/dist
