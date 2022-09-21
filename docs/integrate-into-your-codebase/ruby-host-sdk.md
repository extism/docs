---
title: Ruby
tags:
    - ruby
    - host sdk
---

# Using the Ruby Host SDK


:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the Ruby gem

Install via [RubyGems](https://rubygems.org/):
```sh
# TODO 
```

### 2. Require the library and use the APIs

```ruby title=index.rb
require 'extism'
require 'json'

# a Context provides a scope for plugins to be managed within. creating multiple contexts
# is expected and groups plugins based on source/tenant/lifetime etc.
ctx = Extism::Context.new
Extism::with_context {|ctx| 
  manifest = {
    :wasm => [{:path => "../wasm/code.wasm"}]
  }

  plugin = ctx.plugin(manifest)
  res = JSON.parse(plugin.call("count_vowels", ARGV[0] || "this is a test"))
  
  puts res['count']
}
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

