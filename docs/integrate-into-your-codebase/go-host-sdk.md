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
go get github.com/extism/go-sdk
```

### 2. Import the module and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

On Linux and Mac:
```sh
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```

On Windows:
```pwsh
Invoke-WebRequest -URI https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm -OutFile code.wasm
```
:::

```go title=main.go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	extism "github.com/extism/go-sdk"
)

func main() {
	// set some input data to provide to the plugin module
	var data []byte
	if len(os.Args) > 1 {
		data = []byte(os.Args[1])
	} else {
		data = []byte("testing from go -> wasm shared memory...")
	}

	manifest := extism.Manifest{
		Wasm: []extism.Wasm{
			extism.WasmFile{
				Path: "code.wasm",
			},
		},
	}

	ctx := context.Background()
	config := extism.PluginConfig{
		EnableWasi: false,
	}

	// NOTE: if you encounter an error such as:
	// "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
	// make sure extism.PluginConfig is set to `true` to provide WASI imports to your plugin.
	plugin, err := extism.NewPlugin(ctx, manifest, config, []extism.HostFunction{})

	if err != nil {
		fmt.Printf("Failed to initialize plugin: %v\n", err)
		os.Exit(1)
	}

	exit, out, err := plugin.Call("count_vowels", data)
	if err != nil {
		fmt.Println(err)
		os.Exit(int(exit))
	}

	// "out" is []byte type, and the plugin sends back json, so deserialize it into a map.
	// expect this object: `{"count": n}`
	var dest map[string]int
	json.Unmarshal(out, &dest)

	fmt.Println("Count:", dest["count"])
}

```

### Host Functions

It is also possible to create functions to expose additional functionality from the host by using [Host Functions](/docs/concepts/host-functions/). The first step
is to declare it using `EXTISM_GO_FUNCTION` and define a function with the proper signature:

:::note Count Vowels Plugin
To run this example, use the version of the count vowels plugin with the example host function:

On Linux and Mac:
```sh
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code-functions.wasm > code.wasm
```

On Windows:
```pwsh
Invoke-WebRequest -URI https://raw.githubusercontent.com/extism/extism/main/wasm/code-functions.wasm -OutFile code.wasm
```
:::
```go
hf := extism.HostFunction{
	Name:      "hello_world",
	Namespace: "env",
	Callback: func(ctx context.Context, p *extism.CurrentPlugin, userData interface{}, stack []uint64) {
		fmt.Printf("Hello from Go! User data: %s\n", userData)

		offset := stack[0]
		text, err := p.ReadString(offset)
		if err != nil {
			panic(err)
		}

		fmt.Println(text)

		stack[0] = offset
	},
	Params:   []byte{api.ValueTypeI64},
	Results:  []byte{api.ValueTypeI64},
	UserData: "user data",
}
```

Then add it to the plugin when it's created: 

```go
config := extism.PluginConfig{
	EnableWasi: true,
}

plugin, err := extism.NewPlugin(ctx, manifest, config, []extism.HostFunction{hf})
```

### Other Documentation

See the module documentation at: https://pkg.go.dev/github.com/extism/go-sdk

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/go-sdk) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

