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
    fclose(fp);
    return NULL;
  }

  assert(fread(data, 1, length, fp) == length);
  fclose(fp);

  *len = length;
  return data;
}

// This function will be registered as a host function - this means that WebAssembly
// modules can import the function and call it directly from inside a plugin.
void hello_world(ExtismCurrentPlugin *plugin, const struct ExtismVal *inputs,
                 uint64_t n_inputs, struct ExtismVal *outputs,
                 uint64_t n_outputs, void *data) {
  puts("Hello from C!");
  puts(data);

  // Get offset and length for input memory block
  ExtismSize ptr_offs = inputs[0].v.i64;
  uint64_t length = extism_current_plugin_memory_length(plugin, ptr_offs);

  // Read the plugin memory
  uint8_t *buf = extism_current_plugin_memory(plugin) + ptr_offs;
  fwrite(buf, length, 1, stdout);
  fputc('\n', stdout);

  // Set output to input
  outputs[0].v.i64 = inputs[0].v.i64;
}

int main(int argc, char *argv[]) {
  if (argc < 2) {
    fputs("Not enough arguments\n", stderr);
    exit(1);
  }

  ExtismContext *ctx = extism_context_new();

  size_t len = 0;

  // Read count-vowels example with `hello_world` host function
  uint8_t *data = read_file("../wasm/code-functions.wasm", &len);

  // Input is a single i64 parameter, a pointer to a block of memory
  ExtismValType inputs[] = {I64};

  // Output is a signle i64 parameter, a pointer to a block of memory 
  ExtismValType outputs[] = {I64};

  // Create the function
  ExtismFunction *hello_world_f = extism_function_new("hello_world", inputs, 1, outputs, 1,
                                          hello_world, "Hello, again!", NULL);

  // NOTE: if you encounter an error such as: 
  // "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
  // change `false` to `true` in the following function to provide WASI imports to your plugin.
  ExtismPlugin plugin = extism_plugin_new(ctx, data, len, &hello_world_f, 1, true);
  free(data);
  if (plugin < 0) {
    exit(1);
  }

  // Call the function
  assert(extism_plugin_call(ctx, plugin, "count_vowels", (uint8_t *)argv[1],
                            strlen(argv[1])) == 0);

  // Get output
  ExtismSize out_len = extism_plugin_output_length(ctx, plugin);
  const uint8_t *output = extism_plugin_output_data(ctx, plugin);
  write(STDOUT_FILENO, output, out_len);
  write(STDOUT_FILENO, "\n", 1);

  // Cleanup
  extism_plugin_free(ctx, plugin);
  extism_function_free(hello_world_f);
  extism_context_free(ctx);
  return 0;
}
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

