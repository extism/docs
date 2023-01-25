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

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code-functions.wasm > code.wasm
```
:::

```c title=main.go
package main



import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/extism/extism"
)

func main() {
	ctx := extism.NewContext()
	defer ctx.Free() // this will free the context and all associated plugins

	// set some input data to provide to the plugin module
	var data []byte
	if len(os.Args) > 1 {
		data = []byte(os.Args[1])
	} else {
		data = []byte("testing from go -> wasm shared memory...")
	}

	manifest := extism.Manifest{Wasm: []extism.Wasm{extism.WasmFile{Path: "../wasm/code.wasm"}}}
	
	// NOTE: if you encounter an error such as: 
	// "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
	// change `false` to `true` in the following function to provide WASI imports to your plugin.
	plugin, err := ctx.PluginFromManifest(manifest, []Function{}, false)
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

### Host Functions

It is also possible to create functions to expose additional functionality from the host. The first step
is to declare it using `EXTISM_GO_FUNCTION` and define a function with the proper signature:

```go
/*
#include <extism.h>
EXTISM_GO_FUNCTION(hello_world);
*/
import "C"

//export hello_world
func hello_world(plugin unsafe.Pointer, inputs *C.ExtismVal, nInputs C.ExtismSize, outputs *C.ExtismVal, nOutputs C.ExtismSize, userData uintptr) {
	fmt.Println("Hello from Go!")
	s := cgo.Handle(userData)
	fmt.Println(s.Value().(string))
	inputSlice := unsafe.Slice(inputs, nInputs)
	outputSlice := unsafe.Slice(outputs, nOutputs)

	// Get memory pointed to by first element of input slice
	p := extism.GetCurrentPlugin(plugin)
	mem := p.Memory(extism.ValGetUInt(unsafe.Pointer(&inputSlice[0])))
	fmt.Println(string(mem))

	outputSlice[0] = inputSlice[0]
}
```

Then add it to the plugin when it's created: 

```go
// Create host function
f := extism.NewFunction("hello_world", []extism.ValType{extism.I64}, []extism.ValType{extism.I64}, C.hello_world, "Hello again!")
defer f.Free()
plugin, err := ctx.PluginFromManifest(manifest, []Function{f}, false)
```

### Other Documentation

See the module documentation at: https://pkg.go.dev/github.com/extism/extism

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

