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
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```
:::

```python title=app.py
import sys
import json
import hashlib
import pathlib

from extism import Plugin

# Compare against Python implementation.
def count_vowels(data):
    return sum(letter in b"AaEeIiOoUu" for letter in data)


def main(args):
    if len(args) > 1:
        data = args[1].encode()
    else:
        data = b"some data from python!"

    wasm_file_path = pathlib.Path(__file__).parent / "code.wasm"
    wasm = wasm_file_path.read_bytes()
    hash = hashlib.sha256(wasm).hexdigest()
    config = {"wasm": [{"data": wasm, "hash": hash}]}

    # NOTE: if you encounter an error such as: 
    # "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
    # pass `wasi=True` in the following function to provide WASI imports to your plugin.
    plugin = Plugin(config)
    # Call `count_vowels`
    wasm_vowel_count = json.loads(plugin.call("count_vowels", data))

    print("Number of vowels:", wasm_vowel_count["count"])

    assert wasm_vowel_count["count"] == count_vowels(data)


if  __name__ == "__main__":
    main(sys.argv)
```

### Host Functions

It is also possible to create functions to expose additional functionality from the host by using [Host Functions](/docs/concepts/host-functions/).

:::note Count Vowels Plugin
To run this example, use the version of the count vowels plugin with the example host function:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code-functions.wasm > code.wasm
```

```python
from extism import host_fn, Function, ValType

@host_fn
def hello_world(plugin, input_, output, a_string, another_string):
    print("Hello from Python!")

    # Print input argument
    mem = plugin.memory_at_offset(input_[0])
    print(plugin.memory(mem)[:])

    # Print user data
    print(a_string)
    print(another_string)

    # Set output to input 
    output[0] = input_[0]


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

plugin = Plugin(config, wasi=True, functions=functions)
```

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

