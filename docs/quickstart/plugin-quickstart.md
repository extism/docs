---
title: Write a Plug-in
toc_max_heading_level: 2
tags:
    - plugin pdk
    - quickstart
---

# Quickstart

The following provides a minimal guide to running writing Extism plug-in in your language
of choice. This document should get you from 0 to "hello, world!" as quick as possible.

## Choose A Language

In Extism, your plug-in code is compiled to a binary Wasm module.
We offer a variety of libraries, which we call PDKs (Plug-in Development Kits), to help you compile
your code to a Wasm module that can be embedded in any Host SDK.
First choose a language for your plug-in:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="Rust" label="Rust" default>

### Install the Dependency

Generate a `lib` project with Cargo:

```bash
cargo new --lib my-plugin
```

Add the library from [crates.io](https://crates.io/crates/extism-pdk).

```bash
cargo add extism-pdk@1.0.0-rc1
```

Change your `Cargo.toml` to set the crate-type to `cdylib` (this instructs the compiler to produce a dynamic library, which for our target will be a Wasm binary):

```toml
[lib]
crate_type = ["cdylib"]
```

### Create an Export

The primary means of interacting with this plug-in is an export function that can be called by the outside world.
Let's create a simple greeting plug-in. The `plugin_fn` macro wires this function to Extism and exports it
using the name `greet`:

```rust
use extism_pdk::*;

#[plugin_fn]
pub fn greet(name: String) -> FnResult<String> {
    Ok(format!("Hello, {}!", name))
}
```

### Compile the Plug-in

We can compile to the `wasm32-unknown-unknown` since we don't need to make any syscalls:

```bash
cargo build --target wasm32-unknown-unknown
```

:::note Wasm32 Targets
If this fails, make sure you have added this target to rust:
> rustup target add wasm32-unknown-unknown
:::

### Running the Plug-In

This will put your compiled wasm in `target/wasm32-unknown-unknown/debug`.
We can now test it using the [Extism CLI](https://github.com/extism/cli)'s `run`
command:

```bash
extism call target/wasm32-unknown-unknown/debug/my_plugin.wasm greet --input "Benjamin"
# => Hello, Benjamin!
```

### Documentation

Congrats! You just wrote your first Extism plug-in! To learn more about what this
rust library can do, see the [rust-pdk README](https://github.com/extism/rust-pdk#readme) and [reference docs](https://docs.rs/extism-pdk/latest/extism_pdk/).

  </TabItem>
  <TabItem value="JavaScript" label="JavaScript">

### Install the Dependency

First install the Extism JS compiler with this install script:

```bash
curl -O https://raw.githubusercontent.com/extism/js-pdk/main/install.sh
sh install.sh
```

Then run command with no args to see the help:

```bash
extism-js
error: The following required arguments were not provided:
    <input>

USAGE:
    extism-js <input> -o <output>

For more information try --help
```

:::note Mac Quarantine
If you are using mac, you may need to tell your security system this unsigned binary is fine.
:::

### Create an Export

The primary means of interacting with this plug-in is an export function that can be called by the outside world.
Let's create a simple greeting plug-in. Just like a normal JS module, any function we
export will be accessible to the outside world:

```javascript
function greet() {
    const name = Host.inputString()
    Host.outputString(`Hello, ${name}`)
}

module.exports = {greet}
```

### Compile the Plug-in

Now we must compile this plug-in to wasm:

```bash
extism-js plugin.js -o plugin.wasm
```

### Running the Plug-In

We can now test it using the [Extism CLI](https://github.com/extism/cli)'s `run`
command:

```bash
extism call plugin.wasm greet --input "Benjamin" --wasi
# => Hello, Benjamin!
```

:::note Wasi 
At this time, all js plug-ins need WASI to run
:::

### Documentation

Congrats! You just wrote your first Extism plug-in! To learn more about what this
js library can do, see the [js-pdk README](https://github.com/extism/js-pdk#readme).

  </TabItem>
  <TabItem value="Go" label="Go">

### Install the Dependency

Include the library with Go get:

```bash
go get github.com/extism/go-pdk
```

### Create an Export

The primary means of interacting with this plug-in is an export function that can be called by the outside world.
Let's create a simple greeting plug-in.


```go
package main

import (
	"github.com/extism/go-pdk"
)

//export greet
func greet() int32 {
	input := pdk.Input()
	greeting := `Hello, ` + string(input) + `!`
	pdk.OutputString(greeting)
	return 0
}

func main() {}
```

:::note Magic Comment
The magic comment `//export` is what exports the function to the outside world:
:::

### Compile the Plug-in

Now we must compile this plug-in to wasm. Currently the best way to do this is with [tinygo](https://tinygo.org/):

```bash
tinygo build -o plugin.wasm -target wasi main.go
```

### Running the Plug-In

We can now test it using the [Extism CLI](https://github.com/extism/cli)'s `run`
command:

```bash
extism call plugin.wasm greet --input "Benjamin" --wasi
# => Hello, Benjamin!
```

:::note Wasi 
At this time, all Go plug-ins need WASI to run
:::

### Documentation

Congrats! You just wrote your first Extism plug-in! To learn more about what this
go library can do, see the [go-pdk README](https://github.com/extism/go-pdk#readme).

  </TabItem>
  <TabItem value="C#" label="C#">


### Prerequisites

1. .NET SDK 8: https://dotnet.microsoft.com/en-us/download/dotnet/8.0
2. WASI Workload:
```
dotnet workload install wasi-experimental
```
3. WASI SDK: https://github.com/WebAssembly/wasi-sdk/releases


### Install the Dependency

Create a new project and add this nuget package to your project:

```
dotnet new wasiconsole -o MyPlugin
cd MyPlugin
dotnet add package Extism.Pdk --prerelease
```

Update your `MyPlugin.csproj` as follows:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <RuntimeIdentifier>wasi-wasm</RuntimeIdentifier>
    <OutputType>Exe</OutputType>
    <PublishTrimmed>true</PublishTrimmed>

    <!-- Make sure we create a standalone wasm file for our plugin -->
    <WasmSingleFileBundle>true</WasmSingleFileBundle>
    <WasmBuildNative>true</WasmBuildNative>
  </PropertyGroup>
</Project>
```

### Create an Export

The primary means of interacting with this plug-in is an export function that can be called by the outside world.
Let's create a simple greeting plug-in.

```csharp
using System;
using System.Runtime.InteropServices;
using System.Text.Json;
using Extism;

namespace MyPlugin;
public class Functions
{
    [UnmanagedCallersOnly(EntryPoint = "greet")]
    public static int Greet()
    {
        var name = Pdk.GetInputString();
        var greeting = $"Hello, {name}!";
        Pdk.SetOutput(greeting);

        return 0;
    }

    // Note: a `Main` method is required for the app to compile
    public static void Main() {}
}
```

### Compile the Plug-in

Compile as normal with dotnet:

```bash
dotnet build
```

### Running the Plug-In

This will create a `MyPlugin.wasm` file in `bin/Debug/net8.0/wasi-wasm/AppBundle`. Now, you can try out your plugin by using any of the [Extism SDKs](https://extism.org/docs/category/integrate-into-your-codebase) or by using [Extism CLI](https://extism.org/docs/install)'s `run` command:

```bash
extism call .\bin\Debug\net8.0\wasi-wasm\AppBundle\MyPlugin.wasm greet --input "Benjamin" --wasi
# => Hello, Benjamin!
```

### Documentation

Congrats! You just wrote your first Extism plug-in! To learn more about what this
dotnet library can do, see the [dotet-pdk README](https://github.com/extism/dotnet-pdk#readme).

  </TabItem>
  <TabItem value="F#" label="F#">


### Prerequisites

1. .NET SDK 8: https://dotnet.microsoft.com/en-us/download/dotnet/8.0
2. WASI Workload:
```
dotnet workload install wasi-experimental
```
3. WASI SDK: https://github.com/WebAssembly/wasi-sdk/releases


### Install the Dependency

Create a new project and add this nuget package to your project:

```
dotnet new wasiconsole -lang "F#" -o MyPlugin
cd MyPlugin
dotnet add package Extism.Pdk --prerelease
```

Update your `MyPlugin.fsproj` as follows:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <RuntimeIdentifier>wasi-wasm</RuntimeIdentifier>
    <OutputType>Exe</OutputType>
    <PublishTrimmed>true</PublishTrimmed>

    <!-- Make sure we create a standalone wasm file for our plugin -->
    <WasmSingleFileBundle>true</WasmSingleFileBundle>
    <WasmBuildNative>true</WasmBuildNative>
  </PropertyGroup>
</Project>
```

### Create an Export

The primary means of interacting with this plug-in is an export function that can be called by the outside world.
Let's create a simple greeting plug-in.

```fsharp
module MyPlugin

open System
open System.Runtime.InteropServices
open Extism

[<UnmanagedCallersOnly(EntryPoint = "greet")>]
let Greet () : int32 =
    let name = Pdk.GetInputString()
    let greeting = $"Hello, {name}!"
    Pdk.SetOutput(greeting)
    0
    
[<EntryPoint>]
let Main args  =
    // Note: an `EntryPoint` function is required for the app to compile
    0
```

### Compile the Plug-in

Compile as normal with dotnet:

```bash
dotnet build
```

### Running the Plug-In

This will create a `MyPlugin.wasm` file in `bin/Debug/net8.0/wasi-wasm/AppBundle`. Now, you can try out your plugin by using any of the [Extism SDKs](https://extism.org/docs/category/integrate-into-your-codebase) or by using [Extism CLI](https://extism.org/docs/install)'s `run` command:

```bash
extism call .\bin\Debug\net8.0\wasi-wasm\AppBundle\MyPlugin.wasm greet --input "Benjamin" --wasi
# => Hello, Benjamin!
```

### Documentation

Congrats! You just wrote your first Extism plug-in! To learn more about what this
dotnet library can do, see the [dotet-pdk README](https://github.com/extism/dotnet-pdk#readme).

  </TabItem>
  <TabItem value="C" label="C">

### Install the Dependency

The quickest way to getting started is to vendor the source for the PDK as a git submodule:

```bash
git submodule add https://github.com/extism/c-pdk extism-pdk
```

### Create an Export

The primary means of interacting with this plug-in is an export function that can be called by the outside world.
Let's create a simple greeting plug-in.

```c title=main.c
#include "extism-pdk.h"

const char *greeting = "Hello, ";
uint64_t greetingLen = 7;

int32_t greet() {
  uint64_t inputLen = extism_input_length();

  // Load input
  uint8_t inputData[inputLen];
  extism_load_input(inputData, inputLen);

  // Allocate a new offset used to store greeting and name
  uint64_t outputLen = greetingLen + inputLen;
  ExtismPointer offs = extism_alloc(outputLen);
  extism_store(offs, (const uint8_t *)greeting, greetingLen);
  extism_store(offs + greetingLen, inputData, inputLen);

  // Set output
  extism_output_set(offs, outputLen);
  return 0;
}
```

### Compile the Plug-in

Compile with clang and target `wasm32-unknown-unknown`:

```bash
clang -o plugin.wasm --target=wasm32-unknown-unknown -nostdlib -Wl,--no-entry -Wl,--export=greet main.c
```

:::note Exports
Note that we must explicitly export the `greet` function at compile time.
:::

### Running the Plug-In

This will create a `plugin.wasm` file. Now, you can try out your plugin by using any of the [Extism SDKs](https://extism.org/docs/category/integrate-into-your-codebase) or by using [Extism CLI](https://extism.org/docs/install)'s `run` command:

```bash
extism call plugin.wasm greet --input "Benjamin"
# => Hello, Benjamin!
```

### Documentation

Congrats! You just wrote your first Extism plug-in! To learn more about what this
c library can do, see the [c-pdk README](https://github.com/extism/extism/libextism#readme).

  </TabItem>
  <TabItem value="C++" label="C++">
  </TabItem>
  <TabItem value="Haskell" label="Haskell">
  </TabItem>
  <TabItem value="Zig" label="Zig">
  </TabItem>
</Tabs>


## Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!
