---
sidebar_position: 2
---

# Install Extism

The `extism` CLI is used to manage [Extism](https://github.com/extism/extism) installations

## Install

Using curl:

```sh
$ curl https://raw.githubusercontent.com/extism/cli/main/install.sh | sh
```

Using pip:

```sh
$ pip3 install git+https://github.com/extism/cli
```

## Usage

The simplest use-case is to download and build the source code then install the library and header file into 
the installation prefix of your choice.

In order to build from source, you must have a recent version of the [Rust toolchain installed](https://rustup.rs/).

```sh
# build from source & install
$ extism install git # installs to ~/.local/lib and ~/.local/include by default

# download & install the latest pre-built bundle
$ extism install latest
```

By default the prefix is `~/.local`, but it can easily be configured:

```sh
$ extism --sudo --prefix /usr/local install
```