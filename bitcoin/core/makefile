
BITCOIN_CORE_DIR=$(BITCOIN_DIR)/core

#######################################################
#######################################################

bitcoin_core: bitcoin_core_build bitcoin_core_install

bitcoin_core_build:
	docker build $(BITCOIN_CORE_DIR) -f $(ROOT_DIR)/docker/bitcoin-core.Dockerfile -t $(REGISTRY)/rnbb/bitcoin_builder

bitcoin_core_install:
	docker run -it --rm \
		-v $(BITCOIN_CORE_DIR)/src:/src \
		-v $(BITCOIN_CORE_DIR)/bin:/usr/local/bin \
		-w /src \
		$(REGISTRY)/rnbb/bitcoin_builder \
			bash -c "git clone https://github.com/bitcoin/bitcoin.git . ; \
			./autogen.sh && \
			./configure --disable-wallet --disable-miner --enable-zmq --disable-tests --disable-bench --with-gui=no --disable-gui-tests && \
			make && \
			make install"