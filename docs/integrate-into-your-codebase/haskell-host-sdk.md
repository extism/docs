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

Install via `cabal` from git:

Add the git repository to your cabal project:
```title=cabal.project
source-repository-package
  type: git
  location: https://github.com/extism/extism.git
  subdir: haskell
```

Add the dependency to your cabal file:
```title=example.cabal
library
  build-depends: extism
```

### 2. Import the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```
:::

```haskell title=Main.hs
module Main where

import Extism
import Extism.Manifest(manifest, wasmFile)

unwrap (Right x) = x
unwrap (Left (ErrorMessage msg)) = do
  error msg

main = do
  context <- Extism.newContext
  plugin <- unwrap <$> Extism.pluginFromManifest context (manifest [wasmFile "../wasm/code.wasm"]) False 
  res <- unwrap <$> Extism.call plugin "count_vowels" (Extism.toByteString "this is a test")
  putStrLn (Extism.fromByteString res)
  Extism.free plugin
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

