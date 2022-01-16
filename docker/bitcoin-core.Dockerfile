FROM debian:stable

RUN apt update && \
    apt upgrade -y && \
    apt install -y git screen curl zsh  net-tools iputils-ping procps && \
    apt install -y libczmq-dev libczmq4 && \
    apt install -y build-essential libtool autotools-dev automake pkg-config bsdmainutils python3 libevent-dev libboost-system-dev libboost-filesystem-dev libboost-test-dev libboost-thread-dev

RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
RUN chsh -s /bin/zsh
RUN sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="ys"/g' /root/.zshrc
