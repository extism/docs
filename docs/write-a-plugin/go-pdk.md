---
title: Go
sidebar_position: 3
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

To limit the amount of memory available to an individual module, create a `target.json` file:

```json
{
    "inherits": [ "wasm" ],
    "ldflags": [
        "--max-memory=65536",
    ]
}
```

and compile with `tinygo -target ./target.json`


### Latest Docs

[https://pkg.go.dev/github.com/extism/go-pdk](https://pkg.go.dev/github.com/extism/go-pdk)


### Example Usage

#### Using Config, I/O, & Persisted Variables

```go title=main.go
package main

import (
	"strconv"

	"github.com/extism/go-pdk"
)

//export count_vowels
func count_vowels() int32 {
	input := pdk.Input()

	count := 0
	for _, a := range input {
		switch a {
		case 'A', 'I', 'E', 'O', 'U', 'a', 'e', 'i', 'o', 'u':
			count++
		default:
		}
	}

	// test some extra pdk functionality
	if pdk.GetVar("a") == nil {
		pdk.SetVar("a", []byte("this is var a"))
	}
	varA := pdk.GetVar("a")
	thing, ok := pdk.GetConfig("thing")

	if !ok {
		thing = "<unset by host>"
	}

	output := `{"count": ` + strconv.Itoa(count) + `, "config": "` + thing + `", "a": "` + string(varA) + `"}`
	mem := pdk.AllocateString(output)

	// zero-copy output to host
	pdk.OutputMemory(mem)

	return 0
}

func main() {}
```

#### Using Extism built-in HTTP

```go title=http.go
package main

import (
	"github.com/extism/go-pdk"
)

//export http_get
func http_get() int32 {
	// create an HTTP Request (without relying on WASI), set headers as needed
	req := pdk.NewHTTPRequest("GET", "https://jsonplaceholder.typicode.com/todos/1")
	req.SetHeader("some-name", "some-value")
	req.SetHeader("another", "again")
	// send the request, get response back (can check status on response via res.Status())
	res := req.Send()

	// zero-copy output to host
	pdk.OutputMemory(res.Memory())

	return 0
}

func main() {}
```