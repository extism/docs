---
title: Haskell
sidebar_position: 4
---

## How to install and use the Extism Haskell PDK

### Installation

Add to your `cabal.project` file:

```
package my-package
  ghc-options:
    -optl -Wl,--export=hs_init -optl -Wl,--allow-undefined -no-hs-main -optl-mexec-model=reactor 
```

To export a specific function using `foreign export` you should also include the following in your
plugin's executable stanza:

```
  build-depends: extism-pdk
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
module CountVowels where

import Extism.PDK
import Extism.PDK.JSON

isVowel c = 
  c == 'a' || c == 'A' ||
  c == 'e' || c == 'E' ||
  c == 'i' || c == 'I' ||
  c == 'o' || c == 'O' ||
  c == 'u' || c == 'U'

countVowels = do
  -- Get input string from Extism host
  s <- inputString
  -- Calculate the number of vowels
  let count = length (filter isVowel s)
  -- Return a JSON object {"count": count} back to the host
  outputJSON $ object ["count" .= count]

foreign export ccall "count_vowels" countVowels ::  IO ()
```

#### Using Extism built-in HTTP

```haskell title=HTTPGet.hs
module HTTPGet where

import Extism.PDK
import Extism.PDK.HTTP

httpGet = do
  -- Get URL from the host
  url <- inputString
  -- Create a new 'Request'
  let req = newRequest url
  -- Send the request, get a 'Response'
  res <- sendRequest req Nothing
  -- Save response body to memory
  outputMemory (memory res)

foreign export ccall "http_get" httpGet ::  IO ()
```

#### Using `Config`

```haskell title=Hello.hs
module Hello where

import Extism.PDK
import Data.Maybe

greet g n =
  outputString $ g ++ ", " ++ n

hello = do
  -- Get a name from the Extism runtime
  name <- inputString
  -- Get  configured greeting
  greeting <- getConfig "greeting"
  -- Greet the user, if no greeting is configured then "Hello" is used
  greet (fromMaybe "Hello" greeting) name

foreign export ccall "hello" hello ::  IO ()
```
