LOCAL_UID := $(shell id -u)
LOCAL_GID := $(shell id -g)

PWD := $(shell pwd)

install:
	docker run -it --rm -v ${PWD}:/app -w /app --user=${LOCAL_UID}:${LOCAL_GID} node:14 bash -c "yarn install"

build:
	docker run -it --rm -v ${PWD}:/app -w /app --user=${LOCAL_UID}:${LOCAL_GID} node:14 bash -c "yarn build"

test:
	docker run -it --rm -v ${PWD}:/app -w /app --user=${LOCAL_UID}:${LOCAL_GID} node:14 bash -c "yarn test"
