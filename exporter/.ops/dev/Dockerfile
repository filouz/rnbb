
FROM golang:1.18.5 as builder

RUN apt update && apt upgrade -y

RUN apt install -y netcat net-tools iputils-ping wget tree

RUN apt install -y curl zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
RUN chsh -s /bin/zsh
RUN sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="ys"/g' /root/.zshrc

RUN apt install -y libczmq-dev libczmq4

RUN apt install -y protobuf-compiler
RUN go install github.com/golang/protobuf/protoc-gen-go@latest




