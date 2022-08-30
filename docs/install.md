---
sidebar_position: 2
---

# Install Extism

The `extism` CLI is used to manage [Extism](https://github.com/extism/extism) installations

## Install

Using pip:

```sh
$ pip3 install git+https://github.com/extism/cli
```

## Usage

The simplest use-case is to download and build the source code then install the library and header file into 
the installation prefix of your choice.

In order to build from source, you must have a recent version of the [Rust toolchain installed](https://rustup.rs/).

```sh
$ extism install # install to ~/.local/lib and ~/.local/include

# download & install the latest pre-built bundle
$ extism fetch v0.0.1-alpha
```

By default the prefix is `~/.local`, but it can easily be configured:

```sh
$ extism --prefix /usr/local install
```