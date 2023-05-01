---
title: Browser / JS
tags:
    - web
    - javascript
    - browser
    - host sdk
    - runtime
---

# Using the Browser Runtime SDK

### 1. Install the Javascript library

Install via `npm`:
```sh
npm install @extism/runtime-browser
```

### 2. Include the library and use the APIs

```javascript title=app.js
// import or require (depending on your module system)
import { ExtismContext } from "@extism/runtime-browser"

// You can load raw wasm bytes from file, request, etc
const manifest = { wasm: [{ data: "..." }] };

// Or you can pass in a path to a wasm file
// this is our count-vowels example plugin
const manifest = { wasm: [{ path: "https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm" }] };

const ctx = new ExtismContext();
const plugin = await ctx.newPlugin(manifest);

// call the function 'count_vowels' defined in the wasm module
let output = await plugin.call('count_vowels', 'this is a test');

console.log(JSON.parse(new TextDecoder().decode(output)));
```

### Current Plug-in Support

:::caution Limited Support

`extism_http_request` and `WASI` PDK functionality is currently unavailable, but please reach out on [Discord](https://discord.gg/cx3usBCWnc) or open an issue on the [Extism GitHub](https://github.com/extism/extism) repository to let us know you'd like to see them supported.

:::

### Host Functions

If your plug-in has any [host functions](/docs/concepts/host-functions), you can implement them in JS and pass them in through an object keyed by name:

```javascript
let helloWorld = function(index){
  console.log("Hello, " + this.allocator.getString(index));
  return index;
};
let plugin = await extismContext.newPlugin({ "wasm": [ { "path": url } ] }, {"hello_world": helloWorld});
```

### Playground

The [Extism Playground](https://playground.extism.org) is built using the Browser Runtime SDK, and its [source code is available](https://github.com/extism/playground) -- please test it out and use the Playground codebase as a reference in case it is helpful.

### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

