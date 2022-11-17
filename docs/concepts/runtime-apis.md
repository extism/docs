---
title: Runtime APIs
sidebar_position: 3
---

The Extism `runtime` is a Rust crate, from which we [generate C headers](https://github.com/extism/extism/blob/main/runtime/extism.h) so that any language which supports a C-compatible FFI can bind functions to the runtime itself and embed Extism. This is how the official SDKs are created. 

If you would like to embed Extism into a language that we currently do not support, you should take a look at the header file linked above. 

The general set of functions that is necessary to satisfy the runtime requirements is:

### `extism_context_new`

Create a new context.

```c
struct ExtismContext *extism_context_new(void);
```

---

### `extism_context_free`

Free a context.

```c
void extism_context_free(struct ExtismContext *ctx);
```

---

### `extism_plugin_new`

Create a new plugin.
- `wasm`: is a WASM module (wat or wasm) or a JSON encoded manifest
- `wasm_size`: the length of the `wasm` parameter
- `with_wasi`: enables/disables WASI

```c
ExtismPlugin extism_plugin_new(struct ExtismContext *ctx,
                               const uint8_t *wasm,
                               ExtismSize wasm_size,
                               bool with_wasi);
```

---

### `extism_plugin_update`

Update a plugin, keeping the existing ID.

Similar to `extism_plugin_new` but takes an `index` argument to specify which plugin to update.

Memory for this plugin will be reset upon update.

```c
bool extism_plugin_update(struct ExtismContext *ctx,
                          ExtismPlugin index,
                          const uint8_t *wasm,
                          ExtismSize wasm_size,
                          bool with_wasi);
```

---

### `extism_plugin_free`

Remove a plugin from the registry and free associated memory.

```c
void extism_plugin_free(struct ExtismContext *ctx, ExtismPlugin plugin);
```

---

### `extism_context_reset`

Remove all plugins from the registry.

```c
void extism_context_reset(struct ExtismContext *ctx);
```

---

### `extism_plugin_config`

Update plugin config values, this will merge with the existing values.

```c
bool extism_plugin_config(struct ExtismContext *ctx,
                          ExtismPlugin plugin,
                          const uint8_t *json,
                          ExtismSize json_size);
```

---

### `extism_plugin_function_exists`

Returns true if `func_name` exists.

```c
bool extism_plugin_function_exists(struct ExtismContext *ctx,
                                   ExtismPlugin plugin,
                                   const char *func_name);
```

---

### `extism_plugin_call`

Call a function.
- `func_name`: is the function to call
- `data`: is the input data
- `data_len`: is the length of `data`

```c
int32_t extism_plugin_call(struct ExtismContext *ctx,
                           ExtismPlugin plugin_id,
                           const char *func_name,
                           const uint8_t *data,
                           ExtismSize data_len);
```

---

### `extism_error`

Get the error associated with a `Context` or `Plugin`, if `plugin` is `-1` then the context error will be returned.

```c
const char *extism_error(struct ExtismContext *ctx, ExtismPlugin plugin);
```

---

### `extism_plugin_output_length`

Get the length of a plugin's output data.

```c
ExtismSize extism_plugin_output_length(struct ExtismContext *ctx, ExtismPlugin plugin);
```

---

### `extism_plugin_output_data`

Get the plugin's output data.

```c
const uint8_t *extism_plugin_output_data(struct ExtismContext *ctx, ExtismPlugin plugin);
```

---

### `extism_log_file`

Set log file and level.

```c
bool extism_log_file(const char *filename, const char *log_level);
```

---

### `extism_version`

Get the Extism version string.

```c
const char *extism_version(void);
```

---

## Additionally, some important type definitions: 

### `ExtismContext`

A `Context` is used to store and manage plugins

```c
typedef struct ExtismContext ExtismContext;
```

---

### `ExtismPlugin`

```c
typedef int32_t ExtismPlugin;
```

---

### `ExtimsSize`

```c
typedef uint64_t ExtismSize;
```