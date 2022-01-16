FROM debian:stable

LABEL org.opencontainers.image.source https://github.com/filouz/rnbb

RUN apt update && \
    apt upgrade -y && \
    apt install -y libevent-dev libczmq4


RUN mkdir -p /bitcoin/data/blocks

COPY ./core/bin /usr/local/bin
COPY ./conf /bitcoin/conf

ENTRYPOINT bitcoind -conf=/bitcoin/conf/bitcoin.conf