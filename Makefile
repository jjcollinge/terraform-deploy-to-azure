phony: test, build, docker-build

test:
	cargo test

build: 
	cargo build

server-docker-build:
	docker build -t lawrencegripper/tfdeployer:dev -f ./server/Dockerfile .
	docker push lawrencegripper/tfdeployer:dev