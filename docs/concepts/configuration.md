---
title: Configuration
sidebar_position: 6
---

:::info Feedback Wanted

Configuration for both Host and Plug-in environments is still being worked on, and we expect to collaborate with users on exactly how it should be done. Please reach out on [GitHub](https://github.com/extism/extism) or join the [Discord](https://discord.gg/cx3usBCWnc) and share your thoughts.

:::

Generally speaking, all configuration is defined at the Host level. As a plug-in, you are able to configuration data that has been provided by a Host, but you cannot edit runtime configuration. The sections below go into further detail about configurability, as well as some advanced functionality which require Extism to be built from source with specific feature flags.

## Plug-ins

The most typical configuration you may elect to set as a Host is whether or not a plug-in is given access to [`WASI`](https://wasi.dev/) functions - things like making a network request or accessing files on disk.

Outside of `WASI` enablement, most plug-in configuration is done using [The Manifest](/docs/concepts/manifest), this includes setting things like which network hosts or file paths a plug-in has access to. However, there is another more generic option you can use as well when you don't want to use a manifest: the configuration object. 

In each [Host SDK](/docs/category/integrate-into-your-codebase/), functionality is provided to allow a Host to pass arbitrary configuration data to plug-ins. This function is called something like `SetConfig`, or this configuration object can be included in the SDKs' `Manifest` equivalent.

To use this configuration data from within a plug-in, each [PDK](/docs/category/write-a-plug-in/) provides functions to access values of the configuration provided.

## Hosts / Runtime

There are additional configuration options at the Host / runtime level, which you may need to enable by building Extism from source and adding the appropriate feature flags. 

### Feature Flags

The following optional (non-default) flags are available: 

- **`nn`**: Provides the ability to perform ML inference from within a plug-in. This feature will link additional `WASI` API functions, adding to the size of the embedded runtime, and therefore not enabled by default. See [WebAssembly/wasi-nn](https://github.com/WebAssembly/wasi-nn) proposal for more information about using this.

If you would like to enable any of the features above, please follow the instructions below: 

```sh
git clone git@github.com:extism/extism.git
cd extism
cargo build --release --features http,register-http,register-filesystem,nn

# once complete, a libextism.so or libextism.dylib should be in the target/release/ directory.
```

By default, the following flags are included in our official releases. You can disable them by following the same instructions above, and removing the features you do not want included.

- **`register-http`**: Enables .wasm plug-ins to be downloaded using HTTP (expects network availability).
- **`register-filesystem`**: Enables .wasm plug-ins to be loaded from disk.
- **`http`**: Enables `extism_http_request` (a non-`WASI` HTTP interface enabling plug-ins to make outbound requests).
