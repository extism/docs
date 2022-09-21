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

```python title=app.py
import sys
import os
import json
import hashlib

sys.path.append(".")
from extism import Plugin, Context

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

    plugin = context.plugin(config)
    # Call `count_vowels`
    j = json.loads(plugin.call("count_vowels", data))
    print("Number of vowels:", j["count"])
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

