# Do NPM install in a seperate container
# due to it's need for lots of stuff that bloats out the 
# the container size
FROM hashicorp/terraform:light
WORKDIR /server
COPY . .
RUN apk add --update nodejs nodejs-npm python build-base
RUN npm install

FROM hashicorp/terraform:light
WORKDIR /server
# Copy the output with NPM restored into final container
COPY --from=0 /server/ .
RUN apk add --update nodejs
RUN chmod +x server-entrypoint.sh
ENTRYPOINT [ "sh", "-f", "/server/server-entrypoint.sh" ]
