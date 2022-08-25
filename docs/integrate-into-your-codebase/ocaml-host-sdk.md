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

Install via [opam](https://opam.ocaml.org/):
```sh
opam install extism
```

Install via `git`:
```sh
opam pin extism https://github.com/extism/extism.git#main
```

### 2. Import the library and use the APIs

```ocaml title=main.ml
open Extism

let () =
  let input =
    if Array.length Sys.argv > 1 then Sys.argv.(1) else "this is a test"
  in
  let manifest = Manifest.v [ Manifest.file "../wasm/code.wasm" ] in
  let plugin = Extism.register_manifest manifest in
  let res = Extism.call plugin ~name:"count_vowels" input |> Result.get_ok in
  print_endline res
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

