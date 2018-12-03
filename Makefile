phony: server-docker-build

server-docker-build:
	docker build -t dotjson/tfdeployer:dev -f ./server/Dockerfile .
	docker push dotjson/tfdeployer:dev