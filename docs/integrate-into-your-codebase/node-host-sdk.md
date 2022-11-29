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

```javascript title=index.js
const { withContext, Context } = require('@extism/extism');
const { readFileSync } = require('fs');

withContext(async function (context) {
  let wasm = readFileSync('../wasm/code.wasm');
  let p = context.plugin(wasm);

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

