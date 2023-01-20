---
title: Installing Extism
sidebar_position: 2
---

The `extism` CLI is used to manage [Extism](https://github.com/extism/extism) installations. In order to run Extism, your system must be able to locate the `libextism.so` (on Linux) or `libextism.dylib` (on macos). Windows support is coming soon.

> **Note:** If you are using the [Rust Host SDK](/docs/integrate-into-your-codebase/rust-host-sdk), this is not the case, and can use Extism as a [crate dependency](https://crates.io/crates/extism) in your `Cargo.toml`. 


---

The following instructions will walk you through how to install the Extism CLI, and then the installation of the shared library which a [Host SDK](/docs/concepts/host-sdk) will look for automatically.

## Install the Extism CLI

### macos

Using pip: <small><em>(recommended)</em></small>

```sh
pip3 install poetry
pip3 install git+https://github.com/extism/cli
```

Using curl:

```sh
sh <(curl https://raw.githubusercontent.com/extism/cli/main/install.sh) /usr/local/bin

# To use advanced features of the CLI, install the Extism Python SDK:
# pip3 install extism
```

### Linux

Using pip:

```sh
pip3 install poetry
pip3 install git+https://github.com/extism/cli
```

Using curl:

```sh
curl https://raw.githubusercontent.com/extism/cli/main/install.sh | sh

# To use advanced features of the CLI, install the Extism Python SDK:
# pip3 install extism
```

---

## Using the Extism CLI

The most common use-case is to to install Extism from Github releases, and then install the library and header file into the installation prefix of your choice.

### macos

```sh
extism install latest
```

### Linux

```sh
extism install latest
```

#### Build from source

In order to build from source, you must have a recent version of the [Rust toolchain installed](https://rustup.rs/).

```sh
extism install git # installs to /usr/local/lib and /usr/local/include by default
```

#### Overriding install location

Pass the `--prefix` argument a path on disk where `extism` CLI will install the system files:

```sh
extism --prefix ~/.local install latest
```

---

## Other CLI Features

```sh
usage: extism [-h] [--quiet] [--prefix PREFIX] [--github-token GITHUB_TOKEN] [--sudo] {build,version,install,fetch,uninstall,link,info,call} ...

options:
  -h, --help            show this help message and exit
  --quiet               Limit output to errors
  --prefix PREFIX       Installation prefix
  --github-token GITHUB_TOKEN
                        Github token
  --sudo                Use sudo to install files

command:
  {build,version,install,fetch,uninstall,link,info,call}
```

### Call plug-in functions

You can use the `extism` CLI as a test runner to check your plug-ins outside of any Host program:

```sh
extism call --input "this is a test" test/code.wasm count_vowels
{"count": 4}
```

> **Note:** if you encounter the error `Could not find extism on this machine`, please install the Extism Python SDK by running: `pip3 install extism`

### Get installation info

It's helpful to know where the CLI is locating the Extism shared library, and which version of the runtime it's using.

```sh
extism info
Prefix  /usr/local
Version v0.2.0
```

### Get runtime version

Use the `version` command to print the version of the Extism runtime installed on your machine:

```sh
extism version
v0.2.0
```