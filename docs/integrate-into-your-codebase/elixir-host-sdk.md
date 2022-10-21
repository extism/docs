---
title: Elixir / Erlang
tags:
    - elixir
    - erlang
    - host sdk
---

# Using the Elixir / Erlang Host SDK

:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the package

Install via [hex.pm](https://hex.pm/packages/extism):

For Mix:

```elixir
{:extism, "~> 0.0.1-rc.5"}
```

### 2. Import the library and use the APIs

```elixir
require Extism

# point to the count-vowels plugin on my machine
manifest = %{ wasm: [ %{ path: "/Users/ben/.extism/extism/wasm/code.wasm" } ]}
{:ok, plugin} = Extism.Context.new_plugin(ctx, manifest, false)
{:ok, output} = Extism.Plugin.call(plugin, "count_vowels", "this is a test")
JSON.decode!(output)
# => %{"count" => 4}
```

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

