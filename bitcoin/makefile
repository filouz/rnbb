

BITCOIN_DIR := $(ROOT_DIR)/bitcoin

#######################################################
#######################################################

include $(BITCOIN_DIR)/core/makefile

bitcoin: bitcoin_build

bitcoin_build:
	docker build $(BITCOIN_DIR) -f $(ROOT_DIR)/docker/bitcoin.Dockerfile -t $(REGISTRY)/rnbb/bitcoin:$(TAG)

bitcoin_push:
	docker push $(REGISTRY)/rnbb/bitcoin:$(TAG)

bitcoin_run:
	docker run  \
		--rm -it \
		--name bitcoin \
		-v $(BITCOIN_DIR)/data:/bitcoin/data \
		-p 15555:15555 \
		-w /bitcoin \
		$(REGISTRY)/rnbb/bitcoin:$(TAG)
