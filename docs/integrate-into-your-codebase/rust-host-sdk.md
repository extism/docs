---
title: Rust
tags:
    - rust
    - host sdk
---

# Using the Rust Host SDK

### 1. Install the Rust crate

Install via [Crates.io](https://crates.io/):

```sh
cargo add extism
```

:::note

If you need unreleased functionality you can install via git:

```sh
cargo add extism --git https://github.com/extism/extism.git
```

:::

### 2. Import the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```
:::

```rust title=main.rs
use extism::{Plugin};

fn main() {
    let wasm = include_bytes!("code.wasm");
    // NOTE: if you encounter an error such as: 
    // "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
    // change `false` to `true` in the following function to provide WASI imports to your plugin.
    let mut plugin = Plugin::create(wasm, [], false).unwrap();
    let data = plugin.call("count_vowels", "this is a test").unwrap();
    assert_eq!(data, b"{\"count\": 4}");
}
```

### Host Functions


It is also possible to create functions to expose additional functionality from the host by using [Host Functions](/docs/concepts/host-functions/).

:::note Count Vowels Plugin
To run this example, use the version of the count vowels plugin with the example host function:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code-functions.wasm > code.wasm
```

The first step is to create a function with the proper signature:

```rust
use extism::{Val, CurrentPlugin, UserData};
fn hello_world(
    _plugin: &mut CurrentPlugin,
    inputs: &[Val],
    outputs: &mut [Val],
    _user_data: UserData,
) -> Result<(), Error> {
    println!("Hello from Rust!");
    outputs[0] = inputs[0].clone();
    Ok(())
}
```
Then add it to the plugin when it's created: 

```rust
use extism::{Function};
let f = Function::new(
    "hello_world",
    [ValType::I64],
    [ValType::I64],
    None,
    hello_world,
);
let functions = [&f];
let mut plugin = Plugin::create(WASM, functions, true).unwrap();
```

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

