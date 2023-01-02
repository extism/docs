---
title: OCaml
tags:
    - ocaml
    - host sdk
---

# Using the OCaml Host SDK


:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the OCaml library

Extism is not yet released on `opam`

Install via `git`:
```sh
opam install https://github.com/extism/extism.git#main
```

### 2. Import the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```
:::

```ocaml title=main.ml
open Extism

let () =
  let input =
    if Array.length Sys.argv > 1 then Sys.argv.(1) else "this is a test"
  in
  let ctx = Context.create () in
  let manifest = Manifest.v [ Manifest.file "../wasm/code.wasm" ] in
  (* NOTE: if you encounter an error such as: 
     "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
     use [Plugin.of_manifest ~wasi:true] in the following line to provide WASI imports to your plugin. *)
  let plugin = Plugin.of_manifest ctx manifest |> Result.get_ok in
  let res = Plugin.call plugin ~name:"count_vowels" input |> Result.get_ok in
  print_endline res;
  Context.free ctx
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

