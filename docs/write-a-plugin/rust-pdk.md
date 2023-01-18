---
title: Rust
sidebar_position: 1
---

## How to install and use the Extism Rust PDK

### Create a Rust project

```sh
cargo new --lib my-plugin
```

In the generated `Cargo.toml`, be sure to include:

```toml
[lib]
crate_type = ["cdylib"]
```

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

[https://docs.rs/extism-pdk](https://docs.rs/extism-pdk)

### Example Usage

#### Using Config, I/O, & Persisted Variables

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

#### Using Extism built-in HTTP

```rust title=lib.rs
use extism_pdk::*;

#[plugin_fn]
// see https://docs.rs/extism-pdk/latest/extism_pdk/struct.HttpRequest.html for docs on this type
pub fn http_get(Json(req): Json<HttpRequest>) -> FnResult<HttpResponse> {
    info!("Request to: {}", req.url);
    let res = http::request::<()>(&req, None)?;
    Ok(res)
}
```

#### Host functions

A host function can be imported using an extern function:

```rust
use extism_pdk::*;

extern "C" {
    fn hello_world(ptr: i64) -> i64;
}
```
