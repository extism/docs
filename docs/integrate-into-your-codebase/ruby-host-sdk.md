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

The gem is hosted on [RubyGems](https://rubygems.org/gems/extism).
Put the `extism` gem in your `Gemfile`:

```rb
gem "extism", "~> 0.5.0"
```

Or install with `gem install` if you are not using bundler:

```sh
gem install extism
```

### 2. Require the library and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```
:::

```ruby title=app.rb
require 'extism'
require 'json'

manifest = {
  :wasm => [{:path => "code.wasm"}]
}


# NOTE: if you encounter an error such as: 
# "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
# pass `true` after `manifest` in the following function to provide WASI imports to your plugin.
plugin = Extism::Plugin.new(manifest)
res = JSON.parse(plugin.call("count_vowels", ARGV[0] || "this is a test"))

puts res['count']
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

