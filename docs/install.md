---
title: Extism CLI
sidebar_position: 5
---

The `extism` [CLI](https://github.com/extism/cli) is a useful but optional tool
for developing with Extism. It handles a few things such as installing the
shared library (Extism Runtime), or invoking plug-ins from the command line.

The following instructions will walk you through how to install the Extism CLI,
and then the installation of the shared library which a
[Host SDK](/docs/concepts/host-sdk) will look for automatically.

## Install the Extism CLI

```sh
curl -s https://get.extism.org/cli | sh
```

Or to a specific path:

```sh
curl -s https://get.extism.org/cli | sh -s -- -o $HOME/.local/bin
```

See the help output for more information:

```sh
curl -s https://get.extism.org/cli | sh -s -- -h
```

Releases are also available on Github: https://github.com/extism/cli/releases

:::warning Remove old installation If you have installed the old cli via python,
you may need to remove it:

> ```sh
> pip3 uninstall extism_cli --break-system-packages
> which extism # shouldn't print anything, if it does, delete it
> ```

:::

## Using the Extism CLI

The most common use-case is to to install Extism from Github releases, and then
install the library and header file into the installation prefix of your choice.
The default prefix is `/usr/local`, so libraries will be installed to
`/usr/local/lib` and the header will be installed to `/usr/local/include`.

:::note Some language SDKs come bundled with the runtime and some need you to
install the runtime separately. If your language needs you to install the
runtime, the SDKs readme will say so in the install instructions. :::

```sh
sudo extism lib install
```

:::note `sudo` may use a different path than your user. If so, you may need to
tell sudo to use the PATH defined for your user with:
`sudo -E env "PATH=$PATH" extism lib install` :::

#### Installing the latest from git

It's also possible to install the latest build from the `main` git branch:

```sh
sudo extism lib install --version git
```

#### Overriding install location

Pass the `--prefix` argument a path on disk where `extism` CLI will install the
system files:

```sh
extism lib install --prefix ~/.local
```

## Generating Plugin PDK Starters

You can use the [Extism CLI](https://github.com/extism/cli) to quickly start a
new plugin project:

```sh
extism generate plugin -o new-plugin
Select a PDK language to use for your plugin:  
                                                
> 1. Rust                                      
  2. JavaScript                                
  3. Go                                        
  4. Zig                                       
  5. C#                                        
  6. F#                                        
  7. C                                         
  8. Haskell                                   
  9. AssemblyScript
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

You can use the `extism` CLI as a test runner to check your plug-ins outside of
any Host program:

```sh
extism call --input "this is a test" test/code.wasm count_vowels
{"count": 4}
```

For plugins which require manifest and configuration properties to be set, you can pass these as flags to the `call` command.

Use `extism help call` to explore the available flags:

```sh
Usage:
  extism call [flags] wasm_file function

Flags:
      --allow-host stringArray                  Allow access to an HTTP host, if no hosts are listed then all requests will fail. Globs may be used for wildcards
      --allow-path stringArray                  Allow a path to be accessed from inside the Wasm sandbox, a path can be either a plain path or a map from HOST_PATH:GUEST_PATH
      --config stringArray                      Set config values, should be in KEY=VALUE format
  -h, --help                                    help for call
      --http-response-max extism_http_request   Maximum HTTP response size in bytes when using extism_http_request (default -1)
  -i, --input string                            Input data
      --link stringArray                        Additional modules to link
      --log-level string                        Set log level: trace, debug, warn, info, error
      --loop int                                Number of times to call the function (default 1)
  -m, --manifest                                When set the input file will be parsed as a JSON encoded Extism manifest instead of a WASM file
      --memory-max int                          Maximum number of pages to allocate
      --set-config config                       Create config object using JSON, this will be merged with any config arguments
      --stdin                                   Read input from stdin
      --timeout uint                            Timeout in milliseconds
      --var-max int                             Maximum size in bytes of Extism var store (default -1)
      --wasi                                    Enable WASI

Global Flags:
      --github-token string   Github access token, can also be set using the $GITHUB_TOKEN env variable
  -q, --quiet                 Suppress output
  -v, --verbose               Enable additional logging

```

### Check installed version

The CLI can also be used to get information about the installed version of
libextism:

```sh
extism lib check
v0.5.0
```
