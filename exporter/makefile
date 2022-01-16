




EXPORTER_DIR=$(ROOT_DIR)/exporter
OPS_PATH := $(EXPORTER_DIR)/.ops

#######################################################
#######################################################

exporter: exporter_build

exporter_build:
	docker build $(EXPORTER_DIR) -f $(ROOT_DIR)/docker/exporter.Dockerfile -t $(REGISTRY)/rnbb/exporter:$(TAG)


exporter_push:
	docker push $(REGISTRY)/rnbb/exporter:$(TAG)


exporter_run:
	docker run -it --rm \
		--name exporter \
		-e ZMQ_EP=$(ZMQ_EP) \
		-p 45555:45555 \
		$(REGISTRY)/rnbb/exporter:$(TAG)


exporter_dev_build:
	docker build . -f $(OPS_PATH)/dev/Dockerfile -t $(REGISTRY)/rnbb/exporter:$(TAG_DEV)

exporter_dev_run:
	docker run -it --rm \
		--name exporter \
		-v $(OPS_PATH)/cache:/go/pkg \
		-v $(shell pwd):/go/src/filouz/rnbb/exporter \
		-p 45555:45555 \
		-w /go/src/filouz/rnbb/exporter \
		$(REGISTRY)/rnbb/exporter:$(TAG_DEV) zsh

exporter_dev_exec:
	rm -f /go/bin/exporter; go build -o /go/bin/exporter ./cmd && exporter


#######################################################
#######################################################

exporter_protos_build:
	docker run \
		--rm -it \
		-v $(OPS_PATH)/dev:/ops/dev \
		-v $(OPS_PATH)/cache:/go/pkg \
		-v $(shell pwd)/proto:/pb/proto \
		-v $(shell pwd)/:/pb/go \
		-v $(shell pwd)/../demo/src/proto:/pb/js \
		-w /pb/proto \
		$(REGISTRY)/rnbb/exporter:$(TAG_DEV) zsh -c /ops/dev/build_protos.sh

