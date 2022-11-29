---
title: Rust
tags:
    - rust
    - host sdk
---

# Using the Rust Host SDK


:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

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

```rust title=main.rs
use extism::{Context, Plugin};

fn main() {
    let wasm = include_bytes!("../../wasm/code.wasm");
    let context = Context::new();
    let mut plugin = Plugin::new(&context, wasm, false).unwrap();
    let data = plugin.call("count_vowels", "this is a test").unwrap();
    assert_eq!(data, b"{\"count\": 4}");
}
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

