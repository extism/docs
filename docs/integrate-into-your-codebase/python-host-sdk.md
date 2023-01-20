---
title: Python
tags:
    - python
    - host sdk
---

# Using the Python Host SDK


:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the Python library

Install via Pip:
```sh
pip3 install extism
```

Install via Poetry:
```sh
poetry add extism
```

### 2. Import the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code-functions.wasm > code.wasm
```
:::

```python title=app.py
import sys
import os
import json
import hashlib

from extism import Plugin, Context, host_fn

if len(sys.argv) > 1:
    data = sys.argv[1].encode()
else:
    data = b"some data from python!"

# a Context provides a scope for plugins to be managed within. creating multiple contexts
# is expected and groups plugins based on source/tenant/lifetime etc.
with Context() as context:
    wasm = open("../wasm/code.wasm", 'rb').read()
    hash = hashlib.sha256(wasm).hexdigest()
    config = {"wasm": [{"data": wasm, "hash": hash}], "memory": {"max": 5}}

    # NOTE: if you encounter an error such as: 
    # "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
    # pass `wasi=True` in the following function to provide WASI imports to your plugin.
    plugin = context.plugin(config)
    # Call `count_vowels`
    j = json.loads(plugin.call("count_vowels", data))
    print("Number of vowels:", j["count"])
```

### Host Functions

It is also possible to create functions to expose additional functionality from the host. The first step
is to define a function with the proper signature:

```python
@host_fn
def hello_world(plugin, input, output, a_string, another_string):
    print("Hello from Python!")

    # Print input argument
    mem = plugin.memory_at_offset(input[0])
    print(plugin.memory(mem)[:])

    # Print user data
    print(a_string)
    print(another_string)

    # Set output to input 
    output[0] = input[0]


```

Then add it to the plugin when it's created:

```python
functions = [
    Function(
        "hello_world",
        [ValType.I64],
        [ValType.I64],
        hello_world,
        "Hello again!",
        "Hello once more!",
    )
]

plugin = context.plugin(config, functions=functions)
```

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

