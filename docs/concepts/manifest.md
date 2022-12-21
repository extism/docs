---
title: The Manifest
sidebar_position: 4
---

The manifest is a description of your plugin and some of the runtime constraints to apply to it. You can think of it as a blueprint to build your plugin.

```python tile=run-plugin.py
with Context() as context:
    wasm = open("../wasm/code.wasm", 'rb').read()
    wasm_hash = hashlib.sha256(wasm).hexdigest()
    config = {
        "wasm": [
            {
                "data": wasm,
                "hash": wasm_hash
            }
        ],
        "memory": {
            "max": 5
        }
    }

    plugin = context.plugin(config)
```

### Schema

```python schema.py
{
    # The "wasm" key describes the wasm code needed to build the plugin.
    # There are a few ways to load wasm code:
    "wasm": [
        # you can point to a file:
        {
            # a file path for a plugin on disk
            "path": "./code/myplugin.wasm",
            # an optional name
            "name": "main",
            # the optional sha256 hash in hex form (it's optional, but recommended)
            "hash": "15c66d72f683e0225c774134b42ba6e04275a7a56b0a522af538d029650f15a8",
        },
        # or, you can pass raw binary data for the code already in memory:
        {
            # the base64-encoded raw bytes of the wasm module
            "data": open("../wasm/code.wasm", 'rb').read(),
            # an optional name
            "name": "main",
            # the optional sha256 hash in hex form (it's optional, but recommended)
            "hash": "15c66d72f683e0225c774134b42ba6e04275a7a56b0a522af538d029650f15a8",
        },
        # or, you can load a remote resource with a URL:
        {
            # an object representing an HTTP request
            "req": {
                # a URL to some wasm code
                "url": "https://example.com/mycode.wasm",
                # optional headers you may need to get the data, e.g. auth headers
                "header": {
                    "X-API-KEY": "34b42ba6e04275",
                    "User-Agent": "extism",
                },
                # optional HTTP method to use, (default: GET)
                "method": "GET"
            },
            # an optional name
            "name": "main",
            # the optional sha256 hash in hex form (it's optional, but recommended)
            "hash": "15c66d72f683e0225c774134b42ba6e04275a7a56b0a522af538d029650f15a8",
        },
    ]

    # Describes the limits on the memory the plugin may be allocated.
    # The units here are pages where a page is 64Kib. e.g. 16 pages would require 1GiB.
    "memory": {
        # The max amount of pages the plugin can allocate
        "max": 4
    },

    # An optional set of hosts this plugin can communicate with.
    # This only has an effect if the plugin makes HTTP requests.
    # Note: if left empty, all hosts are allowed.
    "allowed_hosts": [
        "example.com",
        "extism.org",
    ]

    # The "config" key is a free-form map that can be passed to the plugin.
    # A plugin author must know the arbitrary data this map may contain, so your own documentation should include some information about the "config" passed in.
    "config": {
        "mykey": "myvalue"
    }
}
```

### Validating the Manifest

If needed, we maintain an exported JSON schema for the manifest which [you can find here](https://raw.githubusercontent.com/extism/extism/main/manifest/schema.json).

![JSON Schema manifest](/img/manifest-schema.png)
