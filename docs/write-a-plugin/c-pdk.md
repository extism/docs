---
title: C
sidebar_position: 5
---

## How to install and use the Extism C PDK

### Installation

```sh
git submodule add https://github.com/extism/c-pdk extism
```

:::note Choose a version

It is recommended that you lock this submodule to a release tag.

First edit `.gitmodules` to point to the tag

```
[submodule "extism"]
	path = extism
	url = https://github.com/extism/c-pdk
	tag = v0.2.0
```

> **N.B.**: See the [c-pdk releases](https://github.com/extism/c-pdk/releases) page for available versions

Then update:

```
git submodule foreach --recursive 'git fetch --tags'
git submodule update --init --recursive --remote
git commit -am 'Lock extism version to v0.2.0'
```

:::

### Compiling to WebAssembly

Download the Emscripten [SDK & toolchain](https://emscripten.org/index.html), and using `emcc`:

```sh
emcc -o example.wasm example/count_vowels.c --no-entry -Wl,--export-all -sERROR_ON_UNDEFINED_SYMBOLS=0
```

### Example Usage
```c title=main.c
#include "extism/extism-pdk.h"

#include <stdio.h>

int32_t count_vowels()
{
  uint64_t length = extism_input_length();

  if (length == 0)
  {
    return 0;
  }

  int64_t count = 0;
  char ch = 0;
  for (int64_t i = 0; i < length; i++)
  {
    ch = extism_input_load_u8(i);
    if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' ||
        ch == 'A' || ch == 'E' || ch == 'I' || ch == 'O' || ch == 'U')
    {
      count += 1;
    }
  }

  char out[128];
  int n = snprintf(out, 128, "{\"count\": %lld}", count);

  uint64_t offs_ = extism_alloc(n);
  extism_store(offs_, (const uint8_t *)out, n);
  extism_output_set(offs_, n);

  return 0;
}
```

> **NOTE:** The usage of `stdio.h` will require that this module is executed using `WASI`.
