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

Extism is available on `opam`:
```sh
opam install extism
```

### 2. Import the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code-functions.wasm > code.wasm
```
:::

```ocaml title=main.ml
open Extism

let () =
  let input =
    if Array.length Sys.argv > 1 then Sys.argv.(1) else "this is a test"
  in
  let manifest = Manifest.(create [ Wasm.file "../wasm/code.wasm" ]) in
  (* NOTE: if you encounter an error such as: 
     "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
     use [Plugin.of_manifest ~wasi:true] in the following line to provide WASI imports to your plugin. *)
  let plugin = Plugin.of_manifest manifest |> Error.unwrap in
  let res = Plugin.call plugin ~name:"count_vowels" input |> Error.unwrap in
  print_endline res;
  Plugin.free ctx
```

### Host Functions

It is also possible to create functions to expose additional functionality from the host. The first step
is to define a function with the proper signature:

```ocaml
let hello_world =
  let open Val_type in
  Function.create "hello_world" ~params:[ I64 ] ~results:[ I64 ]
    ~user_data:"Hello again!"
  @@ fun plugin params results user_data ->
  let open Types.Val_array in

  (* Print input argument *)
  let mem = Current_plugin.Memory_block.of_val_exn plugin params.$[0] in
  let s = Current_plugin.Memory_block.get_string plugin mem in
  let () = print_endline s in

  (* Print user data *)
  let () = print_endline (string_of_int user_data) in

  (* Set output pointer to input pointer *)
  results.$[0] <- params.$[0]
```

Then add it to the plugin when it's created: 

```ocaml
let functions = [ hello_world ] in
let plugin = Plugin.of_manifest ~functions manifest |> Error.unwrap in
```

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

