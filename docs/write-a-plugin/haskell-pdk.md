---
title: Haskell
sidebar_position: 3
---

## How to install and use the Extism Haskell PDK

### Installation

Add to your `cabal.project` file:

```
source-repository-package
  type: git
  location: https://github.com/extism/extism.git
  subdir: haskell/manifest

source-repository-package
  type: git
  location: https://github.com/extism/haskell-pdk.git

package my-package
  ghc-options:
    -optl -Wl,--export=hs_init -optl -Wl,--export=hs_exit -optl -Wl,--allow-undefined 
```

To export a specific function using `foreign export` you should also include the following in your
plugin's executable stanza:

```
  ghc-options:
    -optl -Wl,--export=myFunction
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
