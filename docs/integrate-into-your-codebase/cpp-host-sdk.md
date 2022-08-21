---
title: C++
---

# Using the C++ Host SDK


:::caution Installation check!

Before continuing with this guide, please be sure you've gone through the **"Install Extism"** portion of the documentation.

Visit those docs [here](/docs/install).

:::

### 1. Install the C++ library

Install via [Conan](https://conan.io):
```sh
# TODO
```

Install via `git`:
```sh
git submodule add https://github.com/extism/extism cpp
```

### 2. Include the library and use the APIs

```c title=main.cpp
#include "extism.hpp"

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
  Plugin plugin(wasm);

  if (argc < 2) {
    std::cout << "Not enough arguments" << std::endl;
    return 1;
  }

  auto input = std::vector<uint8_t>((uint8_t *)argv[1],
                                    (uint8_t *)argv[1] + strlen(argv[1]));
  auto output = plugin.call("count_vowels", input);
  std::string str(output.begin(), output.end());
  std::cout << str << std::endl;
  return 0;
}
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](#) where the project maintainers and users can help you. Come hang out!

