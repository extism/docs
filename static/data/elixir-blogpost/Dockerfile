FROM ubuntu:latest

RUN apt update
RUN apt install -y curl build-essential vim
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="$HOME/.cargo/bin:$PATH"
RUN apt install -y elixir
RUN mkdir /app
WORKDIR /app