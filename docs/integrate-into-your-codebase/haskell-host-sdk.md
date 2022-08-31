---
title: Haskell
tags:
    - haskell
    - host sdk
---

# Using the Haskell Host SDK


:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the Haskell library

Install via `stack`:
```yaml title=stack.yaml
extra-deps:
  - git: https://github.com/extism/extism.git
    commit: # TODO
```

### 2. Import the library and use the APIs

```haskell title=Main.hs
module Main where

import System.Exit (exitFailure, exitSuccess)
import qualified Data.ByteString as B
import Extism
import Extism.Manifest

main = do
  plugin <- Extism.registerManifest (manifest [wasmFile "../wasm/code.wasm"]) False
  res <- Extism.call plugin "count_vowels" (Extism.toByteString "this is a test")
  case res of
    Right (Error msg) -> do
      _ <- putStrLn msg
      exitFailure
    Left bs -> do
      _ <- putStrLn (Extism.fromByteString bs)
      exitSuccess
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

