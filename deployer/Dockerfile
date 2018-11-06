FROM rust:1.30-stretch
WORKDIR /appsrc
COPY . .
RUN rustup target add x86_64-unknown-linux-musl
RUN cargo build --release --target=x86_64-unknown-linux-musl

FROM hashicorp/terraform:light
WORKDIR /deployer
COPY deployer-entrypoint.sh .
RUN chmod +x deployer-entrypoint.sh
COPY --from=0 /appsrc/target/x86_64-unknown-linux-musl/release/deployer .
ENTRYPOINT [ "sh", "-f", "/deployer/deployer-entrypoint.sh" ]
