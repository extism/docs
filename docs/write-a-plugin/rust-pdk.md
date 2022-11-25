---
title: Rust
sidebar_position: 1
---

## How to install and use the Extism Rust PDK

### Installation

```sh
cargo add extism-pdk
```

### Compiling to WebAssembly

```sh
cargo build --release --target wasm32-unknown-unknown
```

> **NOTE:** `--target wasm32-wasi` is also fully supported

### Latest Docs

[https://docs.rs/extism-pdk/latest/extism_pdk/](https://docs.rs/extism-pdk/latest/extism_pdk/)

### Example Usage
```rust title=lib.rs
use extism_pdk::*;
use serde::Serialize;

const VOWELS: &[char] = &['a', 'A', 'e', 'E', 'i', 'I', 'o', 'O', 'u', 'U'];

#[derive(Serialize)]
struct TestOutput {
    pub count: i32,
    pub config: String,
    pub a: String,
}

#[plugin_fn]
pub fn count_vowels(input: String) -> FnResult<Json<TestOutput>> {
    let mut count = 0;
    for ch in input.chars() {
        if VOWELS.contains(&ch) {
            count += 1;
        }
    }

    set_var!("a", "this is var a")?;

    let a = var::get("a")?.expect("variable 'a' set");
    let a = String::from_utf8(a).expect("string from varible value");
    let config = config::get("thing").expect("'thing' key set in config");

    let output = TestOutput { count, config, a };
    Ok(Json(output))
}
```