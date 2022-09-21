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
cargo build --release --target wasm32-unknown-unknown #wasm32-wasi is also supported
```

### Example Usage
```rust title=example.rs
#![no_main]

use extism_pdk::*;
use serde::Serialize;
use serde_json;

const VOWELS: &[char] = &['a', 'A', 'e', 'E', 'i', 'I', 'o', 'O', 'u', 'U'];

#[derive(Serialize)]
struct TestOutput {
    pub count: i32,
    pub config: String,
    pub a: String,
}

#[no_mangle]
unsafe fn count_vowels() -> i32 {
    let host = Host::new();
    let s = host.input_str();

    let mut count = 0;
    for ch in s.chars() {
        if VOWELS.contains(&ch) {
            count += 1;
        }
    }

    // Additional plug-in APIs:

    // persistent variables (scoped to individual plugin)
    let mut vars = host.vars();
    vars.set("a", "this is var a");

    let a = vars.get("a").expect("variable 'a' set").into_inner();
    let a = String::from_utf8(a).expect("string from varible value");

    // config, provided by the host
    let config = host
        .config("thing")
        .expect("'thing' key set in config")
        .into_inner();

    let output = TestOutput { count, config, a };

    // write data back to host for use in program
    host.output(&serde_json::to_string_pretty(&output).expect("json serialize output"));
    0
}
```

### Example Usage: PNG Inverter

```rust file=invert.rs
use extism_pdk::*;
use ril::Image;
use serde::{Deserialize, Serialize};
use serde_json::from_slice;

// Data provided to the Plug-in from the Host, deserialized from input bytes
#[derive(Deserialize)]
struct EventInput {
    pub event_file_name: String,
    pub event_file_data: String,
}

// Data returned from the Plug-in to the Host, serialized to output bytes
#[derive(Serialize)]
struct EventOutput {
    pub op: String,
    pub output_file_name: String,
    pub output_file_data: String,
}

#[no_mangle]
pub extern "C" fn should_handle_file() -> i32 {
    let host = Host::new();
    let file_name = host.input_str();

    // only handle .png files, ignore all others
    if file_name.ends_with(".png") {
        return 0;
    }

    return 1;
}

#[no_mangle]
pub extern "C" fn on_file_write() -> i32 {
    let host = Host::new();
    let file_data = host.input();
    let input = from_slice::<EventInput>(file_data).expect("json from host");
    let bytes = base64::decode(input.event_file_data).expect("decode png");

    let mut image: Image<ril::pixel::Rgba> =
        Image::from_bytes(ril::ImageFormat::Png, bytes).expect("parse png");

    image.invert();

    let mut dest = vec![];
    image
        .encode(ril::ImageFormat::Png, &mut dest)
        .expect("encode png");

    // write the bytes back to the host to be saved as the original file
    let out = EventOutput {
        op: String::from("overwrite"),
        output_file_name: input.event_file_name,
        output_file_data: base64::encode(dest),
    };
    let bytes = serde_json::to_vec(&out).expect("json output to host");

    // enable allocation from host to be transferred to the caller directly avoiding a copy
    let output = host.alloc_bytes(&bytes);
    host.output_memory(&output);

    return 0;
}
```
