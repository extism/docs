---
title: C
tags:
    - c
    - host sdk
---

# Using the C Host SDK


:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the C library

Install via `git`:
```sh
git submodule add https://github.com/extism/extism extism
```

### 2. Include the library and use the APIs

```c title=main.c
#include "extism/runtime/extism.h"

#include <assert.h>
#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

uint8_t *read_file(const char *filename, size_t *len) {

  FILE *fp = fopen(filename, "rb");
  if (fp == NULL) {
    return NULL;
  }
  fseek(fp, 0, SEEK_END);
  size_t length = ftell(fp);
  fseek(fp, 0, SEEK_SET);

  uint8_t *data = malloc(length);
  if (data == NULL) {
    return NULL;
  }

  assert(fread(data, 1, length, fp) == length);
  fclose(fp);

  *len = length;
  return data;
}

int main(int argc, char *argv[]) {
  if (argc < 2) {
    fputs("Not enough arguments\n", stderr);
    exit(1);
  }

  ExtismContext *ctx = extism_context_new();

  size_t len = 0;
  uint8_t *data = read_file("../wasm/code.wasm", &len);
  ExtismPlugin plugin = extism_plugin_new(ctx, data, len, false);
  free(data);
  if (plugin < 0) {
    exit(1);
  }

  assert(extism_plugin_call(ctx, plugin, "count_vowels", (uint8_t *)argv[1],
                            strlen(argv[1])) == 0);
  ExtismSize out_len = extism_plugin_output_length(ctx, plugin);
  const uint8_t *output = extism_plugin_output_data(ctx, plugin);
  write(STDOUT_FILENO, output, out_len);
  write(STDOUT_FILENO, "\n", 1);

  extism_plugin_free(ctx, plugin);
  extism_context_free(ctx);
  return 0;
}
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

