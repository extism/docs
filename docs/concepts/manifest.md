---
title: The Manifest
sidebar_position: 4
---

# The Manifest

The manifest is a descripition of your plugin and some of the runtime constraints to apply to it. You can think of it as a blueprint to build your plugin.

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

## The Schema

```python schema.py
{
    # the wasm key describes the wasm code needed to build the plugin
    # there are a few ways to load wasm code
    "wasm": [
        # you can point to a file
        {
            # a file path for a plugin on disk
            "path": "./code/myplugin.wasm",
            # an optional name
            "name": "main",
            # the optional sha256 hash in hex form, it's optional but recommended to do this
            "hash": "15c66d72f683e0225c774134b42ba6e04275a7a56b0a522af538d029650f15a8",
        },
        # or you can pass raw binary data for the code already in memory
        {
            # the raw bytes in the host memory <class 'bytes'>
            "data": open("../wasm/code.wasm", 'rb').read(),
            # an optional name
            "name": "main",
            # the optional sha256 hash in hex form, it's optional but recommended to do this
            "hash": "15c66d72f683e0225c774134b42ba6e04275a7a56b0a522af538d029650f15a8",
        },
        # Or you can load a remote resource with a URL
        {
            # an object representing an HTTP request
            "req": {
                # A url to some wasm code
                "url": "https://example.com/mycode.wasm",
                # optional headers you may need to get the data, e.g. auth headers
                "header": {
                    "X-API-KEY": "34b42ba6e04275",
                    "User-Agent": "extism",
                },
                # optional HTTP method to use
                "method": "GET"
            },
            # an optional name
            "name": "main",
            # the optional sha256 hash in hex form, it's optional but recommended to do this
            "hash": "15c66d72f683e0225c774134b42ba6e04275a7a56b0a522af538d029650f15a8",
        },
    ]

    # Describes the limits on the memory the plugin may own
    # The units here are pages where a page is 64Kib. 16 pages e.g. would 1GiB
    "memory": {
        # The max amount of pages the plugin can allocate
        "max": 4
    },

    # An optional set of hosts this plugin can communicate with
    # only has an effect if the plugin needs to make HTTP calls
    "allowed_hosts": [
        "example.com",
        "extism.org",
    ]

    # config is a free form set of keys and values that can be passed to the plugin
    # the plugin must have the knowledge how to use these
    "config": {
        "mykey": "myvalue"
    }
}
```

## Validating the manifest

If needed, we maintain an exported json schema for the manifest which [you can find here](https://raw.githubusercontent.com/extism/extism/main/manifest/schema.json).

![JSON Schema manifest](/img/manifest-schema.png)
