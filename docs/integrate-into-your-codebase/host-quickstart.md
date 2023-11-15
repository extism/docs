---
title: Quickstart
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
  <TabItem value="ruby" label="Ruby" default>

## Install the Dependency

The ruby gem is hosted on [RubyGems](https://rubygems.org/gems/extism).
Put the `extism` gem in your `Gemfile`:

```rb
gem 'extism', '1.0.0.pre.rc.4'
```

Or install with `gem install` if you are not using bundler:

```sh
gem install extism --pre
```

## Require the library and load a plug-in

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

## Call an export function

Let's call the "count_vowels" export function on the plugin. This counts the number
of vowels in the string we pass in and returns a JSON encoded result.

```ruby title=irb.rb
plugin.call("count_vowels", "Hello, World!")
# => {"count": 3, "total": 3, "vowels": "aeiouAEIOU"}
```

## Documentation

Congrats! You just ran your first Extism plug-in. To learn more about what this
ruby library can do, see the [ruby-sdk README and reference docs](https://github.com/extism/ruby-sdk).

If you're interested in writing how to write a plug-in, see the [plugin quickstart](/todo).

  </TabItem>
  <TabItem value="python" label="Python">
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


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!
