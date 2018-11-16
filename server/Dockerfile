# Do NPM install in a seperate container
# due to it's need for lots of stuff that bloats out the
# the container size
FROM hashicorp/terraform:light
WORKDIR /app
COPY ./server ./server
# COPY ./shared ./shared
RUN apk add --update nodejs nodejs-npm python build-base
RUN cd ./server && npm install

FROM hashicorp/terraform:light
WORKDIR /app
# Copy the output with NPM restored into final container
COPY --from=0 /app/ .
RUN apk add --update nodejs
RUN chmod +x ./server/server-entrypoint.sh
ENV ARM_USE_MSI true
ENTRYPOINT [ "sh", "-f", "/app/server/server-entrypoint.sh" ]
