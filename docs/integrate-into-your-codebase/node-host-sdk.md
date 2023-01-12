---
title: Node
tags:
    - node
    - host sdk
---

# Using the Node Host SDK


:::caution Check your installation

Please be sure you've [installed Extism](/docs/install) before continuing with this guide.

:::

### 1. Install the Node module

Install via [npm](https://www.npmjs.com/):

```sh
npm install @extism/extism --save
```

### 2. Import the module and use the APIs

:::note Count Vowels Plugin
`code.wasm` in this example is our example plugin that counts vowels. If you want to run this, download it first and set the path:

```
curl https://raw.githubusercontent.com/extism/extism/main/wasm/code.wasm > code.wasm
```
:::

```javascript title=index.js
const { withContext, Context } = require('@extism/extism');
const { readFileSync } = require('fs');

function hello_world(currentPlugin, inputs, outputs, userData, userData1) {
  console.log("Hello from Javascript!");
  // Print data pointed to by input pointer
  let mem = currentPlugin.memory(inputs[0].v.i64);
  console.log(mem.toString());
  // Print user data
  console.log(userData);
  console.log(userData1);
  outputs[0] = inputs[0];
}


let functions = [
  new HostFunction(
    "hello_world",
    [ValType.I64],
    [ValType.I64],
    f,
    "Hello again!",
    "Hello once more!",
  )
];

withContext(async function (context) {
  let wasm = readFileSync('../wasm/code-functions.wasm');
  // NOTE: if you encounter an error such as: 
  // "Unable to load plugin: unknown import: wasi_snapshot_preview1::fd_write has not been defined"
  // change the second parameter to `true` in the following function to provide WASI imports to your plugin.
  let p = context.plugin(wasm, false, functions);

  if (!p.functionExists('count_vowels')) {
    console.log("no function 'count_vowels' in wasm");
    process.exit(1);
  }

  let buf = await p.call('count_vowels', process.argv[2] || 'this is a test');
  console.log(JSON.parse(buf.toString())['count']);
  p.free();
});

// or, use a context like this:
let ctx = new Context();
let wasm = readFileSync('../wasm/code.wasm');
let p = ctx.plugin(wasm);
// ... where the context can be passed around to various functions etc. 
```


### Need help?

If you've encountered a bug or think something is missing, please open an issue on the [Extism GitHub](https://github.com/extism/extism) repository.

There is an active community on [Discord](https://discord.gg/cx3usBCWnc) where the project maintainers and users can help you. Come hang out!

