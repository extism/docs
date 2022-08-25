---
title: Go
tags:
    - go
    - golang
    - host sdk
---
# Using the Go Host SDK

:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the Go module

Install via `go get`:
```sh
go get github.com/extism/extism
```

### 2. Import the module and use the APIs

```c title=main.go
package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/extism/extism"
)

func main() {
	// set some input data to provide to the plugin module
	var data []byte
	if len(os.Args) > 1 {
		data = []byte(os.Args[1])
	} else {
		data = []byte("testing from go -> wasm shared memory...")
	}

	manifest := extism.Manifest{Wasm: []extism.Wasm{extism.WasmFile{Path: "../wasm/code.wasm"}}}
	plugin, err := extism.LoadManifest(manifest, false)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// use the extism Go library to provide the input data to the plugin, execute it, and then
	// collect the plugin state and error if present
	out, err := plugin.Call("count_vowels", data)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// "out" is []byte type, and the plugin sends back json, so deserialize it into a map.
	// expect this object: `{"count": n}`
	var dest map[string]int
	json.Unmarshal(out, &dest)

	fmt.Println("Count:", dest["count"])
}
```

### Other Documentation

See the module documentation at: https://pkg.go.dev/github.com/extism/extism

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

