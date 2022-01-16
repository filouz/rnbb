

DEMO_DIR := $(ROOT_DIR)/demo

#######################################################
#######################################################

demo: demo_build

demo_build:
	docker build $(DEMO_DIR) -f $(ROOT_DIR)/docker/demo.Dockerfile -t $(REGISTRY)/rnbb/demo:$(TAG)

demo_push:
	docker push $(REGISTRY)/rnbb/demo:$(TAG)

demo_run:
	docker run -it --rm \
	--name rnbb-demo \
	-p 25555:8080 \
	-e REACT_APP_EXPORTER_EP=$(EXPORTER_EP) \
		$(REGISTRY)/rnbb/demo:$(TAG)

demo_dev: demo_dev_build demo_dev_run

demo_dev_build:
	docker build $(DEMO_DIR) -f $(ROOT_DIR)/docker/demo-dev.Dockerfile -t $(REGISTRY)/rnbb/demo:$(TAG_DEV)

demo_dev_run:
	docker run -it --rm \
		-v $(DEMO_DIR):/demo \
		-p 45555:5000 \
		-w /demo \
		$(REGISTRY)/rnbb/demo:$(TAG_DEV) zsh

