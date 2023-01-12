---
title: C++
tags:
    - cpp
    - host sdk
---

# Using the C++ Host SDK


:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the C++ library

Install via `git`:
```sh
git submodule add https://github.com/extism/extism extism
```

:::note Choose a version

It is recommended that you lock this submodule to a release tag.

First edit `.gitmodules` to point to the tag

```
[submodule "extism"]
	path = extism
	url = https://github.com/extism/extism
	tag = v0.1.0
```

> **N.B.**: See the [Extism releases](https://github.com/extism/extism/releases) page for available versions

Then update:

```
git submodule foreach --recursive 'git fetch --tags'
git submodule update --init --recursive --remote
git commit -am 'Lock extism version to v0.1.0'
```

:::

### 2. Include the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code-functions.wasm > code.wasm
```
:::

```c title=main.cpp
#include "extism/cpp/extism.hpp"


#include <cstring>
#include <fstream>
#include <iostream>

using namespace extism;

std::vector<uint8_t> read(const char *filename) {
  std::ifstream file(filename, std::ios::binary);
  return std::vector<uint8_t>((std::istreambuf_iterator<char>(file)),
                              std::istreambuf_iterator<char>());
}

int main(int argc, char *argv[]) {
  auto wasm = read("../wasm/code.wasm");
  Context context = Context();
  
  // A lambda can be used as a host function
  auto hello_world = [&tmp](CurrentPlugin plugin,
                            const std::vector<Val> &inputs,
                            std::vector<Val> &outputs, void *user_data) {
    std::cout << "Hello from C++" << std::endl;
    std::cout << (const char *)user_data << std::endl;
    std::cout << tmp << std::endl;
    outputs[0].v = inputs[0].v;
  };

  std::vector<Function> functions = {
      Function("hello_world", {ValType::I64}, {ValType::I64}, hello_world,
               (void *)"Hello again!",
               [](void *x) { std::cout << "Free user data" << std::endl; }),
  };

  // NOTE: if you encounter an error such as: 
  // "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
  // set the second argument to `true` in the following function to provide WASI imports to your plugin.
  Plugin plugin = context.plugin(wasm, false, functions);

  const char *input = argc > 1 ? argv[1] : "this is a test";
  ExtismSize length = strlen(input);

  extism::Buffer output = plugin.call("count_vowels", (uint8_t *)input, length);
  std::cout << (char *)output.data << std::endl;
  return 0;
}
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

