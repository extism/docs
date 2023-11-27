---
title: Run a Plug-in
toc_max_heading_level: 2
tags:
    - host sdk
    - runtime
---

# Quickstart

The following provides a minimal guide to running an Extism plug-in in your language
and platform of choice. This document should get you from 0 to "hello, world!" as quick
as possible.


## Choose A Language

In Extism parlance, your normal (non-wasm) application is known as the "host".
We offer a variety of libraries, which we call "Host SDKs", to help you embed
Extism into your language. First choose a language:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="javascript" label="JavaScript" default>

### Install the Dependency

The module is hosted on [npm](https://www.npmjs.com/package/@extism/extism).
Put the `@extism/extism` dependency in your `package.json`:

```bash
npm install @extism/extism --save
```

### Require the library and load a plug-in

Let's now run a plug-in from inside of [node.js](https://nodejs.org/en/).

:::note Supported Runtimes
This library is also compatible with [Browsers, Deno, and Bun](https://github.com/extism/js-sdk#compatibility).
:::

We suggest you copy paste the following code here into a node.js shell:

:::note Count Vowels Plugin
`count_vowels.wasm` is an example plugin that counts vowels. It was written in Rust, but can
be written in any of the supported PDK languages.
:::

```javascript title=repl.js
const createPlugin = require("@extism/extism")

const plugin = await createPlugin(
    'https://github.com/extism/plugins/releases/latest/download/count_vowels.wasm',
    { useWasi: true }
);
```

### Call an export function

Let's call the "count_vowels" export function on the plugin. This counts the number
of vowels in the string we pass in and returns a JSON encoded result.

```javascript title=repl.js
let out = await plugin.call("count_vowels", "Hello, World!");
console.log(out.text())
// => '{"count":3,"total":3,"vowels":"aeiouAEIOU"}'
```

### Documentation

Congrats! You just ran your first Extism plug-in. To learn more about what this
ruby library can do, see the [js-sdk README](https://github.com/extism/js-sdk#readme) and [reference docs](https://extism.github.io/js-sdk/).

If you're interested in learning how to write a plug-in, see the [plugin quickstart](/docs/quickstart/plugin-quickstart).

  </TabItem>
  <TabItem value="go" label="Go">

### Install the Dependency

Install via go get:

```bash
go get github.com/extism/go-sdk
```

### Require the library and load a plug-in

Let's now run a plug-in in Go.

:::note Count Vowels Plugin
`count_vowels.wasm` is an example plugin that counts vowels. It was written in Rust, but can
be written in any of the supported PDK languages.
:::

Copy paste this into a main function in `main.go`:

```go title=main.go
package main

import (
	"context"
	"fmt"
	"github.com/extism/go-sdk"
	"os"
)

func main() {
	manifest := extism.Manifest{
		Wasm: []extism.Wasm{
			extism.WasmUrl{
				Url: "https://github.com/extism/plugins/releases/latest/download/count_vowels.wasm",
			},
		},
	}

	ctx := context.Background()
	config := extism.PluginConfig{}
	plugin, err := extism.NewPlugin(ctx, manifest, config, []extism.HostFunction{})

	if err != nil {
		fmt.Printf("Failed to initialize plugin: %v\n", err)
		os.Exit(1)
	}
}

```

### Call an export function

Let's call the "count_vowels" export function on the plugin. This counts the number
of vowels in the string we pass in and returns a JSON encoded result.

Copy-paste this code to the end of your main func:

```go title=main.go
func main() {
    // ...

	data := []byte("Hello, World!")
	exit, out, err := plugin.Call("count_vowels", data)
	if err != nil {
		fmt.Println(err)
		os.Exit(int(exit))
	}

	response := string(out)
	fmt.Println(response)
}
```

Run the program:

```bash
$ go run main.go
# => {"count":3,"total":3,"vowels":"aeiouAEIOU"}
```

### Documentation

Congrats! You just ran your first Extism plug-in. To learn more about what this
ruby library can do, see the [go-sdk README](https://github.com/extism/go-sdk#readme) and [reference docs](https://pkg.go.dev/github.com/extism/go-sdk).

If you're interested in learning how to write a plug-in, see the [plugin quickstart](/docs/quickstart/plugin-quickstart).

  </TabItem>
  <TabItem value="ruby" label="Ruby">

### Install the Dependency

The ruby gem is hosted on [RubyGems](https://rubygems.org/gems/extism).
Put the `extism` gem in your `Gemfile`:

```rb
gem 'extism', '1.0.0.pre.rc.4'
```

Or install with `gem install` if you are not using bundler:

```sh
gem install extism --pre
```

### Require the library and load a plug-in

Let's now run a plug-in from ruby. We suggest you copy paste the following code here
into an irb or pry shell:

:::note Count Vowels Plugin
`count_vowels.wasm` is an example plugin that counts vowels. It was written in Rust, but can
be written in any of the supported PDK languages.
:::

```ruby title=irb.rb
require 'extism'

url = "https://github.com/extism/plugins/releases/latest/download/count_vowels.wasm"
manifest = Extism::Manifest.from_url(url)
plugin = Extism::Plugin.new(manifest)
```

### Call an export function

Let's call the "count_vowels" export function on the plugin. This counts the number
of vowels in the string we pass in and returns a JSON encoded result.

```ruby title=irb.rb
plugin.call("count_vowels", "Hello, World!")
# => {"count": 3, "total": 3, "vowels": "aeiouAEIOU"}
```

### Documentation

Congrats! You just ran your first Extism plug-in. To learn more about what this
ruby library can do, see the [ruby-sdk README](https://github.com/extism/ruby-sdk) and [reference docs](https://extism.github.io/ruby-sdk/).

If you're interested in learning how to write a plug-in, see the [plugin quickstart](/docs/quickstart/plugin-quickstart).

  </TabItem>
  <TabItem value="python" label="Python">

### Install the Dependency

Install this package from [PyPI](https://pypi.org/project/extism/):

```bash
# using pip
$ pip install extism==1.0.0rc0 --pre

# using poetry
$ poetry add extism=^1.0.0rc0 --allow-prereleases
```

### Require the library and load a plug-in

Let's now run a plug-in from python. We suggest you copy paste the following code here
into a python interpreter:

:::note Count Vowels Plugin
`count_vowels.wasm` is an example plugin that counts vowels. It was written in Rust, but can
be written in any of the supported PDK languages.
:::

```python title=python.py
import extism

url = "https://github.com/extism/plugins/releases/latest/download/count_vowels.wasm"
manifest = {"wasm": [{"url": url}]}
plugin = extism.Plugin(manifest):
```

### Call an export function

Let's call the "count_vowels" export function on the plugin. This counts the number
of vowels in the string we pass in and returns a JSON encoded result.

```python title=python.py
wasm_vowel_count = plugin.call(
    "count_vowels",
    "hello world"
)
print(wasm_vowel_count)
# => {"count": 3, "total": 3, "vowels": "aeiouAEIOU"}
```

### Documentation

Congrats! You just ran your first Extism plug-in. To learn more about what this
ruby library can do, see the [python-sdk README and reference docs](https://github.com/extism/python-sdk).

TODO fix link:
If you're interested in writing how to write a plug-in, see the [plugin quickstart](/).

  </TabItem>
  <TabItem value="haskell" label="Haskell">
  </TabItem>
  <TabItem value="Go" label="Go">
  </TabItem>
  <TabItem value="C" label="C">
  </TabItem>
  <TabItem value="C++" label="C++">
  </TabItem>
  <TabItem value="OCaml" label="OCaml">
  </TabItem>
  <TabItem value="PHP" label="PHP">
  </TabItem>
  <TabItem value="Rust" label="Rust">
  </TabItem>
  <TabItem value="Zig" label="Zig">
  </TabItem>
  <TabItem value=".NET" label=".NET">
  </TabItem>
  <TabItem value="Elixir/Erlang" label="Elixir/Erlang">
  </TabItem>
  <TabItem value="Java" label="Java">
  </TabItem>
  <TabItem value="Node" label="Node">
  </TabItem>
</Tabs>


## Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!
