---
title: Go
sidebar_position: 2
---

## How to install and use the Extism Go PDK

### Installation

```sh
go get github.com/extism/go-pdk
```

### Compiling to WebAssembly

Install the [TinyGo compiler](https://tinygo.org/getting-started/install/) and run:

```sh
tinygo build -o example.wasm -target wasi main.go
```

> **NOTE:** Currently all Go plugins must be compiled targeting `WASI`. Active work is being done to 
remove this requirement.

### Example Usage
```go title=main.go
package main

import (
	"strconv"

	"github.com/extism/go-pdk"
)

//export count_vowels
func count_vowels() int32 {
	host := pdk.NewHost()
	input := host.Input()

	count := 0
	for _, a := range input {
		switch a {
		case 'A', 'I', 'E', 'O', 'U', 'a', 'e', 'i', 'o', 'u':
			count++
		default:
		}
	}

    // Additional plug-in APIs:

    // persistent variables (scoped to individual plugin)
	vars := host.Vars()
	if vars.Get("a") == nil {
		vars.Set("a", []byte("this is var a"))
	}
	varA := vars.Get("a")

    // config, provided by the host
	thing := host.Config("thing")
	if thing == "" {
		thing = "<unset by host>"
	}

	// zero-copy output to host
	output := `{"count": ` + strconv.Itoa(count) + `, "config": "` + thing + `", "a": "` + string(varA) + `"}`
	mem := host.AllocateString(output)
	host.OutputMemory(mem)

	return 0
}

func main() {}
```
