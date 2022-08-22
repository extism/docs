---
title: Python
tags:
    - python
    - host sdk
---

# Using the Python Host SDK


:::caution Check your installation

Please be sure you've installed Extism before continuing with this guide.

Visit those docs [here](/docs/install).

:::

### 1. Install the Python library

Install via [PyPi](https://pypi.org/):
```sh
pip install extism
# or 
poetry add extism
```

Install via `git`:
```sh
# TODO
```

### 2. Import the library and use the APIs

```python title=app.py
import os
import json
import hashlib

from extism import Plugin

if len(sys.argv) > 1:
    data = sys.argv[1].encode()
else:
    data = b"some data from python!"

wasm = open("../wasm/code.wasm", 'rb').read()
hash = hashlib.sha256(wasm).hexdigest()
config = {"wasm": [{"data": wasm, "hash": hash}], "memory": {"max": 5}}

plugin = Plugin(config)

# Call `count_vowels`
j = json.loads(plugin.call("count_vowels", data))
print("Number of vowels:", j["count"])

```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

