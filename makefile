
REGISTRY = ghcr.io/filouz
TAG = local
TAG_DEV = dev

mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
ROOT_DIR=$(dir $(mkfile_path))

EXPORTER_EP = ws://rnbb.dev.example.com:25555
ZMQ_EP = tcp://bitcoin:15555

#######################################################
#######################################################

build: bitcoin exporter demo

up:
	echo $(BITCOIN_DIR)
	@cd deployment && \
	REGISTRY=$(REGISTRY) \
	TAG=$(TAG) \
	EXPORTER_EP=$(EXPORTER_EP) \
	ZMQ_ENDPOINT=$(ZMQ_EP) \
	BITCOIN_DIR=$(BITCOIN_DIR) \
	docker compose up


include bitcoin/makefile
include exporter/makefile
include demo/makefile