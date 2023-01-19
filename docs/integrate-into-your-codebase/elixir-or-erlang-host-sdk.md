---
title: Elixir / Erlang
tags:
    - elixir
    - erlang
    - host sdk
---

# Using the Elixir / Erlang Host SDK

### 1. Install the package

Install via [hex.pm](https://hex.pm/packages/extism):

For Mix:

```elixir
{:extism, "~> 0.2.0"}
```

:::note Rust Dependency

The extism package is written in rust and the NIF must be compiled in your application with mix.
Because of that, [installing rust](https://www.rust-lang.org/tools/install) is currently a requirement.
We recommend installing `rustup`.

:::

### 2. Import the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```
:::

```elixir
require Extism

ctx = Extism.Context.new
# point to the count-vowels plugin on my machine
manifest = %{ wasm: [ %{ path: "code.wasm" } ]}
# NOTE: if you encounter an error such as: 
# "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
# change `false` to `true` in the following function to provide WASI imports to your plugin.
{:ok, plugin} = Extism.Context.new_plugin(ctx, manifest, false)
{:ok, output} = Extism.Plugin.call(plugin, "count_vowels", "this is a test")
JSON.decode!(output)
# => %{"count" => 4}
```

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

