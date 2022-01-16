
FROM golang:1.18.5 as builder

LABEL org.opencontainers.image.source https://github.com/filouz/rnbb

RUN apt update && apt upgrade -y

RUN apt install -y libczmq-dev libczmq4

WORKDIR /go/src/filouz/rnbb/exporter

COPY go.sum go.mod ./
RUN go mod tidy
RUN go mod download

COPY . .
RUN mkdir /app
RUN go build -o /app/exporter ./cmd

ENTRYPOINT ["/app/exporter"]

