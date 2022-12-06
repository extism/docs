---
title: Haskell
sidebar_position: 3
---

## How to install and use the Extism Haskell PDK

### Before you start

- This library is intended to be used with [wasm32-wasi-ghc](https://gitlab.haskell.org/ghc/ghc-wasm-meta)
- The Haskell PDK is different from the other PDKs because it requires WASI and the resulting plugins expose a 
  single `_start` function instead of named functions.  It is possible to export named Haskell functions, 
  however because Haskell has a runtime that needs to be initialized it's not possible to call them directly.
- If you're geting linker errors about undefined Extism functions when compiling a plugin then the following 
  arguments need to be passed to GHC: `-optl -Wl,--allow-undefined`
  (see [extism-pdk.cabal](https://github.com/extism/haskell-pdk/tree/main/extism-pdk.cabal))

### Installation

Add to your `cabal.project` file:

```
source-repository-package
  type: git
  location: https://github.com/extism/extism.git
  subdir: haskell

source-repository-package
  type: git
  location: https://github.com/extism/haskell-pdk.git
```

### Compiling to WebAssembly

Install the `wasm`-ready version of the Haskell toolchain, following [these instructions](https://gitlab.haskell.org/ghc/ghc-wasm-meta), and run:

```sh
wasm32-wasi-cabal build
```

### Example Usage

> **NOTE:** All Haskell-based plug-ins will require an Extism host to enable `WASI` from its SDK.

#### Using JSON

```haskell title=CountVowels.hs
module Main where

import Extism.PDK
import Extism.PDK.JSON

isVowel c = 
  c == 'a' || c == 'A' ||
  c == 'e' || c == 'E' ||
  c == 'i' || c == 'I' ||
  c == 'o' || c == 'O' ||
  c == 'u' || c == 'U'

main = do
  -- Get input string from Extism host
  s <- inputString
  -- Calculate the number of vowels
  let count = length (filter isVowel s)
  -- Return a JSON object {"count": count} back to the host
  outputJSON $ object ["count" .= count]
```

#### Using Extism built-in HTTP

```haskell title=HTTPGet.hs
module Main where

import Extism.PDK
import Extism.PDK.HTTP

main = do
  -- Get URL from the host
  url <- inputString
  -- Create a new 'Request'
  let req = newRequest url
  -- Send the request, get a 'Response'
  res <- sendRequest req Nothing
  -- Save response body to memory
  outputMemory (memory res)
```

#### Using I/O

```haskell title=Hello.hs
module Main where

import Extism.PDK
import Data.Maybe

greet g n =
  outputString $ g ++ ", " ++ n

main = do
  -- Get a name from the Extism runtime
  name <- inputString
  -- Get  configured greeting
  greeting <- getConfig "greeting"
  -- Greet the user, if no greeting is configured then "Hello" is used
  greet (fromMaybe "Hello" greeting) name
```
