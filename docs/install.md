---
title: Extism CLI
sidebar_position: 5
---

The `extism` [CLI](https://github.com/extism/cli) is a useful but optional tool for developing on Extism.
It handles a few things such as installing the shared library (Extism Runtime), or invoking plug-ins from the command line.

The following instructions will walk you through how to install the Extism CLI, and then the installation of the shared library which a [Host SDK](/docs/concepts/host-sdk) will look for automatically.

## Install the Extism CLI

Using go: **(recommended)**

```sh
go install github.com/extism/cli/extism@latest
```

There are also releases available on Github: https://github.com/extism/cli/releases

:::warning Remove old installation
If you have installed the old cli via python, you may need to remove it:
>   ```sh
>   pip3 uninstall extism_cli --break-system-packages
>   which extism # shouldn't print anything, if it does, delete it
>   ```
:::

## Using the Extism CLI

The most common use-case is to to install Extism from Github releases, and then install the library and header file into the installation prefix of your choice. The default prefix is `/usr/local`, so libraries will be installed to `/usr/local/lib` and the header will be installed to `/usr/local/include`.

:::note
Some language SDKs come bundled with the runtime and some need you to install the runtime separately.
If your language needs you to install the runtime, the SDKs readme will say so in the install instructions.
:::


```sh
sudo extism lib install
```

:::note
`sudo` may use a different path than your user. If so, you may need to tell sudo to use the PATH defined for your user with: `sudo -E env "PATH=$PATH" extism lib install`
:::

#### Installing the latest from git

It's also possible to install the latest build from the `main` git branch:

```sh
sudo extism lib install --version git
```

#### Overriding install location

Pass the `--prefix` argument a path on disk where `extism` CLI will install the system files:

```sh
extism lib install --prefix ~/.local
```

## Other CLI Features

```sh
Usage:
  extism [command]

Available Commands:
  call        Call a plugin function
  completion  Generate the autocompletion script for the specified shell
  help        Help about any command
  lib         Manage libextism

Flags:
      --github-token string   Github access token, can also be set using the $GITHUB_TOKEN env variable
  -h, --help                  help for extism
  -q, --quiet                 Enable additional logging
  -v, --verbose               Enable additional logging
      --version               version for extism

Use "extism [command] --help" for more information about a command.
```

### Call plug-in functions

You can use the `extism` CLI as a test runner to check your plug-ins outside of any Host program:

```sh
extism call --input "this is a test" test/code.wasm count_vowels
{"count": 4}
```

### Check installed version

The CLI can also be used to get information about the installed version of libextism:

```sh
extism lib check
v0.5.0
```
