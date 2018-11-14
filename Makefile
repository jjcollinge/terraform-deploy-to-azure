phony: server-docker-build

server-docker-build:
	docker build -t lawrencegripper/tfdeployer:dev -f ./server/Dockerfile .
	docker push lawrencegripper/tfdeployer:dev