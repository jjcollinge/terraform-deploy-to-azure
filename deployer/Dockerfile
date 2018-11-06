FROM rust:1.30-stretch
WORKDIR /appsrc
COPY . .
RUN rustup target add x86_64-unknown-linux-musl
RUN cargo build --release --target=x86_64-unknown-linux-musl

FROM hashicorp/terraform:light
WORKDIR /deployer
COPY --from=0 /appsrc/target/x86_64-unknown-linux-musl/release/deployer .
ENTRYPOINT [ "/deployer/deployer" ]
